"use client";
import { useAvatar } from "@/app/context/AvatarContext";
import { openPeeps } from "@dicebear/collection";
import { createAvatar, schema, Options } from "@dicebear/core";
import { useMemo, useState } from "react";

export default function AvatarCustomizer() {
  const {
    avatarData,
    setSelectedAccessories,
    avatarAccessoriesChoices,
    setSelectedFace,
    avatarFaceChoices,
    accessoriesEnabled,
    setAccessoriesEnabled,
    setSelectedFacialHair,
    facialHairEnabled,
    avatarFacialHairChoices,
    setFacialHairEnabled,
    clothingColor,
    setClothingColor,
  } = useAvatar();
  const [accessoryIndex, setAccessoryIndex] = useState(0);
  const [faceIndex, setFaceIndex] = useState(0);
  const [facialHairIndex, setFacialHairIndex] = useState(0);

  const [activeAttribute, setActiveAttribute] = useState("accessories");

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

  useMemo(() => {
    updateAvatar();
  }, [accessoryIndex, faceIndex, facialHairIndex]);

  const choices =
    {
      accessories: avatarAccessoriesChoices,
      face: avatarFaceChoices,
      facialHair: avatarFacialHairChoices,
    }[activeAttribute] || [];

  // Previous Button
  const handlePrevious = () => {
    if (activeAttribute === "accessories") {
      setAccessoryIndex((prev) => (prev > 0 ? prev - 1 : choices.length - 1));
    } else if (activeAttribute === "face") {
      setFaceIndex((prev) => (prev > 0 ? prev - 1 : choices.length - 1));
    } else if (activeAttribute === "facialHair") {
      setFacialHairIndex((prev) => (prev > 0 ? prev - 1 : choices.length - 1));
    }
  };

  // Next Button
  const handleNext = () => {
    if (activeAttribute === "accessories") {
      setAccessoryIndex((prev) => (prev < choices.length - 1 ? prev + 1 : 0));
    } else if (activeAttribute === "face") {
      setFaceIndex((prev) => (prev < choices.length - 1 ? prev + 1 : 0));
    } else if (activeAttribute === "facialHair") {
      setFacialHairIndex((prev) => (prev < choices.length - 1 ? prev + 1 : 0));
    }
  };

  const toggleAccessories = () => {
    setAccessoriesEnabled(!accessoriesEnabled);
  };

  const toggleFacialHair = () => {
    setFacialHairEnabled(!facialHairEnabled);
  };

  return (
    <div className="avatar-customizer">
      {/* Display current avatar */}
      <div className="avatar-display">
        <img src={avatarData} alt="Current Avatar" />
      </div>

      {/* Attribute Selector */}
      <div className="attribure-selector">
        <button
          onClick={() => setActiveAttribute("accessories")}
          className={`btn ${activeAttribute === "accessories" ? "active" : ""}`}
        >
          Accessories
        </button>
        <button
          onClick={() => setActiveAttribute("face")}
          className={`btn ${activeAttribute === "face" ? "active" : ""}`}
        >
          Face
        </button>
        <button
          onClick={() => setActiveAttribute("facialHair")}
          className={`btn ${activeAttribute === "facialHair" ? "active" : ""}`}
        >
          Facial Hair
        </button>
      </div>

      {/* Toggle Button for Accessories*/}
      {activeAttribute === "accessories" && (
        <div className="toggle-container">
          <button onClick={toggleAccessories} className="btn toggle-btn">
            {accessoriesEnabled ? "Disable Accessories" : "Enable Accessories"}
          </button>
        </div>
      )}
      {activeAttribute === "facialHair" && (
        <div className="toggle-container">
          <button onClick={toggleFacialHair} className="btn toggle-btn">
            {facialHairEnabled ? "Disable Facial Hair" : "Enable Facial Hair"}
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
        <button onClick={handlePrevious} className="btn">
          Previous
        </button>

        {/* Display preview of current attribute choice */}
        <div className="preview-display">
          {choices.length > 0 && (
            <img
              src={createAvatar(openPeeps, {
                size: 128,
                accessories:
                  activeAttribute === "accessories" && accessoriesEnabled
                    ? [choices[accessoryIndex]]
                    : [],
                accessoriesProbability:
                  activeAttribute === "accessories" && accessoriesEnabled
                    ? 100
                    : 0,
                face: activeAttribute === "face" ? [choices[faceIndex]] : [],
                facialHair:
                  activeAttribute === "facialHair" && facialHairEnabled
                    ? [choices[facialHairIndex]]
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
        <button onClick={handleNext} className="btn">
          Next
        </button>
      </div>
    </div>
  );
}
