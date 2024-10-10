"use client";

import { useAvatar } from "@/app/context/AvatarContext";
import { openPeeps } from "@dicebear/collection";
import { createAvatar } from "@dicebear/core";
import Image from "next/image";
import { useState } from "react";

export default function AvatarCustomizer() {
  const { extractedEnums, avatarData } = useAvatar();
  const [activeAttribute, setActiveAttribute] = useState<string>("accessories");

  const attributeChoices =
    {
      accessories: extractedEnums.accessories,
      face: extractedEnums.face,
      facialHair: extractedEnums.facialHair,
      head: extractedEnums.head,
      mask: extractedEnums.mask,
    }[activeAttribute] || [];

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
      <p>{extractedEnums.accessories[0]}</p>
    </div>
  );
}
