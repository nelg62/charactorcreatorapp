import ColorPicker from "./ColorPicker";

interface ColorCombinePickersProps {
  clothingColor: string;
  headContrastColor: string;
  backgroundColor: string;
  skinColor: string;
  setClothingColor: (color: string) => void;
  setHeadContrastColor: (color: string) => void;
  setBackgroundColor: (color: string) => void;
  setSkinColor: (color: string) => void;
  randomizeClothingColor: () => void;
  randomizeHeadContrastColor: () => void;
  randomizeBackgroundColor: () => void;
  randomizeSkinColor: () => void;
}

export default function ColorCombinePickers({
  clothingColor,
  headContrastColor,
  backgroundColor,
  skinColor,
  setClothingColor,
  setHeadContrastColor,
  setBackgroundColor,
  setSkinColor,
  randomizeClothingColor,
  randomizeHeadContrastColor,
  randomizeBackgroundColor,
  randomizeSkinColor,
}: ColorCombinePickersProps) {
  return (
    <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
      <ColorPicker
        label="Clothing"
        color={clothingColor}
        setColor={setClothingColor}
        randomizeColor={randomizeClothingColor}
      />
      <ColorPicker
        label="Head"
        color={headContrastColor}
        setColor={setHeadContrastColor}
        randomizeColor={randomizeHeadContrastColor}
      />
      <ColorPicker
        label="Background"
        color={backgroundColor}
        setColor={setBackgroundColor}
        randomizeColor={randomizeBackgroundColor}
      />
      <ColorPicker
        label="Skin"
        color={skinColor}
        setColor={setSkinColor}
        randomizeColor={randomizeSkinColor}
      />
    </div>
  );
}
