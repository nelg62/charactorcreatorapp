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
    <div className="flex items-center justify-between p-4 bg-gray-100 rounded-lg shadow-md">
      <div className="flex flex-col w-full text-center">
        <label
          htmlFor={label.toLowerCase().replace(" ", "-")}
          className="text-sm font-medium text-gray-700"
        >
          {label}:{" "}
        </label>
        <div className="flex flex-col md:flex-row">
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
            className="px-3 py-2 w-10 h-10 text-sm font-medium bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            <FaDice className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ColorPicker;
