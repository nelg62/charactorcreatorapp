interface AttributeSelectorProps {
  extractedEnums: Record<string, string[]>;
  activeAttribute: string;
  setActiveAttribute: (attribute: string) => void;
}

const AttributeSelector: React.FC<AttributeSelectorProps> = ({
  extractedEnums,
  activeAttribute,
  setActiveAttribute,
}) => {
  return (
    <div className="grid grid-cols-3 gap-2">
      {Object.keys(extractedEnums).map((attribute) => (
        <button
          key={attribute}
          onClick={() => setActiveAttribute(attribute)}
          className={`py-2 px-4 text-sm font-medium rounded ${
            activeAttribute === attribute
              ? "bg-blue-600 text-white truncate"
              : "bg-gray-200 text-gray-900 hover:bg-gray-300 truncate"
          }`}
        >
          {attribute}
        </button>
      ))}
    </div>
  );
};

export default AttributeSelector;
