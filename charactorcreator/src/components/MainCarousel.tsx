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
  const [showColorPickers, setShowColorPickers] = useState(true);
  const [showAccessories, setShowAccessories] = useState(true);
  const [showRandomizer, setShowRandomizer] = useState(true);

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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="flex flex-col md:flex-row w-full max-w-5xl bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Display current avatar */}
        <AvatarPreview avatarDataPreview={avatarDataPreview} />

        <div className="w-full md:w-2/3 p-4 md:p-6 flex flex-col gap-6">
          {/* Attribute Selector */}
          <AttributeSelector
            extractedEnums={extractedEnums}
            activeAttribute={activeAttribute}
            setActiveAttribute={setActiveAttribute}
          />

          {/* Toggle Buttons for Visibility */}

          <div className="flex gap-4 mb-6">
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded"
              onClick={() => setShowColorPickers((prev) => !prev)}
            >
              Toggle Color Picker
            </button>
            <button
              className="px-4 py-2 bg-green-500 text-white rounded"
              onClick={() => setShowAccessories((prev) => !prev)}
            >
              Toggle Accessories
            </button>
            <button
              className="px-4 py-2 bg-orange-500 text-white rounded"
              onClick={() => setShowRandomizer((prev) => !prev)}
            >
              Toggle Randomizer
            </button>
          </div>

          {/* Randomize selected Button */}

          {/* <RandomizeControls
            randomizeSelectedAttribute={randomizeSelectedAttribute}
            randomizeAllItems={randomizeAllItems}
            randomizeAllColors={randomizeAllColors}
            randomizeAll={randomizeAll}
            activeAttribute={activeAttribute}
          /> */}

          {/* Toggle Button for Accessories and facial hair*/}
          {showAccessories && (
            <ToggleButton
              activeAttribute={activeAttribute}
              isEnabled={isEnabled}
            />
          )}

          {/* Choose Colors */}
          {showColorPickers && (
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
          )}

          {showAccessories && (
            <DisplayCurrentChoice
              attributeChoices={attributeChoices}
              activeAttribute={activeAttribute}
              isEnabled={isEnabled}
              attributeIndexes={attributeIndexes}
              handleNavigation={handleNavigation}
            />
          )}

          {/* display options */}
          {showAccessories && (
            <ButtonOptions
              attributeChoices={attributeChoices}
              setAttributeIndexes={setAttributeIndexes}
              activeAttribute={activeAttribute}
              attributeIndexes={attributeIndexes}
            />
          )}
        </div>
      </div>
    </div>
  );
}
