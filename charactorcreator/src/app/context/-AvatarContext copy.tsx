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
import { createAvatar } from "@dicebear/core";
import { MaskOffIcon } from "@radix-ui/react-icons";

// Utility to extract avatar options from schema
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
const accessoryChoices = avatarChoices.accessories.choices || [];
const faceChoices = avatarChoices.face.choices || [];
const facialHairChoices = avatarChoices.facialHair.choices || [];

// accessories -----
// accessoriesProbability -----
// clothingColor -----
// face -----
// facialHair -----
// facialhairprobability -----
// head -----
// headcontrastcolor ---
// Mask ---
// maskprobability---
// skincolor ----
// background color ---
// bacgound type

console.log("avatarChoices", avatarChoices);

// Avatar Context Types
interface AvatarContextType {
  avatarData: string;
  setSelection: (
    type: "accessories" | "face" | "facialHair",
    index: number
  ) => void;
  toggleEnabled: (type: "accessories" | "facialHair") => void;
  clothingColor: string;
  setClothingColor: React.Dispatch<React.SetStateAction<string>>;
  isAccessoryEnabled: boolean;
  isFacialHairEnabled: boolean;
  accessories: string[];
  face: string[];
  facialHair: string[];
}

const AvatarContext = createContext<AvatarContextType | null>(null);

export const AvatarProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedAccessories, setSelectedAccessories] = useState(
    accessoryChoices[0]
  );
  const [selectedFace, setSelectedFace] = useState(faceChoices[0]);
  const [selectedFacialHair, setSelectedFacialHair] = useState(
    facialHairChoices[0]
  );
  const [clothingColor, setClothingColor] = useState("8fa7df");
  const [isAccessoryEnabled, setIsAccessoryEnabled] = useState(true);
  const [isFacialHairEnabled, setIsFacialHairEnabled] = useState(true);

  const setSelection = (
    type: "accessories" | "face" | "facialHair",
    index: number
  ) => {
    if (type === "accessories") setSelectedAccessories(accessoryChoices[index]);
    if (type === "face") setSelectedFace(faceChoices[index]);
    if (type === "facialHair") setSelectedFacialHair(facialHairChoices[index]);
  };

  const toggleEnabled = (type: "accessories" | "facialHair") => {
    if (type === "accessories") setIsAccessoryEnabled((prev) => !prev);
    if (type === "facialHair") setIsFacialHairEnabled((prev) => !prev);
  };

  const avatarData = useMemo(() => {
    return createAvatar(openPeeps, {
      size: 128,
      accessories: isAccessoryEnabled ? [selectedAccessories] : [],
      accessoriesProbability: isAccessoryEnabled ? 100 : 0,
      face: [selectedFace],
      facialHair: isFacialHairEnabled ? [selectedFacialHair] : [],
      facialHairProbability: isFacialHairEnabled ? 100 : 0,
      clothingColor: [clothingColor],
    }).toDataUri();
  }, [
    selectedAccessories,
    selectedFace,
    selectedFacialHair,
    clothingColor,
    isAccessoryEnabled,
    isFacialHairEnabled,
  ]);

  return (
    <AvatarContext.Provider
      value={{
        avatarData,
        setSelection,
        toggleEnabled,
        clothingColor,
        setClothingColor,
        isAccessoryEnabled,
        isFacialHairEnabled,
        accessories: accessoryChoices,
        face: faceChoices,
        facialHair: facialHairChoices,
      }}
    >
      {children}
    </AvatarContext.Provider>
  );
};

export const useAvatar = () => {
  const context = useContext(AvatarContext);
  if (!context) throw new Error("useAvatar must be used within AvatarProvider");
  return context;
};
