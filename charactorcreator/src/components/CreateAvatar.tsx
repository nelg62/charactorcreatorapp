"use client";
import { useMemo, useState } from "react";
import { createAvatar, schema } from "@dicebear/core";
import { openPeeps } from "@dicebear/collection";
import { JSONSchema7 } from "json-schema";

// Define your options
const options = {
  ...schema.properties,
  ...openPeeps.schema.properties,
};

// Safely access the enum if it exists
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

// Extract choices safely
const avatarAccessoriesChoices = getEnumChoices(
  options.accessories as JSONSchema7
);
const avatarFaceChoice = getEnumChoices(options.face as JSONSchema7);

const avatarFacialHairChoice = getEnumChoices(
  options.facialHair as JSONSchema7
);
const avatarHeadChoice = getEnumChoices(options.head as JSONSchema7);

const defaultClothingColors = options.clothingColor?.default as string[];

const defaultHeadContrastColor = options.headContrastColor?.default as string[];

const defaultSkinColors = options.skinColor?.default as string[];

// console.log("avatarAccessoriesChoices", avatarAccessoriesChoices);
// console.log("skincolor", options.skinColor);

function CreateAvatar() {
  // Set up state to track selected options
  const [selectedAccessories, setSelectedAccessories] = useState<string>(
    avatarAccessoriesChoices[0] || ""
  );
  const [selectedFace, setSelectedFace] = useState<string>(
    avatarFaceChoice[0] || ""
  );

  const [selectedFacialHair, setSelectedFacialHair] = useState<string>(
    avatarFacialHairChoice[0] || ""
  );
  const [selectedHead, setSelectedHead] = useState<string>(
    avatarHeadChoice[0] || ""
  );

  const [clothingColor, setClothingColor] = useState<string>(
    defaultClothingColors[0] || "#8fa7df"
  );

  const [headContrastColor, setHeadContrastColor] = useState<string>(
    defaultHeadContrastColor[0] || "#2c1b18"
  );

  const [skinColor, setSkinColor] = useState<string>(
    defaultSkinColors[0] || "#694d3d"
  );

  const accessoriesProbability = selectedAccessories ? 100 : 0;

  const facialHairProbability = selectedFacialHair ? 100 : 0;

  // Function to create the avatar using selected options
  const avatar = useMemo(() => {
    return createAvatar(openPeeps, {
      size: 128,
      accessories: [selectedAccessories],
      accessoriesProbability: accessoriesProbability,
      face: [selectedFace],
      facialHair: [selectedFacialHair],
      facialHairProbability: facialHairProbability,
      head: [selectedHead],
      clothingColor: [clothingColor],
      headContrastColor: [headContrastColor],
      skinColor: [skinColor],
    }).toDataUri();
  }, [
    selectedAccessories,
    accessoriesProbability,
    selectedFace,
    selectedFacialHair,
    facialHairProbability,
    selectedHead,
    clothingColor,
    headContrastColor,
    skinColor,
  ]);

  // Handle select menu changes
  const handleAccessoriesChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedAccessories(event.target.value);
  };

  const handleFaceChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedFace(event.target.value);
  };

  const handleFacialHairChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedFacialHair(event.target.value);
  };
  const handleHeadChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedHead(event.target.value);
  };

  const handleClothingColorChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setClothingColor(event.target.value.replace("#", ""));
  };

  const handleHeadContrastColor = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setHeadContrastColor(event.target.value.replace("#", ""));
  };

  const handleSkinColorChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSkinColor(event.target.value.replace("#", ""));
  };

  return (
    <div>
      <div>
        <label htmlFor="accessories">Choose Accessories: </label>
        <select
          id="accessories"
          value={selectedAccessories}
          onChange={handleAccessoriesChange}
          className="text-blue-500"
        >
          <option value="">None</option>
          {avatarAccessoriesChoices.map((accessory) => (
            <option key={accessory} value={accessory}>
              {accessory}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="face">Choose Face Type: </label>
        <select
          id="face"
          value={selectedFace}
          onChange={handleFaceChange}
          className="text-blue-500"
        >
          {avatarFaceChoice.map((face) => (
            <option key={face} value={face}>
              {face}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="facialhair">Choose Facial Hair: </label>
        <select
          id="facialhair"
          value={selectedFacialHair}
          onChange={handleFacialHairChange}
          className="text-blue-500"
        >
          <option value="">None</option>
          {avatarFacialHairChoice.map((facialhair) => (
            <option key={facialhair} value={facialhair}>
              {facialhair}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="head">Choose Hair: </label>
        <select
          id="head"
          value={selectedHead}
          onChange={handleHeadChange}
          className="text-blue-500"
        >
          {avatarHeadChoice.map((head) => (
            <option key={head} value={head}>
              {head}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="clothingColor">Choose Clothing Color: </label>
        <input
          id="clothingColor"
          type="color"
          value={`#${clothingColor}`}
          onChange={handleClothingColorChange}
        />
      </div>

      <div>
        <label htmlFor="hairColor">Choose Hair Color: </label>
        <input
          id="hairColor"
          type="color"
          value={`#${headContrastColor}`}
          onChange={handleHeadContrastColor}
        />
      </div>

      <div>
        <label htmlFor="skinColor">Choose Skin Color: </label>
        <input
          id="skinColor"
          type="color"
          value={`#${skinColor}`}
          onChange={handleSkinColorChange}
        />
      </div>

      <div>
        {/* Render the generated avatar */}
        <img src={avatar} alt="Avatar" />
      </div>
    </div>
  );
}

export default CreateAvatar;
