interface ColorPickerProps {
  label: string;
  color: string;
  setColor: (color: string) => void;
}

const ColorPicker = ({ label, color, setColor }: ColorPickerProps) => {
  return (
    <div className="color-picker">
      <label htmlFor={label.toLowerCase().replace(" ", "-")}>{label}: </label>
      <input
        type="color"
        id={label.toLowerCase().replace(" ", "-")}
        value={`#${color}`}
        onChange={(e) => setColor(e.target.value.replace("#", ""))}
      />
    </div>
  );
};

export default ColorPicker;
