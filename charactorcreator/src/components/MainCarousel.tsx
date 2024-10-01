"use client";
import { useAvatar } from "@/app/context/AvatarContext";
import { openPeeps } from "@dicebear/collection";
import { createAvatar } from "@dicebear/core";
import { useMemo, useState } from "react";

export default function AvatarCustomizer() {
  // context variables
  const {
    avatarData,
    setSelectedAccessories,
    avatarAccessoriesChoices,
    setSelectedFace,
    avatarFaceChoices,
    setSelectedFacialHair,
    avatarFacialHairChoices,
    accessoriesEnabled,
    setAccessoriesEnabled,
    facialHairEnabled,
    setFacialHairEnabled,
    clothingColor,
    setClothingColor,
  } = useAvatar();

  // Index states
  const [accessoryIndex, setAccessoryIndex] = useState(0);
  const [faceIndex, setFaceIndex] = useState(0);
  const [facialHairIndex, setFacialHairIndex] = useState(0);
  const [activeAttribute, setActiveAttribute] = useState("accessories");

  const attributeChoices =
    {
      accessories: avatarAccessoriesChoices,
      face: avatarFaceChoices,
      facialHair: avatarFacialHairChoices,
    }[activeAttribute] || [];

  const updateAvatar = () => {
    if (activeAttribute === "accessories") {
      setSelectedAccessories(
        accessoriesEnabled ? avatarAccessoriesChoices[accessoryIndex] : ""
      );
    } else if (activeAttribute === "face") {
      setSelectedFace(avatarFaceChoices[faceIndex]);
    } else if (activeAttribute === "facialHair") {
      setSelectedFacialHair(
        facialHairEnabled ? avatarFacialHairChoices[facialHairIndex] : ""
      );
    }
  };

  useMemo(() => updateAvatar(), [accessoryIndex, faceIndex, facialHairIndex]);

  // Generalized Navigation fuunction
  const handleNavigation = (direction: "next" | "previous") => {
    const indexSetters = {
      accessories: setAccessoryIndex,
      face: setFaceIndex,
      facialHair: setFacialHairIndex,
    };

    const currentSetter = indexSetters[activeAttribute];

    if (currentSetter) {
      currentSetter((prev: number) =>
        direction === "next"
          ? (prev + 1) % attributeChoices.length
          : prev === 0
          ? attributeChoices.length - 1
          : prev - 1
      );
    }
  };

  // General toggle function
  const toggleAttribute = (attribute: "accessories" | "facialHair") => {
    const toggles = {
      accessories: () => setAccessoriesEnabled(!accessoriesEnabled),
      facialHair: () => setFacialHairEnabled(!facialHairEnabled),
    };
    toggles[attribute]?.();
  };

  // // Button Choice Text
  const buttonChoices = ["accessories", "face", "facialHair", "head"];

  return (
    <div className="avatar-customizer">
      {/* Display current avatar */}
      <div className="avatar-display">
        <img src={avatarData} alt="Current Avatar" />
      </div>

      {/* Attribute Selector */}
      <div className="attribure-selector">
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

      {/* Toggle Button for Accessories and facial hair*/}
      {(activeAttribute === "accessories" ||
        activeAttribute === "facialHair") && (
        <div className="toggle-container">
          <button
            onClick={() =>
              toggleAttribute(activeAttribute as "accessories" | "facialHair")
            }
            className="btn toggle-btn"
          >
            {activeAttribute === "accessories"
              ? accessoriesEnabled
                ? "Disable Accessories"
                : "Enable Accessories"
              : facialHairEnabled
              ? "Disable Facial Hair"
              : "Enable Facial Hair"}
          </button>
        </div>
      )}

      {/* Choose Colors */}

      <div className="color-pickers">
        <div>
          <label htmlFor="clothingcolor">Clothing Color: </label>
          <input
            type="color"
            id="clothingcolor"
            value={`#${clothingColor}`}
            onChange={(e) => setClothingColor(e.target.value.replace("#", ""))}
          />
        </div>
      </div>

      <div className="preview-container">
        {/* Previous button */}
        <button onClick={() => handleNavigation("previous")} className="btn">
          Previous
        </button>

        {/* Display preview of current attribute choice */}
        <div className="preview-display">
          {attributeChoices.length > 0 && (
            <img
              src={createAvatar(openPeeps, {
                size: 128,
                accessories:
                  activeAttribute === "accessories" && accessoriesEnabled
                    ? [attributeChoices[accessoryIndex]]
                    : [],
                accessoriesProbability:
                  activeAttribute === "accessories" && accessoriesEnabled
                    ? 100
                    : 0,
                face:
                  activeAttribute === "face"
                    ? [attributeChoices[faceIndex]]
                    : [],
                facialHair:
                  activeAttribute === "facialHair" && facialHairEnabled
                    ? [attributeChoices[facialHairIndex]]
                    : [],
                facialHairProbability:
                  activeAttribute === "facialHair" && facialHairEnabled
                    ? 100
                    : 0,
                clothingColor: [clothingColor],
              }).toDataUri()}
              alt={`Preview ${activeAttribute} option`}
            />
          )}
        </div>

        {/* Next Button */}
        <button onClick={() => handleNavigation("next")} className="btn">
          Next
        </button>
      </div>
    </div>
  );
}
