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
    setSelectedHead,
    avatarHeadChoices,
    setSelectedMask,
    avatarMaskChoices,
    accessoriesEnabled,
    setAccessoriesEnabled,
    facialHairEnabled,
    setFacialHairEnabled,
    maskEnabled,
    setMaskEnabled,
    clothingColor,
    setClothingColor,
    headContrastColor,
    setHeadContrastColor,
    backgroundColor,
    setBackgroundColor,
  } = useAvatar();

  // Index states
  const [accessoryIndex, setAccessoryIndex] = useState(0);
  const [faceIndex, setFaceIndex] = useState(0);
  const [facialHairIndex, setFacialHairIndex] = useState(0);
  const [headIndex, setHeadIndex] = useState(0);
  const [maskIndex, setMaskIndex] = useState(0);
  const [activeAttribute, setActiveAttribute] = useState("accessories");

  const attributeChoices =
    {
      accessories: avatarAccessoriesChoices,
      face: avatarFaceChoices,
      facialHair: avatarFacialHairChoices,
      head: avatarHeadChoices,
      mask: avatarMaskChoices,
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
    } else if (activeAttribute === "head") {
      setSelectedHead(avatarHeadChoices[headIndex]);
    } else if (activeAttribute === "mask") {
      setSelectedMask(maskEnabled ? avatarMaskChoices[maskIndex] : "");
    }
  };

  useMemo(
    () => updateAvatar(),
    [accessoryIndex, faceIndex, facialHairIndex, headIndex, maskIndex]
  );

  // Generalized Navigation fuunction
  const handleNavigation = (direction: "next" | "previous") => {
    const indexSetters = {
      accessories: setAccessoryIndex,
      face: setFaceIndex,
      facialHair: setFacialHairIndex,
      head: setHeadIndex,
      mask: setMaskIndex,
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
  const toggleAttribute = (
    attribute: "accessories" | "facialHair" | "mask"
  ) => {
    const toggles = {
      accessories: () => setAccessoriesEnabled(!accessoriesEnabled),
      facialHair: () => setFacialHairEnabled(!facialHairEnabled),
      mask: () => setMaskEnabled(!maskEnabled),
    };
    toggles[attribute]?.();
  };

  // // Button Choice Text
  const buttonChoices = ["accessories", "face", "facialHair", "head", "mask"];

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
        activeAttribute === "facialHair" ||
        activeAttribute === "mask") && (
        <div className="toggle-container">
          <button
            onClick={() =>
              toggleAttribute(
                activeAttribute as "accessories" | "facialHair" | "mask"
              )
            }
            className="btn toggle-btn"
          >
            {activeAttribute === "accessories"
              ? accessoriesEnabled
                ? "Disable Accessories"
                : "Enable Accessories"
              : activeAttribute === "facialHair"
              ? facialHairEnabled
                ? "Disable Facial Hair"
                : "Enable Facial Hair"
              : activeAttribute === "mask"
              ? maskEnabled
                ? "Disable Mask"
                : "Enable Mask"
              : ""}
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

      <div className="color-pickers">
        <div>
          <label htmlFor="headcontrastcolor">Head Contrast Color: </label>
          <input
            type="color"
            id="headcontrastcolor"
            value={`#${headContrastColor}`}
            onChange={(e) =>
              setHeadContrastColor(e.target.value.replace("#", ""))
            }
          />
        </div>
      </div>

      <div className="color-pickers">
        <div>
          <label htmlFor="backgroundcolor">Background Color: </label>
          <input
            type="color"
            id="backgroundcolor"
            value={`#${backgroundColor}`}
            onChange={(e) =>
              setBackgroundColor(e.target.value.replace("#", ""))
            }
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
                head:
                  activeAttribute === "head"
                    ? [attributeChoices[headIndex]]
                    : [],
                mask:
                  activeAttribute === "mask" && maskEnabled
                    ? [attributeChoices[maskIndex]]
                    : [],
                maskProbability:
                  activeAttribute === "mask" && maskEnabled ? 100 : 0,
                clothingColor: [clothingColor],
                headContrastColor: [headContrastColor],
                backgroundColor: [backgroundColor],
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
