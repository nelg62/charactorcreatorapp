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
    <div className="p-2 bg-retroBlue rounded-lg shadow-inner border-2 border-black font-pixel">
      <label
        htmlFor={label.toLowerCase().replace(" ", "-")}
        className="block text-center text-xs font-bold text-black uppercase tracking-wider"
      >
        {label}
      </label>
      <div className="flex items-center justify-center gap-2 mt-2">
        <input
          type="color"
          id={label.toLowerCase().replace(" ", "-")}
          value={`#${color}`}
          onChange={(e) => setColor(e.target.value.replace("#", ""))}
          className="w-10 h-10 rounded-md border-2 border-black cursor-pointer"
        />
        {/* Randmize button for color picker */}
        <button
          onClick={randomizeColor}
          className="w-10 h-10 bg-retroOrange text-black border-2 border-black rounded-md flex items-center justify-center hover:bg-retroGreen transition-all"
        >
          <FaDice />
        </button>
      </div>
    </div>
  );
};

export default ColorPicker;
