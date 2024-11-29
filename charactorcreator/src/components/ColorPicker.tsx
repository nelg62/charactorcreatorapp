import { FaDice } from "react-icons/fa";

interface ColorPickerProps {
  label: string;
  color: string;
  setColor: (color: string) => void;
  randomizeColor: () => void;
}

const ColorPicker = ({
  label,
  color,
  setColor,
  randomizeColor,
}: ColorPickerProps) => {
  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-md">
      <label
        htmlFor={label.toLowerCase().replace(" ", "-")}
        className="block text-sm font-medium text-gray-700"
      >
        {label}:{" "}
      </label>
      <div className="flex items-center gap-2 mt-2">
        <input
          type="color"
          id={label.toLowerCase().replace(" ", "-")}
          value={`#${color}`}
          onChange={(e) => setColor(e.target.value.replace("#", ""))}
          className="w-10 h-10 border-none cursor-pointer rounded-lg"
        />
        {/* Randmize button for color picker */}
        <button
          onClick={randomizeColor}
          className="flex items-center justify-center w-10 h-10 text-white bg-blue-500 rounded hover:bg-blue-600"
        >
          <FaDice />
        </button>
      </div>
    </div>
  );
};

export default ColorPicker;
