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

console.log("avatarAccessoriesChoices", avatarAccessoriesChoices);

function CreateAvatar() {
  // Set up state to track selected options
  const [selectedAccessories, setSelectedAccessories] = useState<string>(
    avatarAccessoriesChoices[0] || ""
  );
  const [selectedFace, setSelectedFace] = useState<string>(
    avatarFaceChoice[0] || ""
  );

  const accessoriesProbability = selectedAccessories ? 100 : 0;

  // Function to create the avatar using selected options
  const avatar = useMemo(() => {
    return createAvatar(openPeeps, {
      size: 128,
      accessories: [selectedAccessories],
      accessoriesProbability: accessoriesProbability,
      face: [selectedFace],
    }).toDataUri();
  }, [selectedAccessories, accessoriesProbability, selectedFace]);

  // Handle select menu changes
  const handleAccessoriesChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedAccessories(event.target.value);
  };

  const handleFaceChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedFace(event.target.value);
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
        {/* Render the generated avatar */}
        <img src={avatar} alt="Avatar" />
      </div>
    </div>
  );
}

export default CreateAvatar;
