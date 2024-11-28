import { useAvatar } from "@/app/context/AvatarContext";
import { openPeeps } from "@dicebear/collection";
import { createAvatar } from "@dicebear/core";
import Image from "next/image";
import React, { useEffect, useState } from "react";

interface ButtonOptionProps {
  attributeChoices: string[];
  setAttributeIndexes: React.Dispatch<
    React.SetStateAction<Record<string, number>>
  >;
  activeAttribute: string;
  attributeIndexes: Record<string, number>;
}

const ButtonOptions = ({
  attributeChoices,
  setAttributeIndexes,
  activeAttribute,
  attributeIndexes,
}: ButtonOptionProps) => {
  const { clothingColor, headContrastColor, backgroundColor, skinColor } =
    useAvatar();
  const [visibleStartIndex, setVisibleStartIndex] = useState(0);

  const gridSize = 9;

  const handleCarouselNavigation = (direction: "left" | "right") => {
    setVisibleStartIndex((prev) => {
      const totalChoices = attributeChoices.length;
      if (direction === "right") {
        return Math.min(prev + gridSize, totalChoices - gridSize);
      } else {
        return Math.max(prev - gridSize, 0);
      }
    });
  };

  useEffect(() => {
    setVisibleStartIndex(0);
  }, [activeAttribute]);

  const visibleChoices = attributeChoices.slice(
    visibleStartIndex,
    visibleStartIndex + gridSize
  );

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="grid grid-cols-3 gap-4">
        {visibleChoices.map((choice, index) => (
          <button
            key={index}
            onClick={() =>
              setAttributeIndexes((prev) => ({
                ...prev,
                [activeAttribute]:
                  (visibleStartIndex + index) % attributeChoices.length,
              }))
            }
            className={`flex flex-col items-center gap-1 p-2 border rounded ${
              attributeIndexes[activeAttribute] ===
              (visibleStartIndex + index) % attributeChoices.length
                ? "border-blue-500 bg-blue-100"
                : "border-gray-300 bg-white"
            }`}
          >
            <Image
              src={createAvatar(openPeeps, {
                size: 64,
                [activeAttribute]: [choice] as unknown,
                accessoriesProbability:
                  activeAttribute === "accessories" ? 100 : 0,
                facialHairProbability:
                  activeAttribute === "facialHair" ? 100 : 0,
                maskProbability: activeAttribute === "mask" ? 100 : 0,
                clothingColor: [clothingColor],
                headContrastColor: [headContrastColor],
                backgroundColor: [backgroundColor],
                skinColor: [skinColor],
              }).toDataUri()}
              alt={`${choice} preview`}
              height={64}
              width={64}
              className="rounded"
            />
            <span className="text-xs truncate text-gray-900">{choice}</span>
          </button>
        ))}
      </div>

      <div className="flex justify-between w-full">
        <button
          onClick={() => handleCarouselNavigation("left")}
          className={`px-4 py-2 rounded ${
            visibleStartIndex > 0
              ? "bg-gray-300 hover:bg-gray-400 text-gray-900"
              : "bg-gray-200 cursor-not-allowed"
          }`}
          disabled={visibleStartIndex === 0}
        >
          &lt;
        </button>
        <button
          onClick={() => handleCarouselNavigation("right")}
          className={`px-4 py-2 rounded ${
            visibleStartIndex + gridSize < attributeChoices.length
              ? "bg-gray-300 hover:bg-gray-400 text-gray-900"
              : "bg-gray-200 cursor-not-allowed"
          }`}
          disabled={visibleStartIndex + gridSize >= attributeChoices.length}
        >
          &gt;
        </button>
      </div>
    </div>
  );
};

export default ButtonOptions;
