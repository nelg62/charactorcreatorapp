"use client";
import { useAvatar } from "@/app/context/AvatarContext";
import { openPeeps } from "@dicebear/collection";
import { createAvatar } from "@dicebear/core";
import { useEffect, useMemo, useState } from "react";

export default function AvatarCustomizer() {
  const {
    avatarData,
    avatarAccessoriesChoices,
    setSelectedAccessories,
    selectedAccessoryIndex,
    setSelectedAccessoryIndex,
  } = useAvatar();

  const [accessoryIndex, setAccessoryIndex] = useState(0);

  const [activeAttribute, setActiveAttribute] = useState("accessories");

  const [accessoriesEnabled, setAccessoriesEnabled] = useState(true);
  const [facialHairEnabled, setFacialHairEnabled] = useState(true);

  const updateAvatar = () => {
    if (activeAttribute === "accessories" && accessoriesEnabled) {
      setSelectedAccessories(avatarAccessoriesChoices[selectedAccessoryIndex]);
    } else {
      setSelectedAccessories("");
    }
  };

  useEffect(() => {
    updateAvatar();
  }, [activeAttribute, selectedAccessoryIndex, accessoriesEnabled]);

  const choices =
    {
      accessories: avatarAccessoriesChoices,
    }[activeAttribute] || [];

  const handlePrevious = () => {
    if (activeAttribute === "accessories") {
      setSelectedAccessoryIndex((prev) =>
        prev > 0 ? prev - 1 : choices.length - 1
      );
    }
  };

  const handleNext = () => {
    if (activeAttribute === "accessories") {
      setSelectedAccessoryIndex((prev) =>
        prev < choices.length - 1 ? prev + 1 : 0
      );
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
      <div className="attribute-selector">
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
        <button
          onClick={() => setActiveAttribute("head")}
          className={`btn ${activeAttribute === "head" ? "active" : ""}`}
        >
          Head
        </button>
        <button
          onClick={() => setActiveAttribute("background")}
          className={`btn ${activeAttribute === "background" ? "active" : ""}`}
        >
          Background
        </button>
      </div>

      {/* Toggle Button for Accessories or Facial Hair */}
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

      <div className="preview-container">
        <button onClick={handlePrevious} className="btn">
          Previous
        </button>

        <div className="preview-display">
          {/* Display preview of current attribute choice */}
          {choices.length > 0 && (
            <img
              src={createAvatar(openPeeps, {
                size: 128,
                accessories:
                  activeAttribute === "accessories" && accessoriesEnabled
                    ? [choices[selectedAccessoryIndex]]
                    : [],
                accessoriesProbability:
                  activeAttribute === "accessories" && accessoriesEnabled
                    ? 100
                    : 0,
              }).toDataUri()}
              alt={`Preview ${activeAttribute} option`}
            />
          )}
        </div>

        <button onClick={handleNext} className="btn">
          Next
        </button>
      </div>
    </div>
  );
}
