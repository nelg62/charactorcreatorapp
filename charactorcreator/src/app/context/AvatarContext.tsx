"use client";
import { openPeeps } from "@dicebear/collection";
import { createAvatar } from "@dicebear/core";
import { JSONSchema7 } from "json-schema";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useMemo,
  useState,
} from "react";

// Helper function o retrieve options fro schema from DiceBear Characters
export function getOptionsBySchema(schema: JSONSchema7) {
  const result: Record<string, any> = {};

  for (const key in schema.properties) {
    if (false === schema.properties.hasOwnProperty(key)) {
      continue;
    }

    const property = schema.properties[key];

    if (typeof property === "object") {
      const option: Record<string, any> = {
        type: property.type,
      };

      if (option.type === "integer") {
        option.type = "number";
      }

      option.choices = [];

      if (property.enum) {
        option.choices.push(
          ...property.enum.filter((v) => typeof v === "string")
        );
      }

      if (
        typeof property.items === "object" &&
        "enum" in property.items &&
        property.items.enum
      ) {
        option.choices.push(
          ...property.items.enum.filter((v) => typeof v === "string")
        );
      }

      if (option.choices.length === 0) {
        delete option.choices;
      }

      if (property.description) {
        option.description = property.description;
      }

      result[key] = option;
    }
  }

  return result;
}

// Get avatar options
const avatarChoices = getOptionsBySchema(openPeeps.schema);

// Typing for avatar options
const avatarAccessoriesChoices = avatarChoices.accessories.choices;
const avatarFaceChoices = avatarChoices.face.choices;
const avatarFacialHairChoices = avatarChoices.facialHair.choices;

type AccessoryType = typeof avatarAccessoriesChoices;
type FaceType = typeof avatarFaceChoices;
type FacialHairType = typeof avatarFacialHairChoices;

// Avatar context type
interface AvatarContextType {
  avatarData: string;
  setSelectedAccessories: (accessory: AccessoryType) => void;
  setSelectedFace: (face: FaceType) => void;
  setSelectedFacialHair: (facialHair: FacialHairType) => void;
  setAccessoriesEnabled: Dispatch<SetStateAction<boolean>>;
  setFacialHairEnabled: Dispatch<SetStateAction<boolean>>;
  setClothingColor: Dispatch<SetStateAction<string>>;
  avatarAccessoriesChoices: AccessoryType;
  avatarFaceChoices: FaceType;
  avatarFacialHairChoices: FacialHairType;
  accessoriesEnabled: boolean;
  facialHairEnabled: boolean;
  clothingColor: string;
}

// Context initialization
const AvatarContext = createContext<AvatarContextType | null>(null);

export const AvatarProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedAccessories, setSelectedAccessories] = useState<AccessoryType>(
    avatarAccessoriesChoices[0]
  );
  const [selectedFace, setSelectedFace] = useState<FaceType>(
    avatarFaceChoices[0]
  );

  const [selectedFacialHair, setSelectedFacialHair] = useState<FacialHairType>(
    avatarFacialHairChoices[0]
  );

  const [clothingColor, setClothingColor] = useState<string>("#8fa7df");
  const [accessoriesEnabled, setAccessoriesEnabled] = useState(true);
  const [facialHairEnabled, setFacialHairEnabled] = useState(true);

  const accessoriesProbability = accessoriesEnabled ? 100 : 0;
  const facialHairProbability = facialHairEnabled ? 100 : 0;

  const avatarData = useMemo(() => {
    return createAvatar(openPeeps, {
      size: 128,
      accessories: [selectedAccessories],
      accessoriesProbability,
      face: [selectedFace],
      facialHair: [selectedFacialHair],
      facialHairProbability,
      clothingColor: [clothingColor],
    }).toDataUri();
  }, [
    selectedAccessories,
    accessoriesProbability,
    selectedFace,
    selectedFacialHair,
    facialHairProbability,
    clothingColor,
  ]);

  return (
    <AvatarContext.Provider
      value={{
        avatarData,
        setSelectedAccessories,
        setSelectedFace,
        setSelectedFacialHair,
        setAccessoriesEnabled,
        setFacialHairEnabled,
        setClothingColor,
        avatarAccessoriesChoices,
        avatarFaceChoices,
        avatarFacialHairChoices,
        accessoriesEnabled,
        facialHairEnabled,
        clothingColor,
      }}
    >
      {children}
    </AvatarContext.Provider>
  );
};

export const useAvatar = () => {
  const context = useContext(AvatarContext);
  if (context === null) {
    throw new Error("useAvatar must be used within an AvatarProvider");
  }
  return context;
};
