"use client";
import { useAvatar } from "@/app/context/AvatarContext";
import { openPeeps } from "@dicebear/collection";
import { createAvatar, StyleOptions } from "@dicebear/core";
import { useMemo, useState } from "react";
// import ColorPicker from "./ColorPicker";
import Image from "next/image";
import ColorPicker from "./ColorPicker";

export default function AvatarCustomizer() {
  // context variables
  const {
    extractedEnums,
    isEnabled,
    toggleState,
    clothingColor,
    headContrastColor,
    backgroundColor,
    skinColor,
    setClothingColor,
    setHeadContrastColor,
    setBackgroundColor,
    setSkinColor,
  } = useAvatar();
  const [activeAttribute, setActiveAttribute] =
    useState<keyof typeof extractedEnums>("accessories");
  const [attributeIndexes, setAttributeIndexes] = useState<
    Record<string, number>
  >(
    Object.keys(extractedEnums).reduce((acc, key) => ({ ...acc, [key]: 0 }), {})
  );

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

  const randomizeAllColors = () => {
    setClothingColor(getRandomColor());
    setHeadContrastColor(getRandomColor());
    setBackgroundColor(getRandomColor());
    setSkinColor(getRandomColor());
  };

  const attributeChoices = extractedEnums[activeAttribute] || [];

  // Update Avatar
  const avatarDataPreview = useMemo(() => {
    const avatarOptions: StyleOptions<openPeeps.Options> = {
      size: 128,
      ...Object.fromEntries(
        Object.entries(attributeIndexes).map(([key, index]) => [
          key,
          [extractedEnums[key]?.[index]] as unknown,
        ])
      ),
      accessoriesProbability: isEnabled.accessories ? 100 : 0,
      facialHairProbability: isEnabled.facialHair ? 100 : 0,
      maskProbability: isEnabled.mask ? 100 : 0,
      clothingColor: [clothingColor],
      headContrastColor: [headContrastColor],
      backgroundColor: [backgroundColor],
      skinColor: [skinColor],
    };
    return createAvatar(openPeeps, avatarOptions).toDataUri();
  }, [
    attributeIndexes,
    backgroundColor,
    clothingColor,
    extractedEnums,
    headContrastColor,
    isEnabled,
    skinColor,
  ]);

  // Generalized Navigation fuunction
  const handleNavigation = (direction: "next" | "previous") => {
    setAttributeIndexes((prev) => {
      const currentIndex = prev[activeAttribute];
      const totalChoices = attributeChoices.length;
      const newIndex =
        direction === "next"
          ? (currentIndex + 1) % totalChoices
          : (currentIndex - 1 + totalChoices) % totalChoices;
      return { ...prev, [activeAttribute]: newIndex };
    });
  };

  const randomizeAllItems = () => {
    const newIndexes = { ...attributeIndexes };
    for (const key in extractedEnums) {
      const options = extractedEnums[key];
      newIndexes[key] = Math.floor(Math.random() * options.length);
    }
    setAttributeIndexes(newIndexes);
  };

  const randomizeSelectedAttribute = () => {
    if (!activeAttribute) return;
    const options = extractedEnums[activeAttribute];
    setAttributeIndexes((prev) => ({
      ...prev,
      [activeAttribute]: Math.floor(Math.random() * options.length),
    }));
  };

  const randomizeAll = () => {
    randomizeAllItems();
    randomizeAllColors();
  };

  return (
    <div className="avatar-customizer">
      {/* Display current avatar */}
      <div className="avatar-display">
        <Image
          src={avatarDataPreview}
          alt="Display Avatar"
          height={100}
          width={100}
        />
      </div>

      {/* Attribute Selector */}
      <div className="attribure-selector">
        {Object.keys(extractedEnums).map((attribute) => (
          <button
            key={attribute}
            onClick={() =>
              setActiveAttribute(attribute as keyof typeof extractedEnums)
            }
            className={`btn ${activeAttribute === attribute ? "active" : ""}`}
          >
            {attribute}
          </button>
        ))}
      </div>

      <div className="randomize-container">
        {/* Randomize selected Button */}
        <button
          onClick={randomizeSelectedAttribute}
          className="btn randomize-btn"
        >
          Randomize {activeAttribute}
        </button>

        {/* Randomize All Button */}
        <button onClick={randomizeAllItems} className="btn randomize-btn">
          Randomize All Items
        </button>

        {/* Randomize all colors */}
        <button onClick={randomizeAllColors} className="btn randomize-btn">
          Randomize All Colors
        </button>

        {/* Randomize all */}
        <button onClick={randomizeAll} className="btn randomize-btn">
          Randomize All
        </button>
      </div>

      {/* Toggle Button for Accessories and facial hair*/}
      {["accessories", "facialHair", "mask"].includes(activeAttribute) && (
        <div className="toggle-container">
          <button
            onClick={() =>
              toggleState(
                activeAttribute as "accessories" | "facialHair" | "mask"
              )
            }
            className="btn toggle-btn"
          >
            {isEnabled[activeAttribute as keyof typeof isEnabled]
              ? `Disable ${activeAttribute}`
              : `Enable ${activeAttribute}`}
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
            <Image
              src={createAvatar(openPeeps, {
                size: 128,
                accessories:
                  activeAttribute === "accessories" &&
                  isEnabled[activeAttribute as keyof typeof isEnabled]
                    ? ([
                        attributeChoices[attributeIndexes.accessories],
                      ] as openPeeps.Options["accessories"])
                    : [],
                accessoriesProbability:
                  activeAttribute === "accessories" &&
                  isEnabled[activeAttribute as keyof typeof isEnabled]
                    ? 100
                    : 0,
                face:
                  activeAttribute === "face"
                    ? ([
                        attributeChoices[attributeIndexes.face],
                      ] as openPeeps.Options["face"])
                    : [],
                facialHair:
                  activeAttribute === "facialHair" &&
                  isEnabled[activeAttribute as keyof typeof isEnabled]
                    ? ([
                        attributeChoices[attributeIndexes.facialHair],
                      ] as openPeeps.Options["facialHair"])
                    : [],
                facialHairProbability:
                  activeAttribute === "facialHair" &&
                  isEnabled[activeAttribute as keyof typeof isEnabled]
                    ? 100
                    : 0,
                head:
                  activeAttribute === "head"
                    ? ([
                        attributeChoices[attributeIndexes.head],
                      ] as openPeeps.Options["head"])
                    : [],
                mask:
                  activeAttribute === "mask" &&
                  isEnabled[activeAttribute as keyof typeof isEnabled]
                    ? ([
                        attributeChoices[attributeIndexes.mask],
                      ] as openPeeps.Options["mask"])
                    : [],
                maskProbability:
                  activeAttribute === "mask" &&
                  isEnabled[activeAttribute as keyof typeof isEnabled]
                    ? 100
                    : 0,
                clothingColor: [clothingColor],
                headContrastColor: [headContrastColor],
                backgroundColor: [backgroundColor],
              }).toDataUri()}
              alt="Avatar Item Preview"
              height={128}
              width={128}
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
