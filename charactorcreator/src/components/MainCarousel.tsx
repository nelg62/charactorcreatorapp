"use client";
import { useAvatar } from "@/app/context/AvatarContext";
import { openPeeps } from "@dicebear/collection";
import { createAvatar, StyleOptions } from "@dicebear/core";
import { useEffect, useMemo, useState } from "react";
// import ColorPicker from "./ColorPicker";
import Image from "next/image";
import ColorPicker from "./ColorPicker";
import AvatarPreview from "./AvatarPreview";
import RandomizeControls from "./RandomizeControls";

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

  const [visibleStartIndex, setVisibleStartIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(3);

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

  useEffect(() => {
    // Dynamically update visibleCount based on screen width
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setVisibleCount(3);
      } else if (window.innerWidth < 1024) {
        setVisibleCount(5);
      } else {
        setVisibleCount(7);
      }
    };
    handleResize(); // Set initial count
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleCarouselNavigation = (direction: "left" | "right") => {
    setVisibleStartIndex((prev) => {
      const totalChoices = attributeChoices.length;
      if (direction === "right") {
        return (prev + visibleCount) % totalChoices;
      } else {
        return (prev - visibleCount + totalChoices) % totalChoices;
      }
    });
  };

  // Determine visible attribute choices
  const visibleChoices = attributeChoices.slice(
    visibleStartIndex,
    visibleStartIndex + visibleCount
  );

  // If at the end, wrap around
  if (visibleChoices.length < visibleCount) {
    visibleChoices.push(
      ...attributeChoices.slice(0, visibleCount - visibleChoices.length)
    );
  }

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="flex w-full max-w-5xl bg-white shadow-lg rounded-lg">
        {/* Display current avatar */}
        <AvatarPreview avatarDataPreview={avatarDataPreview} />
        {/* <div className="w-1/3 p-6 flex items-center justify-center border-r">
          <Image
            src={avatarDataPreview}
            alt="Display Avatar"
            height={100}
            width={100}
            className="rounded-full border border-gray-300"
          />
        </div> */}
        <div className="w-2/3 p-6 flex flex-col gap-6">
          {/* Attribute Selector */}
          <div className="grid grid-cols-3 gap-2">
            {Object.keys(extractedEnums).map((attribute) => (
              <button
                key={attribute}
                onClick={() =>
                  setActiveAttribute(attribute as keyof typeof extractedEnums)
                }
                className={`py-2 px-4 text-sm font-medium rounded ${
                  activeAttribute === attribute
                    ? "bg-blue-600"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                {attribute}
              </button>
            ))}
          </div>

          {/* <div className="flex flex-wrap gap-4"> */}
          {/* Randomize selected Button */}

          <RandomizeControls
            randomizeSelectedAttribute={randomizeSelectedAttribute}
            randomizeAllItems={randomizeAllItems}
            randomizeAllColors={randomizeAllColors}
            randomizeAll={randomizeAll}
            activeAttribute={activeAttribute}
          />
          {/* <button
              onClick={randomizeSelectedAttribute}
              className="px-4 py-2 text-sm font-medium bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Randomize {activeAttribute}
            </button> */}

          {/* Randomize All Button */}
          {/* <button
              onClick={randomizeAllItems}
              className="px-4 py-2 text-sm font-medium bg-green-500 text-white rounded hover:bg-green-600"
            >
              Randomize All Items
            </button> */}

          {/* Randomize all colors */}
          {/* <button
              onClick={randomizeAllColors}
              className="px-4 py-2 text-sm font-medium bg-yellow-500 text-white rounded hover:bg-yellow-600"
            >
              Randomize All Colors
            </button> */}

          {/* Randomize all */}
          {/* <button
              onClick={randomizeAll}
              className="px-4 py-2 text-sm font-medium bg-red-500 text-white rounded hover:bg-red-600"
            >
              Randomize All
            </button>
          </div> */}

          {/* Toggle Button for Accessories and facial hair*/}
          {["accessories", "facialHair", "mask"].includes(activeAttribute) && (
            <div className="px-4 py-2 text-sm font-medium bg-blue-500 flex items-center justify-center rounded text-white">
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

          <div className="grid grid-cols-2 gap-4">
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

          <div className="flex items-center justify-between">
            {/* Previous button */}
            <button
              onClick={() => handleNavigation("previous")}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
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

          {/* display options */}
          <div className="attribute-buttons flex items-center">
            <button
              onClick={() => handleCarouselNavigation("left")}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              &lt;
            </button>

            <div className="flex gap-2">
              {visibleChoices.map((choice, index) => (
                <button
                  key={index}
                  onClick={() =>
                    setAttributeIndexes((prev) => ({
                      ...prev,
                      [activeAttribute]:
                        (visibleStartIndex + index) % attributeChoices.length,
                    }))
                  }
                  className={`btn choice-btn ${
                    attributeIndexes[activeAttribute] ===
                    (visibleStartIndex + index) % attributeChoices.length
                      ? "active"
                      : ""
                  }`}
                >
                  <Image
                    src={createAvatar(openPeeps, {
                      size: 64,
                      [activeAttribute]: [choice] as unknown,
                      accessoriesProbability:
                        activeAttribute === "accessories" ? 100 : 0,
                      facialHairProbability:
                        activeAttribute === "facialHair" ? 100 : 0,
                      clothingColor: [clothingColor],
                      headContrastColor: [headContrastColor],
                      backgroundColor: [backgroundColor],
                      skinColor: [skinColor],
                    }).toDataUri()}
                    alt={`${choice} preview`}
                    height={64}
                    width={64}
                  />
                  <span>{choice}</span>
                </button>
              ))}
            </div>
            <button
              onClick={() => handleCarouselNavigation("right")}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              &gt;
            </button>
          </div>

          {/* <div className="attribute-buttons">
            {attributeChoices.map((choice, index) => (
              <button
                key={index}
                onClick={() =>
                  setAttributeIndexes((prev) => ({
                    ...prev,
                    [activeAttribute]: index,
                  }))
                }
                className={`btn choice-btn ${
                  attributeIndexes[activeAttribute] === index ? "active" : ""
                }`}
              >
                <Image
                  src={createAvatar(openPeeps, {
                    size: 64,
                    [activeAttribute]: [choice] as unknown,
                    accessoriesProbability:
                      activeAttribute === "accessories" ? 100 : 0,
                    facialHairProbability:
                      activeAttribute === "facialHair" ? 100 : 0,
                    maskProbability: activeAttribute === "mask" ? 100 : 0,
                    clothingColor: [clothingColor],
                    headContrastColor: [headContrastColor],
                    backgroundColor: [backgroundColor],
                    skinColor: [skinColor],
                  }).toDataUri()}
                  alt={`${choice} preview`}
                  height={64}
                  width={64}
                />
                <span>{choice}</span>
              </button>
            ))}
          </div> */}
        </div>
      </div>
    </div>
  );
}
