"use client";
import { useAvatar } from "@/app/context/AvatarContext";
import { openPeeps } from "@dicebear/collection";
import { createAvatar, StyleOptions } from "@dicebear/core";
import { useMemo, useState } from "react";
import AvatarPreview from "./AvatarPreview";
import RandomizeControls from "./RandomizeControls";
import ColorCombinePickers from "./ColorCombinePickers";
import ToggleButton from "./ToggleButton";
import DisplayCurrentChoice from "./DisplayCurrentChoice";
import ButtonOptions from "./ButtonOptions";
import AttributeSelector from "./AttributeSelector";

export default function AvatarCustomizer() {
  // context variables
  const {
    extractedEnums,
    isEnabled,
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
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="flex w-full max-w-5xl bg-white shadow-lg rounded-lg">
        {/* Display current avatar */}
        <AvatarPreview avatarDataPreview={avatarDataPreview} />

        <div className="w-2/3 p-6 flex flex-col gap-6">
          {/* Attribute Selector */}
          <AttributeSelector
            extractedEnums={extractedEnums}
            activeAttribute={activeAttribute}
            setActiveAttribute={setActiveAttribute}
          />

          {/* Randomize selected Button */}

          <RandomizeControls
            randomizeSelectedAttribute={randomizeSelectedAttribute}
            randomizeAllItems={randomizeAllItems}
            randomizeAllColors={randomizeAllColors}
            randomizeAll={randomizeAll}
            activeAttribute={activeAttribute}
          />

          {/* Toggle Button for Accessories and facial hair*/}
          <ToggleButton
            activeAttribute={activeAttribute}
            isEnabled={isEnabled}
          />

          {/* Choose Colors */}

          <ColorCombinePickers
            clothingColor={clothingColor}
            headContrastColor={headContrastColor}
            backgroundColor={backgroundColor}
            skinColor={skinColor}
            setClothingColor={setClothingColor}
            setHeadContrastColor={setHeadContrastColor}
            setBackgroundColor={setBackgroundColor}
            setSkinColor={setSkinColor}
            randomizeClothingColor={randomizeClothingColor}
            randomizeHeadContrastColor={randomizeHeadContrastColor}
            randomizeBackgroundColor={randomizeBackgroundColor}
            randomizeSkinColor={randomizeSkinColor}
          />

          <DisplayCurrentChoice
            attributeChoices={attributeChoices}
            activeAttribute={activeAttribute}
            isEnabled={isEnabled}
            attributeIndexes={attributeIndexes}
            handleNavigation={handleNavigation}
          />

          {/* display options */}
          <ButtonOptions
            attributeChoices={attributeChoices}
            setAttributeIndexes={setAttributeIndexes}
            activeAttribute={activeAttribute}
            attributeIndexes={attributeIndexes}
          />
        </div>
      </div>
    </div>
  );
}
