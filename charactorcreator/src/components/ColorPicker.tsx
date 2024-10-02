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
    <div className="color-picker">
      <label htmlFor={label.toLowerCase().replace(" ", "-")}>{label}: </label>
      <input
        type="color"
        id={label.toLowerCase().replace(" ", "-")}
        value={`#${color}`}
        onChange={(e) => setColor(e.target.value.replace("#", ""))}
      />
      {/* Randmize button for color picker */}
      <button onClick={randomizeColor} className="btn randomize-btn">
        Randomize {label}
      </button>
    </div>
  );
};

export default ColorPicker;
