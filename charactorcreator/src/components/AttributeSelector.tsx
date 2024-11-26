interface AttributeSelectorProps {
  attributes: string[];
  activeAttribute: string;
  setActiveAttribute: (attribute: string) => void;
}

export default function AttributeSelector({
  attributes,
  activeAttribute,
  setActiveAttribute,
}: AttributeSelectorProps) {
  return (
    <div>
      <div></div>
    </div>
  );
}
