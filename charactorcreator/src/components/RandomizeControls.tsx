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
    <div className="flex flex-wrap gap-4">
      <button
        onClick={randomizeSelectedAttribute}
        className="px-4 py-2 text-sm font-medium bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Randomize {activeAttribute}
      </button>
      <button
        onClick={randomizeAllItems}
        className="px-4 py-2 text-sm font-medium bg-green-500 text-white rounded hover:bg-green-600"
      >
        Randomize All Items
      </button>
      <button
        onClick={randomizeAllColors}
        className="px-4 py-2 text-sm font-medium bg-yellow-500 text-white rounded hover:bg-yellow-600"
      >
        Randomize All Colors
      </button>
      <button
        onClick={randomizeAll}
        className="px-4 py-2 text-sm font-medium bg-red-500 text-white rounded hover:bg-red-600"
      >
        Randomize All
      </button>
    </div>
  );
}
