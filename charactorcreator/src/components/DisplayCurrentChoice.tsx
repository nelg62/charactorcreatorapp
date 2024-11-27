import { useAvatar } from "@/app/context/AvatarContext";
import { openPeeps } from "@dicebear/collection";
import { createAvatar } from "@dicebear/core";
import Image from "next/image";

interface DisplayCurrentChoiceProps {
  attributeChoices: string[];
  activeAttribute: string;
  isEnabled: Record<"accessories" | "facialHair" | "mask", boolean>;
  attributeIndexes: Record<string, number>;
  handleNavigation: (direction: "next" | "previous") => void;
}

export default function DisplayCurrentChoice({
  attributeChoices,
  activeAttribute,
  isEnabled,
  attributeIndexes,
  handleNavigation,
}: DisplayCurrentChoiceProps) {
  const { clothingColor, headContrastColor, backgroundColor } = useAvatar();
  return (
    <div className="flex items-center justify-between">
      {/* Previous button */}
      <button
        onClick={() => handleNavigation("previous")}
        className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
      >
        Previous
      </button>

      {/* Display preview of current attribute choice */}
      <div className="preview-display">
        {attributeChoices.length > 0 && (
          <Image
            src={createAvatar(openPeeps, {
              size: 128,
              accessories:
                activeAttribute === "accessories" &&
                isEnabled[activeAttribute as keyof typeof isEnabled]
                  ? ([
                      attributeChoices[attributeIndexes.accessories],
                    ] as openPeeps.Options["accessories"])
                  : [],
              accessoriesProbability:
                activeAttribute === "accessories" &&
                isEnabled[activeAttribute as keyof typeof isEnabled]
                  ? 100
                  : 0,
              face:
                activeAttribute === "face"
                  ? ([
                      attributeChoices[attributeIndexes.face],
                    ] as openPeeps.Options["face"])
                  : [],
              facialHair:
                activeAttribute === "facialHair" &&
                isEnabled[activeAttribute as keyof typeof isEnabled]
                  ? ([
                      attributeChoices[attributeIndexes.facialHair],
                    ] as openPeeps.Options["facialHair"])
                  : [],
              facialHairProbability:
                activeAttribute === "facialHair" &&
                isEnabled[activeAttribute as keyof typeof isEnabled]
                  ? 100
                  : 0,
              head:
                activeAttribute === "head"
                  ? ([
                      attributeChoices[attributeIndexes.head],
                    ] as openPeeps.Options["head"])
                  : [],
              mask:
                activeAttribute === "mask" &&
                isEnabled[activeAttribute as keyof typeof isEnabled]
                  ? ([
                      attributeChoices[attributeIndexes.mask],
                    ] as openPeeps.Options["mask"])
                  : [],
              maskProbability:
                activeAttribute === "mask" &&
                isEnabled[activeAttribute as keyof typeof isEnabled]
                  ? 100
                  : 0,
              clothingColor: [clothingColor],
              headContrastColor: [headContrastColor],
              backgroundColor: [backgroundColor],
            }).toDataUri()}
            alt="Avatar Item Preview"
            height={128}
            width={128}
          />
        )}
        <h1 className="text-center">
          {
            attributeChoices[
              attributeIndexes[activeAttribute as keyof typeof attributeIndexes]
            ]
          }
        </h1>
      </div>
      <button onClick={() => handleNavigation("next")} className="btn">
        Next
      </button>
    </div>
  );
}
