"use client";
import { useAvatar } from "@/app/context/AvatarContext";
import { useState } from "react";

// Reusable Carousel Hook
const useCarousel = (length: number) => {
  const [index, setIndex] = useState(0);

  const next = () => setIndex((prev) => (prev < length - 1 ? prev + 1 : 0));
  const previous = () => setIndex((prev) => (prev > 0 ? prev - 1 : length - 1));

  return { index, next, previous };
};

export default function MainCarousel() {
  const {
    avatarData,
    setSelection,
    toggleEnabled,
    isAccessoryEnabled,
    isFacialHairEnabled,
    accessories,
    face,
    facialHair,
    clothingColor,
    setClothingColor,
  } = useAvatar();

  // Create carousels for each attribute
  const {
    index: accessoryIndex,
    next: nextAccessory,
    previous: prevAccessory,
  } = useCarousel(accessories.length);

  const {
    index: faceIndex,
    next: nextFace,
    previous: prevFace,
  } = useCarousel(face.length);
  const {
    index: facialHairIndex,
    next: nextFacialHair,
    previous: prevFacialHair,
  } = useCarousel(facialHair.length);

  const [activeAttribute, setActiveAttribute] = useState<
    "accessories" | "face" | "facialHair"
  >("accessories");

  // Update selected attribute in AvatarContext
  const updateAttribute = () => {
    if (activeAttribute === "accessories")
      setSelection("accessories", accessoryIndex);
    if (activeAttribute === "face") setSelection("face", faceIndex);
    if (activeAttribute === "facialHair")
      setSelection("facialHair", facialHairIndex);
  };

  // Call update when active attribute changes
  updateAttribute();

  return (
    <div className="avatar-customizer">
      <div className="avatar-display">
        <img src={avatarData} alt="Current Avatar" />
      </div>

      <div className="attribute-selector">
        {["accessories", "face", "facialHair"].map((attribute) => (
          <button
            key={attribute}
            onClick={() =>
              setActiveAttribute(
                attribute as "accessories" | "face" | "facialHair"
              )
            }
            className={`btn ${activeAttribute === attribute ? "active" : ""}`}
          >
            {attribute}
          </button>
        ))}
      </div>

      {activeAttribute === "accessories" && (
        <button onClick={() => toggleEnabled("accessories")} className="btn">
          {isAccessoryEnabled ? "Disable Accessories" : "Enable Accessories"}
        </button>
      )}

      {activeAttribute === "facialHair" && (
        <button onClick={() => toggleEnabled("facialHair")} className="btn">
          {isFacialHairEnabled ? "Disable Facial Hair" : "Enable Facial Hair"}
        </button>
      )}

      <div className="preview-container">
        {/* The navigation buttons must correspond to the active attribute */}
        <button
          onClick={
            activeAttribute === "accessories"
              ? prevAccessory
              : activeAttribute === "face"
              ? prevFace
              : prevFacialHair
          }
          className="btn"
        >
          Previous
        </button>

        <div className="preview-display">
          {/* Display the current choice */}
          <span>
            {activeAttribute === "accessories"
              ? accessories[accessoryIndex]
              : activeAttribute === "face"
              ? face[faceIndex]
              : facialHair[facialHairIndex]}
          </span>
        </div>

        <button
          onClick={
            activeAttribute === "accessories"
              ? nextAccessory
              : activeAttribute === "face"
              ? nextFace
              : nextFacialHair
          }
          className="btn"
        >
          Next
        </button>
      </div>

      <div>
        <label>Clothing Color: </label>
        <input
          type="color"
          value={`#${clothingColor}`}
          onChange={(e) => setClothingColor(e.target.value.replace("#", ""))}
        />
      </div>
    </div>
  );
}
