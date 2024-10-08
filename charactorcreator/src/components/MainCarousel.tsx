"use client";
import { useAvatar } from "@/app/context/AvatarContext";
import { openPeeps } from "@dicebear/collection";
import { createAvatar } from "@dicebear/core";
import { useEffect, useState } from "react";
import ColorPicker from "./ColorPicker";

export default function AvatarCustomizer() {
  // context variables
  const {
    avatarData,
    randomizeAvatar,
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
    skinColor,
    setSkinColor,
  } = useAvatar();

  const getRandomColor = () => {
    return Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, "0");
  };

  const randomizeClothingColor = () => setClothingColor(getRandomColor());
  const randomizeHeadContrastColor = () =>
    setHeadContrastColor(getRandomColor());
  const randomizeBackgroundColor = () => setBackgroundColor(getRandomColor());
  const randomizeSkinColor = () => setSkinColor(getRandomColor());

  const [attributeIndexes, setAttributeIndexes] = useState({
    accessories: 0,
    face: 0,
    facialHair: 0,
    head: 0,
    mask: 0,
  });

  const [activeAttribute, setActiveAttribute] = useState<string>("accessories");

  const attributeChoices =
    {
      accessories: avatarAccessoriesChoices,
      face: avatarFaceChoices,
      facialHair: avatarFacialHairChoices,
      head: avatarHeadChoices,
      mask: avatarMaskChoices,
    }[activeAttribute] || [];

  // Update Avatar
  useEffect(() => {
    const currentIndex =
      attributeIndexes[activeAttribute as keyof typeof attributeIndexes];

    if (activeAttribute === "accessories") {
      setSelectedAccessories(
        accessoriesEnabled ? avatarAccessoriesChoices[currentIndex] : ""
      );
    } else if (activeAttribute === "face") {
      setSelectedFace(avatarFaceChoices[currentIndex]);
    } else if (activeAttribute === "facialHair") {
      setSelectedFacialHair(
        facialHairEnabled ? avatarFacialHairChoices[currentIndex] : ""
      );
    } else if (activeAttribute === "head") {
      setSelectedHead(avatarHeadChoices[currentIndex]);
    } else if (activeAttribute === "mask") {
      setSelectedMask(maskEnabled ? avatarMaskChoices[currentIndex] : "");
    }
  }, [
    attributeIndexes,
    activeAttribute,
    accessoriesEnabled,
    facialHairEnabled,
    maskEnabled,
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
  ]);

  const randomizeSelection = () => {
    const totalChoices = attributeChoices.length;
    if (totalChoices > 0) {
      const randomIndex = Math.floor(Math.random() * totalChoices);
      setAttributeIndexes((prevIndexes) => ({
        ...prevIndexes,
        [activeAttribute]: randomIndex,
      }));
    }
  };

  // Generalized Navigation fuunction
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

      <div className="randomize-container">
        {/* Randomize selected Button */}
        <button onClick={randomizeSelection} className="btn randomize-btn">
          Randomize {activeAttribute}
        </button>

        {/* Randomize All Button */}
        <button onClick={randomizeAvatar} className="btn randomize-btn">
          Randomize All
        </button>
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
        {/* Clothing Color */}
        <ColorPicker
          label="Clothing Color"
          color={clothingColor}
          setColor={setClothingColor}
          randomizeColor={randomizeClothingColor}
        />
        {/* Head contrast Color */}
        <ColorPicker
          label="Head Contrast Color"
          color={headContrastColor}
          setColor={setHeadContrastColor}
          randomizeColor={randomizeHeadContrastColor}
        />
        {/* Background Color */}
        <ColorPicker
          label="Background Color"
          color={backgroundColor}
          setColor={setBackgroundColor}
          randomizeColor={randomizeBackgroundColor}
        />
        {/* Skin Color */}
        <ColorPicker
          label="Skin Color"
          color={skinColor}
          setColor={setSkinColor}
          randomizeColor={randomizeSkinColor}
        />
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
                    ? [attributeChoices[attributeIndexes.accessories]]
                    : [],
                accessoriesProbability:
                  activeAttribute === "accessories" && accessoriesEnabled
                    ? 100
                    : 0,
                face:
                  activeAttribute === "face"
                    ? [attributeChoices[attributeIndexes.face]]
                    : [],
                facialHair:
                  activeAttribute === "facialHair" && facialHairEnabled
                    ? [attributeChoices[attributeIndexes.facialHair]]
                    : [],
                facialHairProbability:
                  activeAttribute === "facialHair" && facialHairEnabled
                    ? 100
                    : 0,
                head:
                  activeAttribute === "head"
                    ? [attributeChoices[attributeIndexes.head]]
                    : [],
                mask:
                  activeAttribute === "mask" && maskEnabled
                    ? [attributeChoices[attributeIndexes.mask]]
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
          <h1 className="text-center">
            {
              attributeChoices[
                attributeIndexes[
                  activeAttribute as keyof typeof attributeIndexes
                ]
              ]
            }
          </h1>
        </div>

        {/* Next Button */}
        <button onClick={() => handleNavigation("next")} className="btn">
          Next
        </button>
      </div>
    </div>
  );
}
