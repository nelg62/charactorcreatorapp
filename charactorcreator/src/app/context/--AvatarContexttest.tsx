"use client";
import {
  createContext,
  SetStateAction,
  useContext,
  useMemo,
  useState,
} from "react";
import { JSONSchema7 } from "json-schema";
import { openPeeps } from "@dicebear/collection";
import { createAvatar, Options } from "@dicebear/core";

// Dicebear get options
export function getOptionsBySchema(schema: JSONSchema7) {
  const result: Record<string, any> = {};

  for (var key in schema.properties) {
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

const avatarChoices = getOptionsBySchema(openPeeps.schema);

console.log("avatarChoices", avatarChoices);

const avatarAccessoriesChoices = avatarChoices.accessories.choices;
type AccessoryType = typeof avatarAccessoriesChoices;

const avatarFaceChoices = avatarChoices.face.choices;
type FaceType = typeof avatarFaceChoices;

const avatarFacialHairChoices = avatarChoices.facialHair.choices;
type FacialHairType = typeof avatarFacialHairChoices;

interface AvatarContextType {
  avatarData: string;
  setSelectedAccessories: (accessory: AccessoryType) => void;
  setSelectedFacialHair: (facialHair: FacialHairType) => void;
  avatarAccessoriesChoices: AccessoryType;
  setSelectedFace: (face: FaceType) => void;
  avatarFaceChoices: FaceType;
  accessoriesEnabled: Boolean;
  facialHairEnabled: Boolean;
  setAccessoriesEnabled: React.Dispatch<SetStateAction<boolean>>;
  avatarFacialHairChoices: FacialHairType;
  setFacialHairEnabled: React.Dispatch<SetStateAction<boolean>>;
  clothingColor: string;
  setClothingColor: React.Dispatch<React.SetStateAction<string>>;
}

const AvatarContext = createContext<AvatarContextType | null>(null);

export const AvatarProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedAccessories, setSelectedAccessories] = useState<AccessoryType>(
    avatarAccessoriesChoices[0] as AccessoryType
  );
  const [selectedFace, setSelectedFace] = useState<FaceType>(
    avatarFaceChoices[0] as FaceType
  );

  const [selectedFacialHair, setSelectedFacialHair] = useState<FacialHairType>(
    avatarFacialHairChoices[0] as FacialHairType
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
        avatarAccessoriesChoices,
        setSelectedFace,
        avatarFaceChoices,
        accessoriesEnabled,
        setAccessoriesEnabled,
        setSelectedFacialHair,
        setFacialHairEnabled,
        facialHairEnabled,
        avatarFacialHairChoices,
        clothingColor,
        setClothingColor,
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
