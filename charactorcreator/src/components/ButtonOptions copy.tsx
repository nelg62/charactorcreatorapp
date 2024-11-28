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
  const [visibleCount, setVisibleCount] = useState(3);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setVisibleCount(3);
      } else if (window.innerWidth < 1024) {
        setVisibleCount(5);
      } else {
        setVisibleCount(7);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleCarouselNavigation = (direction: "left" | "right") => {
    setVisibleStartIndex((prev) => {
      const totalChoices = attributeChoices.length;
      if (direction === "right") {
        return (prev + visibleCount) % totalChoices;
      } else {
        return (prev - visibleCount + totalChoices) % totalChoices;
      }
    });
  };

  const visibleChoices = attributeChoices.slice(
    visibleStartIndex,
    visibleStartIndex + visibleCount
  );

  if (visibleChoices.length < visibleCount) {
    visibleChoices.push(
      ...attributeChoices.slice(0, visibleCount - visibleChoices.length)
    );
  }

  return (
    <div className="flex items-center">
      <button
        onClick={() => handleCarouselNavigation("left")}
        className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
      >
        &lt;
      </button>

      <div className="flex gap-2">
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
            className={`btn choice-btn ${
              attributeIndexes[activeAttribute] ===
              (visibleStartIndex + index) % attributeChoices.length
                ? "active"
                : ""
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
                clothingColor: [clothingColor],
                headContrastColor: [headContrastColor],
                backgroundColor: [backgroundColor],
                skinColor: [skinColor],
              }).toDataUri()}
              alt={`${choice} preview`}
              height={64}
              width={64}
            />
            <span className="truncate">{choice}</span>
          </button>
        ))}
      </div>
      <button
        onClick={() => handleCarouselNavigation("right")}
        className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
      >
        &gt;
      </button>
    </div>
  );
};

export default ButtonOptions;
