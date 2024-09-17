"use client";
import { openPeeps } from "@dicebear/collection";
import { createAvatar, schema } from "@dicebear/core";
import { JSONSchema7 } from "json-schema";
import React, {
  useContext,
  createContext,
  useMemo,
  useState,
  SetStateAction,
} from "react";

export function getOptionsBySchema(schema: JSONSchema7) {
  const result: Record<string, any> = {};

  for (var key in schema.properties) {
    if (false === schema.properties.hasOwnProperty(key)) {
      continue;
    }

    const property = schema.properties[key];

    if (typeof property === "object") {
      const option: Record<string, any> = {
        type: property.type,
      };

      if (option.type === "integer") {
        option.type = "number";
      }

      option.choices = [];

      if (property.enum) {
        option.choices.push(
          ...property.enum.filter((v) => typeof v === "string")
        );
      }

      if (
        typeof property.items === "object" &&
        "enum" in property.items &&
        property.items.enum
      ) {
        option.choices.push(
          ...property.items.enum.filter((v) => typeof v === "string")
        );
      }

      if (option.choices.length === 0) {
        delete option.choices;
      }

      if (property.description) {
        option.description = property.description;
      }

      result[key] = option;
    }
  }

  return result;
}

// Define your options
const options = {
  ...schema.properties,
  ...openPeeps.schema.properties,
};

interface AvatarContextType {
  avatarData: string;
  setSelectedAccessories: React.Dispatch<React.SetStateAction<string>>;
  avatarAccessoriesChoices: string[] | any;
  selectedAccessoryIndex: number;
  setSelectedAccessoryIndex: React.Dispatch<React.SetStateAction<string>>;
}

const avatarAccessoriesChoices = options.accessories.items?.enum || [];

const AvatarContext = createContext<AvatarContextType | null>(null);

export const AvatarProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedAccessories, setSelectedAccessories] = useState<string>(
    avatarAccessoriesChoices[0] || ""
  );

  const [selectedAccessoryIndex, setSelectedAccessoryIndex] = useState<number>(
    avatarAccessoriesChoices.indexOf(selectedAccessories)
  );

  const accessoriesProbability = selectedAccessories ? 100 : 0;

  const updateSelectedAccessory = (value: SetStateAction<string>) => {
    const newAccessory =
      typeof value === "function" ? value(selectedAccessories) : value;
    setSelectedAccessories(newAccessory);

    const newIndex = avatarAccessoriesChoices.indexOf(newAccessory);
    setSelectedAccessoryIndex(newIndex);
  };

  const avatarData = useMemo(() => {
    return createAvatar(openPeeps, {
      size: 128,
      accessories: avatarAccessoriesChoices[selectedAccessoryIndex],
      accessoriesProbability,
    }).toDataUri();
  }, [
    accessoriesProbability,
    avatarAccessoriesChoices,
    selectedAccessoryIndex,
  ]);

  return (
    <AvatarContext.Provider
      value={{
        avatarData,
        avatarAccessoriesChoices,
        selectedAccessoryIndex,
        setSelectedAccessories: updateSelectedAccessory,
        setSelectedAccessoryIndex,
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
