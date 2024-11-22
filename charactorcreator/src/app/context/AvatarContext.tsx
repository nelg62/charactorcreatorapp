"use client";
import { openPeeps } from "@dicebear/collection";
import { schema as dicebearSchema, StyleOptions } from "@dicebear/core";
import { createContext, useContext, useMemo, useState } from "react";
import { JSONSchema7Definition } from "json-schema";

export interface OpenPeepsOptions
  extends Omit<
      (typeof dicebearSchema)["properties"],
      keyof StyleOptions<openPeeps.Options>
    >,
    StyleOptions<openPeeps.Options> {}

type CombinedOptions = (typeof dicebearSchema)["properties"] & OpenPeepsOptions;

const getCombinedOptions = (): CombinedOptions => ({
  ...dicebearSchema.properties,
  ...openPeeps.schema.properties,
});

function isJSONSchemaObject(
  schema: JSONSchema7Definition
): schema is { items: { enum?: string[] } } {
  return typeof schema === "object" && schema !== null;
}

// Extract enums from combined options
const extractEnumsFromOptions = (
  options: CombinedOptions
): Record<string, string[]> => {
  return Object.entries(options).reduce<Record<string, string[]>>(
    (result, [key, schema]) => {
      if (isJSONSchemaObject(schema) && schema.items?.enum) {
        result[key] = schema.items.enum;
      }
      return result;
    },
    {}
  );
};

interface AvatarContextType {
  combinedOptions: CombinedOptions;
  extractedEnums: Record<string, string[]>;
  toggleState: (key: "accessories" | "facialHair" | "mask") => void;
  isEnabled: Record<"accessories" | "facialHair" | "mask", boolean>;
  clothingColor: string;
  headContrastColor: string;
  backgroundColor: string;
  skinColor: string;
  setClothingColor: (color: string) => void;
  setHeadContrastColor: (color: string) => void;
  setBackgroundColor: (color: string) => void;
  setSkinColor: (color: string) => void;
  randomizeColors: () => void;
}

// Context initialization
const AvatarContext = createContext<AvatarContextType | null>(null);

export const AvatarProvider = ({ children }: { children: React.ReactNode }) => {
  const [clothingColor, setClothingColor] = useState<string>("8fa7df");
  const [headContrastColor, setHeadContrastColor] = useState<string>("2c1b18");
  const [backgroundColor, setBackgroundColor] = useState<string>("b6e3f4");
  const [skinColor, setSkinColor] = useState<string>("edb98a");

  const [state, setState] = useState({
    accessories: true,
    facialHair: true,
    mask: false,
  });

  const toggleState = (key: keyof typeof state) =>
    setState((prev) => ({ ...prev, [key]: !prev[key] }));

  const combinedOptions = useMemo(() => getCombinedOptions(), []);
  const extractedEnums = useMemo(
    () => extractEnumsFromOptions(combinedOptions),
    [combinedOptions]
  );

  const getRandomColor = () =>
    Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, "0");

  const randomizeColors = () => {
    setClothingColor(getRandomColor());
    setHeadContrastColor(getRandomColor());
    setBackgroundColor(getRandomColor());
    setSkinColor(getRandomColor());
  };

  return (
    <AvatarContext.Provider
      value={{
        combinedOptions,
        extractedEnums,
        toggleState,
        isEnabled: state,
        clothingColor,
        headContrastColor,
        backgroundColor,
        skinColor,
        setClothingColor,
        setHeadContrastColor,
        setBackgroundColor,
        setSkinColor,
        randomizeColors,
      }}
    >
      {children}
    </AvatarContext.Provider>
  );
};

export const useAvatar = () => {
  const context = useContext(AvatarContext);
  if (context === null) {
    throw new Error("useAvatar must be used within an AvatarProvider");
  }
  return context;
};
