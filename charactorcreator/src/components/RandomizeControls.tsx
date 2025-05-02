interface RandomizeControlsProps {
  randomizeSelectedAttribute: () => void;
  randomizeAllItems: () => void;
  randomizeAllColors: () => void;
  randomizeAll: () => void;
  activeAttribute: string;
}

export default function RandomizeControls({
  randomizeSelectedAttribute,
  randomizeAllItems,
  randomizeAllColors,
  randomizeAll,
  activeAttribute,
}: RandomizeControlsProps) {
  return (
    <div className="flex flex-wrap gap-4 font-pixel">
      <button
        onClick={randomizeSelectedAttribute}
        className="px-4 py-2 text-xs bg-retroBlue border-2 border-black rounded-md text-black uppercase hover:bg-retroOrange transition-all"
      >
        Randomize {activeAttribute}
      </button>
      <button
        onClick={randomizeAllItems}
        className="px-4 py-2 text-xs bg-retroGreen border-2 border-black rounded-md text-black uppercase hover:bg-retroOrange transition-all"
      >
        Randomize All Items
      </button>
      <button
        onClick={randomizeAllColors}
        className="px-4 py-2 text-xs bg-yellow-300 border-2 border-black rounded-md text-black uppercase hover:bg-retroOrange transition-all"
      >
        Randomize All Colors
      </button>
      <button
        onClick={randomizeAll}
        className="px-4 py-2 text-xs bg-red-400 border-2 border-black rounded-md text-black uppercase hover:bg-retroOrange transition-all"
      >
        Randomize All
      </button>
    </div>
  );
}
