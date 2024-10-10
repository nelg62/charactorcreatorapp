"use client";

import { useAvatar } from "@/app/context/AvatarContext";
import { openPeeps } from "@dicebear/collection";
import { createAvatar } from "@dicebear/core";
import Image from "next/image";
import { useState } from "react";

export default function AvatarCustomizer() {
  const { extractedEnums, avatarData } = useAvatar();
  const [activeAttribute, setActiveAttribute] = useState<string>("accessories");
  const [attributeIndexes, setAttributeIndexes] = useState({
    accessories: 0,
    face: 0,
    facialHair: 0,
    head: 0,
    mask: 0,
  });

  const attributeChoices =
    {
      accessories: extractedEnums.accessories,
      face: extractedEnums.face,
      facialHair: extractedEnums.facialHair,
      head: extractedEnums.head,
      mask: extractedEnums.mask,
    }[activeAttribute] || [];

  const handleNavigation = (direction: "next" | "previous") => {
    setAttributeIndexes((prevIndexes) => {
      const currentIndex =
        prevIndexes[activeAttribute as keyof typeof prevIndexes];
      const totalChoices = attributeChoices.length;

      const newIndex =
        direction === "next"
          ? (currentIndex + 1) % totalChoices
          : currentIndex === 0
          ? totalChoices - 1
          : currentIndex - 1;

      return {
        ...prevIndexes,
        [activeAttribute]: newIndex,
      };
    });
  };

  // Button Choice Text
  const buttonChoices = ["accessories", "face", "facialHair", "head", "mask"];
  return (
    <div className="avatar-customizer">
      {/* Display current avatar */}
      <div className="avatar-display">
        <Image src={avatarData} alt="Display Avatar" height={100} width={100} />
      </div>

      {/* Attribute Selector */}
      <div className="attribute-selector">
        {buttonChoices.map((attribute) => (
          <button
            key={attribute}
            onClick={() => setActiveAttribute(attribute)}
            className={`btn ${activeAttribute === attribute ? "active" : ""}`}
          >
            {attribute}
          </button>
        ))}
      </div>

      <div className="preview-container">
        {/* Previous button*/}
        <button onClick={() => handleNavigation("previous")} className="btn">
          Previous
        </button>
        {/* Display preview of current attribute choice */}
        <div className="preview-display">
          {attributeChoices.length > 0 && (
            <Image
              src={createAvatar(openPeeps, {
                size: 128,
              }).toDataUri()}
              alt="Avatar Item Preview"
              height={128}
              width={128}
            />
          )}
        </div>

        {/* Next Button */}
        <button onClick={() => handleNavigation("next")} className="btn">
          Next
        </button>
      </div>
      <p>{extractedEnums.accessories[0]}</p>
    </div>
  );
}
