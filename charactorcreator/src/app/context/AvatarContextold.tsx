// charactorcreator/src/app/context/AvatarContext.tsx

"use client";
import { createContext, useContext, useState, useMemo } from "react";
import { openPeeps } from "@dicebear/collection";
import { createAvatar, schema } from "@dicebear/core";
import { JSONSchema7 } from "json-schema";
import { access } from "fs";

//----
// export function getOptionsBySchema(schema: JSONSchema7) {
//   const result: Record<string, any> = {};

//   for (var key in schema.properties) {
//     if (false === schema.properties.hasOwnProperty(key)) {
//       continue;
//     }

//     const property = schema.properties[key];

//     if (typeof property === "object") {
//       const option: Record<string, any> = {
//         type: property.type,
//       };

//       if (option.type === "integer") {
//         option.type = "number";
//       }

//       option.choices = [];

//       if (property.enum) {
//         option.choices.push(
//           ...property.enum.filter((v) => typeof v === "string")
//         );
//       }

//       if (
//         typeof property.items === "object" &&
//         "enum" in property.items &&
//         property.items.enum
//       ) {
//         option.choices.push(
//           ...property.items.enum.filter((v) => typeof v === "string")
//         );
//       }

//       if (option.choices.length === 0) {
//         delete option.choices;
//       }

//       if (property.description) {
//         option.description = property.description;
//       }

//       result[key] = option;
//     }
//   }

//   return result;
// }

//---

// console.log(getOptionsBySchema(openPeeps.schema));

// Define your options
const options = {
  ...schema.properties,
  ...openPeeps.schema.properties,
};

interface AvatarContextType {
  avatarData: string; // The data URI of the generated avatar
  setSelectedAccessories: React.Dispatch<React.SetStateAction<string>>;
  setSelectedFace: React.Dispatch<React.SetStateAction<string>>;
  setSelectedFacialHair: React.Dispatch<React.SetStateAction<string>>;
  setSelectedHead: React.Dispatch<React.SetStateAction<string>>;
  setSelectedBackgroundType: React.Dispatch<React.SetStateAction<string>>;
  setClothingColor: React.Dispatch<React.SetStateAction<string>>;
  setHeadContrastColor: React.Dispatch<React.SetStateAction<string>>;
  setSkinColor: React.Dispatch<React.SetStateAction<string>>;
  setBackgroundColor: React.Dispatch<React.SetStateAction<string>>;
  setBackgroundColor2: React.Dispatch<React.SetStateAction<string>>;
  randomizeAvatar: () => void;
  randomizeAccessories: () => void;
  randomizeFace: () => void;
  randomizeFacialHair: () => void;
  randomizeHead: () => void;
  avatarAccessoriesChoices: string[];
  avatarFaceChoices: string[];
  avatarFacialHairChoices: string[];
  avatarHeadChoices: string[];
  avatarBackgroundTypeChoices: string[];
  clothingColor: string;
  headContrastColor: string;
  skinColor: string;
  backgroundColor: string;
  backgroundColor2: string;
  selectedBackgroundType: string;
}

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
  const [selectedAccessories, setSelectedAccessories] = useState<string>(
    avatarAccessoriesChoices[0] || ""
  );

  const accessoryIndex = avatarAccessoriesChoices.findIndex(
    (accessory) => accessory === selectedAccessories
  );
  console.log("🚀 ~ AvatarProvider ~ accessoryIndex:", accessoryIndex);
  const [selectedFace, setSelectedFace] = useState<string>(
    avatarFaceChoices[0] || ""
  );
  const [selectedFacialHair, setSelectedFacialHair] = useState<string>(
    avatarFacialHairChoices[0] || ""
  );
  const [selectedHead, setSelectedHead] = useState<string>(
    avatarHeadChoices[0] || ""
  );
  const [selectedBackgroundType, setSelectedBackgroundType] = useState<string>(
    avatarBackgroundTypeChoices[0] || ""
  );

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

  console.log(
    "avatarAccessoriesChoices[accessoryIndex]",
    avatarAccessoriesChoices[accessoryIndex]
  );

  // Memoized avatar generation
  const avatarData = useMemo(() => {
    return createAvatar(openPeeps, {
      size: 128,
      accessories: avatarAccessoriesChoices[accessoryIndex],
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

    return {
      accessoryIndex: randomAccessoryIndex,
      faceIndex: randomFaceIndex,
      facialHairIndex: randomFacialHairIndex,
      headIndex: randomHeadIndex,
      backgroundTypeIndex: randomBackgroundIndex,
    };
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
        randomizeAvatar, // Expose the randomize function
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
