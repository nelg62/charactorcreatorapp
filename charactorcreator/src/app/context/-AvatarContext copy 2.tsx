// charactorcreator/src/app/context/AvatarContext.tsx

"use client";
import { createContext, useContext, useState, useMemo } from "react";
import { openPeeps } from "@dicebear/collection";
import { createAvatar, schema } from "@dicebear/core";
import { JSONSchema7 } from "json-schema";

// Define your options
const options = {
  ...schema.properties,
  ...openPeeps.schema.properties,
};

// Helper function to extract choices from schema enums
const getEnumChoices = (property: JSONSchema7 | undefined): string[] => {
  if (
    property &&
    property.type === "array" &&
    typeof property.items === "object" &&
    property.items !== null &&
    !Array.isArray(property.items) &&
    "enum" in property.items
  ) {
    return (property.items.enum as string[]) || [];
  }
  return [];
};

const getDefault = (property: JSONSchema7 | undefined): string[] => {
  if (property && "default" in property) {
    return (property.default as string[]) || [];
  }
  return [];
};

// Extract default options and color sets
const avatarAccessoriesChoices = getEnumChoices(
  options.accessories as JSONSchema7
);
const avatarFaceChoices = getEnumChoices(options.face as JSONSchema7);
const avatarFacialHairChoices = getEnumChoices(
  options.facialHair as JSONSchema7
);
const avatarHeadChoices = getEnumChoices(options.head as JSONSchema7);
const avatarBackgroundTypeChoices = getEnumChoices(
  options.backgroundType as JSONSchema7
);

// Dynamically set AccessoryChoice based on the values of avatarAccessoriesChoices
type AccessoryChoice = (typeof avatarAccessoriesChoices)[number];
type FaceChoice = (typeof avatarFaceChoices)[number];
type FacialHairChoice = (typeof avatarFacialHairChoices)[number];
type HeadChoice = (typeof avatarHeadChoices)[number];
type BackgroundTypeChoice = (typeof avatarBackgroundTypeChoices)[number];

const defaultClothingColors = getDefault(options.clothingColor as JSONSchema7);
const defaultHeadContrastColors = getDefault(
  options.headContrastColor as JSONSchema7
);
const defaultSkinColors = getDefault(options.skinColor as JSONSchema7);
const defaultBackgroundColors = getDefault(
  options.backgroundColor as JSONSchema7
);

// Create Avatar Context
const AvatarContext = createContext<AvatarContextType | null>(null);

export const AvatarProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedAccessories, setSelectedAccessories] =
    useState<AccessoryChoice>(avatarAccessoriesChoices[0] || "");
  const [selectedFace, setSelectedFace] = useState<FaceChoice>(
    avatarFaceChoices[0] || ""
  );
  const [selectedFacialHair, setSelectedFacialHair] =
    useState<FacialHairChoice>(avatarFacialHairChoices[0] || "");
  const [selectedHead, setSelectedHead] = useState<HeadChoice>(
    avatarHeadChoices[0] || ""
  );
  const [selectedBackgroundType, setSelectedBackgroundType] =
    useState<BackgroundTypeChoice>(avatarBackgroundTypeChoices[0] || "");

  const [clothingColor, setClothingColor] = useState<string>(
    defaultClothingColors[0] || "#8fa7df"
  );
  const [headContrastColor, setHeadContrastColor] = useState<string>(
    defaultHeadContrastColors[0] || "#2c1b18"
  );
  const [skinColor, setSkinColor] = useState<string>(
    defaultSkinColors[0] || "#694d3d"
  );
  const [backgroundColor, setBackgroundColor] = useState<string>(
    defaultBackgroundColors[0] || "b6e3f4"
  );
  const [backgroundColor2, setBackgroundColor2] = useState<string>(
    defaultBackgroundColors[1] || "b6e3f4"
  );

  const accessoriesProbability = selectedAccessories ? 100 : 0;
  const facialHairProbability = selectedFacialHair ? 100 : 0;

  // Memoized avatar generation
  const avatarData = useMemo(() => {
    return createAvatar(openPeeps, {
      size: 128,
      accessories: selectedAccessories,
      accessoriesProbability,
      face: [selectedFace],
      facialHair: [selectedFacialHair],
      facialHairProbability,
      head: [selectedHead],
      backgroundType: [selectedBackgroundType],
      clothingColor: [clothingColor],
      headContrastColor: [headContrastColor],
      skinColor: [skinColor],
      backgroundColor: [backgroundColor, backgroundColor2],
    }).toDataUri();
  }, [
    selectedAccessories,
    accessoriesProbability,
    selectedFace,
    selectedFacialHair,
    facialHairProbability,
    selectedHead,
    selectedBackgroundType,
    clothingColor,
    headContrastColor,
    skinColor,
    backgroundColor,
    backgroundColor2,
  ]);

  // Randomize function
  const randomizeAvatar = () => {
    const randomChoice = (choices: string[]) =>
      choices[Math.floor(Math.random() * choices.length)];

    const randomAccessoryIndex = Math.floor(
      Math.random() * avatarAccessoriesChoices.length
    );
    const randomFaceIndex = Math.floor(
      Math.random() * avatarFaceChoices.length
    );
    const randomFacialHairIndex = Math.floor(
      Math.random() * avatarFacialHairChoices.length
    );
    const randomHeadIndex = Math.floor(
      Math.random() * avatarHeadChoices.length
    );
    const randomBackgroundIndex = Math.floor(
      Math.random() * avatarBackgroundTypeChoices.length
    );

    setSelectedAccessories(avatarAccessoriesChoices[randomAccessoryIndex]);
    setSelectedFace(avatarFaceChoices[randomFaceIndex]);
    setSelectedFacialHair(avatarFacialHairChoices[randomFacialHairIndex]);
    setSelectedHead(avatarHeadChoices[randomHeadIndex]);
    setSelectedBackgroundType(
      avatarBackgroundTypeChoices[randomBackgroundIndex]
    );

    setClothingColor(randomChoice(defaultClothingColors));
    setHeadContrastColor(randomChoice(defaultHeadContrastColors));
    setSkinColor(randomChoice(defaultSkinColors));
  };

  return (
    <AvatarContext.Provider
      value={{
        avatarData,
        setSelectedAccessories,
        setSelectedFace,
        setSelectedFacialHair,
        setSelectedHead,
        setClothingColor,
        setHeadContrastColor,
        setSelectedBackgroundType,
        setSkinColor,
        setBackgroundColor,
        setBackgroundColor2,
        randomizeAvatar,
        avatarAccessoriesChoices,
        avatarFaceChoices,
        avatarFacialHairChoices,
        avatarHeadChoices,
        avatarBackgroundTypeChoices,
        clothingColor,
        headContrastColor,
        skinColor,
        backgroundColor,
        backgroundColor2,
        selectedBackgroundType,
      }}
    >
      {children}
    </AvatarContext.Provider>
  );
};

// Custom hook to use the AvatarContext
export const useAvatar = () => {
  const context = useContext(AvatarContext);
  if (context === null) {
    throw new Error("useAvatar must be used within an AvatarProvider");
  }
  return context;
};
