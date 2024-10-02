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

console.log("avatarChoices", avatarChoices);

// Typing for avatar options
const avatarAccessoriesChoices = avatarChoices.accessories.choices;
const avatarFaceChoices = avatarChoices.face.choices;
const avatarFacialHairChoices = avatarChoices.facialHair.choices;
const avatarHeadChoices = avatarChoices.head.choices;
const avatarMaskChoices = avatarChoices.mask.choices;

type AccessoryType = typeof avatarAccessoriesChoices;
type FaceType = typeof avatarFaceChoices;
type FacialHairType = typeof avatarFacialHairChoices;
type HeadType = typeof avatarHeadChoices;
type MaskType = typeof avatarMaskChoices;

// Avatar context type
interface AvatarContextType {
  avatarData: string;
  randomizeAvatar: () => void;
  setSelectedAccessories: (accessory: AccessoryType) => void;
  setSelectedFace: (face: FaceType) => void;
  setSelectedFacialHair: (facialHair: FacialHairType) => void;
  setSelectedHead: (head: HeadType) => void;
  setSelectedMask: (mask: MaskType) => void;
  setAccessoriesEnabled: Dispatch<SetStateAction<boolean>>;
  setFacialHairEnabled: Dispatch<SetStateAction<boolean>>;
  setMaskEnabled: Dispatch<SetStateAction<boolean>>;
  setClothingColor: Dispatch<SetStateAction<string>>;
  setHeadContrastColor: Dispatch<SetStateAction<string>>;
  setBackgroundColor: Dispatch<SetStateAction<string>>;
  setSkinColor: Dispatch<SetStateAction<string>>;
  avatarAccessoriesChoices: AccessoryType;
  avatarFaceChoices: FaceType;
  avatarFacialHairChoices: FacialHairType;
  avatarHeadChoices: HeadType;
  avatarMaskChoices: MaskType;
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
  const [selectedAccessories, setSelectedAccessories] = useState<AccessoryType>(
    avatarAccessoriesChoices[0]
  );
  const [selectedFace, setSelectedFace] = useState<FaceType>(
    avatarFaceChoices[0]
  );

  const [selectedFacialHair, setSelectedFacialHair] = useState<FacialHairType>(
    avatarFacialHairChoices[0]
  );

  const [selectedHead, setSelectedHead] = useState<HeadType>(
    avatarHeadChoices[0]
  );

  const [selectedMask, setSelectedMask] = useState<MaskType>(
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
    selectedFace,
    selectedFacialHair,
    selectedHead,
    selectedMask,
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
