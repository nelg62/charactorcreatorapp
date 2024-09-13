"use client";
import { useState, useMemo } from "react";
import { createAvatar } from "@dicebear/core";
import { openPeeps } from "@dicebear/collection";
import { useAvatar } from "@/app/context/AvatarContext";

export default function AvatarCustomizer() {
  const {
    avatarData,
    avatarAccessoriesChoices,
    avatarFaceChoices,
    avatarFacialHairChoices,
    avatarHeadChoices,
    avatarBackgroundTypeChoices,
    setSelectedAccessories,
    setSelectedFace,
    setSelectedFacialHair,
    setSelectedHead,
    skinColor,
    setSkinColor,
    clothingColor,
    setClothingColor,
    headContrastColor,
    setHeadContrastColor,
    backgroundColor,
    backgroundColor2,
    setBackgroundColor,
    setBackgroundColor2,
    setSelectedBackgroundType,
    randomizeAccessories,
    randomizeFace,
    randomizeFacialHair,
    randomizeHead,
    randomizeBackground,
    randomizeAvatar,
  } = useAvatar();

  const handleRandomize = () => {
    switch (activeAttribute) {
      case "accessories":
        randomizeAccessories();
        break;
      case "face":
        randomizeFace();
        break;
      case "facialHair":
        randomizeFacialHair();
        break;
      case "head":
        randomizeHead();
        break;

      default:
        break;
    }
  };

  const [accessoryIndex, setAccessoryIndex] = useState(0);
  const [faceIndex, setFaceIndex] = useState(0);
  const [facialHairIndex, setFacialHairIndex] = useState(0);
  const [headIndex, setHeadIndex] = useState(0);
  const [backgroundTypeIndex, setBackgroundTypeIndex] = useState(0);
  const [activeAttribute, setActiveAttribute] = useState("accessories");

  const [accessoriesEnabled, setAccessoriesEnabled] = useState(true);
  const [facialHairEnabled, setFacialHairEnabled] = useState(true);

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
    } else if (activeAttribute === "background") {
      setSelectedBackgroundType(
        avatarBackgroundTypeChoices[backgroundTypeIndex]
      );
    }
  };

  useMemo(() => {
    updateAvatar();
  }, [
    accessoryIndex,
    faceIndex,
    facialHairIndex,
    headIndex,
    backgroundTypeIndex,
    activeAttribute,
    accessoriesEnabled,
    facialHairEnabled,
    clothingColor,
    skinColor,
    headContrastColor,
    backgroundColor,
    backgroundColor2,
  ]);

  const choices =
    {
      accessories: avatarAccessoriesChoices,
      face: avatarFaceChoices,
      facialHair: avatarFacialHairChoices,
      head: avatarHeadChoices,
      background: avatarBackgroundTypeChoices,
    }[activeAttribute] || [];

  const handlePrevious = () => {
    if (activeAttribute === "accessories") {
      setAccessoryIndex((prev) => (prev > 0 ? prev - 1 : choices.length - 1));
    } else if (activeAttribute === "face") {
      setFaceIndex((prev) => (prev > 0 ? prev - 1 : choices.length - 1));
    } else if (activeAttribute === "facialHair") {
      setFacialHairIndex((prev) => (prev > 0 ? prev - 1 : choices.length - 1));
    } else if (activeAttribute === "head") {
      setHeadIndex((prev) => (prev > 0 ? prev - 1 : choices.length - 1));
    } else if (activeAttribute === "background") {
      setBackgroundTypeIndex((prev) =>
        prev > 0 ? prev - 1 : choices.length - 1
      );
    }
  };

  const handleNext = () => {
    if (activeAttribute === "accessories") {
      setAccessoryIndex((prev) => (prev < choices.length - 1 ? prev + 1 : 0));
    } else if (activeAttribute === "face") {
      setFaceIndex((prev) => (prev < choices.length - 1 ? prev + 1 : 0));
    } else if (activeAttribute === "facialHair") {
      setFacialHairIndex((prev) => (prev < choices.length - 1 ? prev + 1 : 0));
    } else if (activeAttribute === "head") {
      setHeadIndex((prev) => (prev < choices.length - 1 ? prev + 1 : 0));
    } else if (activeAttribute === "background") {
      setBackgroundTypeIndex((prev) =>
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

      {/* Color Pickers */}
      <div className="color-pickers">
        <div>
          <label htmlFor="clothingColor">Clothing Color: </label>
          <input
            type="color"
            id="clothingColor"
            value={`#${clothingColor}`}
            onChange={(e) => setClothingColor(e.target.value.replace("#", ""))}
          />
        </div>

        <div>
          <label htmlFor="skinColor">Skin Color: </label>
          <input
            type="color"
            id="skinColor"
            value={`#${skinColor}`}
            onChange={(e) => setSkinColor(e.target.value.replace("#", ""))}
          />
        </div>

        <div>
          <label htmlFor="hairColor">Hair Color: </label>
          <input
            type="color"
            id="hairColor"
            value={`#${headContrastColor}`}
            onChange={(e) =>
              setHeadContrastColor(e.target.value.replace("#", ""))
            }
          />
        </div>

        <div>
          <label htmlFor="backgroundColor">Background Color 1: </label>
          <input
            type="color"
            id="backgroundColor"
            value={`#${backgroundColor}`}
            onChange={(e) =>
              setBackgroundColor(e.target.value.replace("#", ""))
            }
          />
        </div>

        <div>
          <label htmlFor="backgroundColor2">Background Color 2: </label>
          <input
            type="color"
            id="backgroundColor2"
            value={`#${backgroundColor2}`}
            onChange={(e) =>
              setBackgroundColor2(e.target.value.replace("#", ""))
            }
          />
        </div>
      </div>

      {/* Navigation and Preview for selected attribute */}
      <button onClick={handleRandomize} className="btn">
        Randomize {activeAttribute}
      </button>
      <button onClick={randomizeAvatar} className="btn">
        Randomize All
      </button>
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
                head: activeAttribute === "head" ? [choices[headIndex]] : [],
                clothingColor: [clothingColor],
                skinColor: [skinColor],
                headContrastColor: [headContrastColor],
                backgroundColor: [backgroundColor, backgroundColor2],
                backgroundType:
                  activeAttribute === "background"
                    ? [choices[backgroundTypeIndex]]
                    : [],
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
