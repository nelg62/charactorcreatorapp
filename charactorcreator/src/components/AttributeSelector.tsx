import { useAvatar } from "@/app/context/AvatarContext";
import { openPeeps } from "@dicebear/collection";
import { createAvatar } from "@dicebear/core";
import Image from "next/image";

interface AttributeSelectorProps {
  extractedEnums: Record<string, string[]>; // Enum values for attributes
  activeAttribute: string; // Current active attribute
  setActiveAttribute: (attribute: string) => void; // Function to set the active attribute
  attributeIndexes: Record<string, number>; // Index for each attribute
  attributeChoices: string[]; // Choices for the attributes
  isEnabled: Record<"accessories" | "facialHair" | "mask", boolean>; // Whether the attribute is enabled
}

const AttributeSelector: React.FC<AttributeSelectorProps> = ({
  extractedEnums,
  activeAttribute,
  setActiveAttribute,
  attributeIndexes,
  attributeChoices,
  isEnabled,
}) => {
  const { clothingColor, headContrastColor, backgroundColor, skinColor } =
    useAvatar();
  return (
    <div className="grid grid-cols-3 gap-2">
      {Object.keys(extractedEnums).map((attribute) => {
        // Get the first choice for the current attribute
        const firstChoice = extractedEnums[attribute][0];

        return (
          <button
            key={attribute}
            onClick={() => setActiveAttribute(attribute)}
            className={`py-2 px-4 text-xs font-bold border-2 rounded-md shadow-lg transition-all duration-200 ${
              activeAttribute === attribute
                ? "bg-retroGreen text-black border-black"
                : "bg-white text-black border-gray-700 hover:bg-retroOrange"
            }`}
          >
            <div className="preview-display">
              {firstChoice && (
                <Image
                  src={createAvatar(openPeeps, {
                    size: 64,
                    [attribute]: [firstChoice], // Use the first choice for the attribute
                    accessoriesProbability:
                      attribute === "accessories" ? 100 : 0,
                    facialHairProbability: attribute === "facialHair" ? 100 : 0,
                    maskProbability: attribute === "mask" ? 100 : 0,
                    clothingColor: [clothingColor],
                    headContrastColor: [headContrastColor],
                    backgroundColor: [backgroundColor],
                    skinColor: [skinColor],
                  }).toDataUri()}
                  alt={`${attribute} preview`}
                  height={64}
                  width={64}
                  className="rounded m-auto"
                />
              )}
              <h1 className="text-center text-gray-900">{attribute}</h1>
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default AttributeSelector;
