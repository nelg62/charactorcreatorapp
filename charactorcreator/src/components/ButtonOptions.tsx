import { useEffect, useState } from "react";

interface ButtonOptionProps {
  attributeChoices: string[];
  setAttributeIndexes: () => void
  activeAttribute: 
}

const ButtonOptions = ({ attributeChoices, setAttributeIndexes, activeAttribute }: ButtonOptionProps) => {
  const [visibleStartIndex, setVisibleStartIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(3);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setVisibleCount(3);
      } else if (window.innerWidth < 1024) {
        setVisibleCount(5);
      } else {
        setVisibleCount(7);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleCarouselNavigation = (direction: "left" | "right") => {
    setVisibleStartIndex((prev) => {
      const totalChoices = attributeChoices.length;
      if (direction === "right") {
        return (prev + visibleCount) % totalChoices;
      } else {
        return (prev - visibleCount + totalChoices) % totalChoices;
      }
    });
  };

  const visibleChoices = attributeChoices.slice(
    visibleStartIndex,
    visibleStartIndex + visibleCount
  );

  if (visibleChoices.length < visibleCount) {
    visibleChoices.push(
      ...attributeChoices.slice(0, visibleCount - visibleChoices.length)
    );
  }

  return (
    <div className="attribute-buttons flex items-center">
      <button
        onClick={() => handleCarouselNavigation("left")}
        className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
      >
        &lt;
      </button>

      <div className="flex gap-2">
{visibleChoices.map((choice, index) => (
    <button key={index}
    onClick={() => 
        setAttributeIndexes((prev) => ({
            ...prev,
            [activeAttribute]
        }))
    }>

    </button>
))}
      </div>
    </div>
  );
};

export default ButtonOptions;
