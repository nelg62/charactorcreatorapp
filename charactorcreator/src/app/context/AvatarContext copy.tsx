"use client";
import { openPeeps } from "@dicebear/collection";
import { createAvatar } from "@dicebear/core";
import { JSONSchema7, JSONSchema7TypeName } from "json-schema";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useMemo,
  useState,
} from "react";

type AvatarOption = {
  type:
    | "string"
    | "number"
    | "integer"
    | "object"
    | JSONSchema7TypeName
    | JSONSchema7TypeName[]
    | undefined;
  choices?: string[];
  description?: string;
};

// Helper function o retrieve options fro schema from DiceBear Characters
export function getOptionsBySchema(schema: JSONSchema7) {
  const result: Record<string, AvatarOption> = {};

  for (const key in schema.properties) {
    if (false === schema.properties.hasOwnProperty(key)) {
      continue;
    }

    const property = schema.properties[key];

    if (typeof property === "object") {
      const option: AvatarOption = {
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

console.log("avatarChoices", avatarChoices);

// Typing for avatar options
const avatarAccessoriesChoices = avatarChoices.accessories.choices as string[];
const avatarFaceChoices = avatarChoices.face.choices as string[];
const avatarFacialHairChoices = avatarChoices.facialHair.choices as string[];
const avatarHeadChoices = avatarChoices.head.choices as string[];
const avatarMaskChoices = avatarChoices.mask.choices as string[];

// type AccessoryType = typeof avatarAccessoriesChoices;
// type FaceType = typeof avatarFaceChoices;
// type FacialHairType = typeof avatarFacialHairChoices;
// type HeadType = typeof avatarHeadChoices;
// type MaskType = typeof avatarMaskChoices;

// Avatar context type
interface AvatarContextType {
  avatarData: string;
  randomizeAvatar: () => void;
  setSelectedAccessories: (accessory: string) => void;
  setSelectedFace: (face: string) => void;
  setSelectedFacialHair: (facialHair: string) => void;
  setSelectedHead: (head: string) => void;
  setSelectedMask: (mask: string) => void;
  setAccessoriesEnabled: Dispatch<SetStateAction<boolean>>;
  setFacialHairEnabled: Dispatch<SetStateAction<boolean>>;
  setMaskEnabled: Dispatch<SetStateAction<boolean>>;
  setClothingColor: Dispatch<SetStateAction<string>>;
  setHeadContrastColor: Dispatch<SetStateAction<string>>;
  setBackgroundColor: Dispatch<SetStateAction<string>>;
  setSkinColor: Dispatch<SetStateAction<string>>;
  avatarAccessoriesChoices: string[] | string;
  avatarFaceChoices: string[];
  avatarFacialHairChoices: string[];
  avatarHeadChoices: string[];
  avatarMaskChoices: string[];
  accessoriesEnabled: boolean;
  facialHairEnabled: boolean;
  maskEnabled: boolean;
  clothingColor: string;
  headContrastColor: string;
  backgroundColor: string;
  skinColor: string;
}

// Context initialization
const AvatarContext = createContext<AvatarContextType | null>(null);

function getRandomItem<T>(items: T[]): T {
  const randomIndex = Math.floor(Math.random() * items.length);
  return items[randomIndex];
}

export const AvatarProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedAccessories, setSelectedAccessories] = useState<string>(
    avatarAccessoriesChoices[0]
  );
  const [selectedFace, setSelectedFace] = useState<string>(
    avatarFaceChoices[0]
  );

  const [selectedFacialHair, setSelectedFacialHair] = useState<string>(
    avatarFacialHairChoices[0]
  );

  const [selectedHead, setSelectedHead] = useState<string>(
    avatarHeadChoices[0]
  );

  const [selectedMask, setSelectedMask] = useState<string>(
    avatarMaskChoices[0]
  );

  const [clothingColor, setClothingColor] = useState<string>("8fa7df");
  const [headContrastColor, setHeadContrastColor] = useState<string>("2c1b18");
  const [backgroundColor, setBackgroundColor] = useState<string>("b6e3f4");
  const [skinColor, setSkinColor] = useState<string>("edb98a");
  const [accessoriesEnabled, setAccessoriesEnabled] = useState(true);
  const [facialHairEnabled, setFacialHairEnabled] = useState(true);
  const [maskEnabled, setMaskEnabled] = useState(false);

  const randomizeAvatar = () => {
    setSelectedAccessories(getRandomItem(avatarAccessoriesChoices));
    setSelectedFace(getRandomItem(avatarFaceChoices));
    setSelectedFacialHair(getRandomItem(avatarFacialHairChoices));
    setSelectedHead(getRandomItem(avatarHeadChoices));
    setSelectedMask(getRandomItem(avatarMaskChoices));

    setAccessoriesEnabled(Math.random() < 0.5);
    setFacialHairEnabled(Math.random() < 0.5);
    setMaskEnabled(Math.random() < 0.5);
    setClothingColor(Math.random().toString(16).substr(-6));
    setHeadContrastColor(Math.random().toString(16).substr(-6));
    setBackgroundColor(Math.random().toString(16).substr(-6));
    setSkinColor(Math.random().toString(16).substr(-6));
  };

  const avatarData = useMemo(() => {
    console.log("selectedAccessories", [selectedAccessories]);

    return createAvatar(openPeeps, {
      size: 128,
      accessories: [selectedAccessories],
      accessoriesProbability: accessoriesEnabled ? 100 : 0,
      face: [selectedFace],
      facialHair: [selectedFacialHair],
      facialHairProbability: facialHairEnabled ? 100 : 0,
      head: [selectedHead],
      mask: [selectedMask],
      maskProbability: maskEnabled ? 100 : 0,
      clothingColor: [clothingColor],
      headContrastColor: [headContrastColor],
      backgroundColor: [backgroundColor],
      skinColor: [skinColor],
    }).toDataUri();
  }, [
    selectedAccessories,
    accessoriesEnabled,
    selectedFace,
    selectedFacialHair,
    facialHairEnabled,
    selectedHead,
    selectedMask,
    maskEnabled,
    clothingColor,
    headContrastColor,
    backgroundColor,
    skinColor,
  ]);

  return (
    <AvatarContext.Provider
      value={{
        avatarData,
        setSelectedAccessories,
        setSelectedFace,
        setSelectedFacialHair,
        setSelectedHead,
        setSelectedMask,
        setAccessoriesEnabled,
        setFacialHairEnabled,
        setMaskEnabled,
        setClothingColor,
        setHeadContrastColor,
        setBackgroundColor,
        setSkinColor,
        avatarAccessoriesChoices,
        avatarFaceChoices,
        avatarFacialHairChoices,
        avatarHeadChoices,
        avatarMaskChoices,
        accessoriesEnabled,
        facialHairEnabled,
        maskEnabled,
        clothingColor,
        headContrastColor,
        backgroundColor,
        skinColor,
        randomizeAvatar,
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
