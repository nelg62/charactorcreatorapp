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
    <div className="grid grid-cols-2 gap-4">
      <ColorPicker
        label="Clothing Color"
        color={clothingColor}
        setColor={setClothingColor}
        randomizeColor={randomizeClothingColor}
      />
      <ColorPicker
        label="Head Contrast Color"
        color={headContrastColor}
        setColor={setHeadContrastColor}
        randomizeColor={randomizeHeadContrastColor}
      />
      <ColorPicker
        label="Background Color"
        color={backgroundColor}
        setColor={setBackgroundColor}
        randomizeColor={randomizeBackgroundColor}
      />
      <ColorPicker
        label="Skin Color"
        color={skinColor}
        setColor={setSkinColor}
        randomizeColor={randomizeSkinColor}
      />
    </div>
  );
}
