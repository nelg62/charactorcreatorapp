"use client";

import { openPeeps } from "@dicebear/collection";
import { createAvatar, schema, StyleOptions } from "@dicebear/core";
import React, { createContext, useContext, useMemo, useState } from "react";
import { JSONSchema7Definition } from "json-schema";

interface AvatarContextType {
  extractedEnums: Record<string, string[]>;
  avatarData: string;
  accessoriesEnabled: boolean;
}

const AvatarContext = createContext<AvatarContextType | null>(null);
const options = {
  ...schema.properties,
  ...openPeeps.schema.properties,
};

function isJSONSchemaObject(
  schema: JSONSchema7Definition
): schema is { items: { enum?: string[] } } {
  return typeof schema === "object" && schema !== null;
}

const extractEnumsFromOptions = (
  options: Record<string, JSONSchema7Definition>
) => {
  const result: Record<string, string[]> = {};

  Object.entries(options).forEach(([key, schema]) => {
    if (isJSONSchemaObject(schema) && schema.items) {
      const enumValues = schema.items.enum || [];
      result[key] = enumValues;
    }
  });

  return result;
};

const extractedEnums = extractEnumsFromOptions(options);
console.log("Extracted Enums:", extractedEnums);

export const AvatarProvider = ({ children }: { children: React.ReactNode }) => {
  const [accessoriesEnabled, setAccessoriesEnabled] = useState(true);

  const getAvatarOptions = (
    extractedEnums: Record<string, string[]>
  ): StyleOptions<openPeeps.Options> => {
    const firstAccessories = extractedEnums.accessories[1];

    return {
      size: 128,
      accessories: [firstAccessories] as openPeeps.Options["accessories"],
      accessoriesProbability: accessoriesEnabled ? 100 : 0,
    };
  };

  const avatarData = useMemo(() => {
    const avatarOptions = getAvatarOptions(extractedEnums);

    return createAvatar(openPeeps, avatarOptions).toDataUri();
  }, []);
  return (
    <AvatarContext.Provider
      value={{ extractedEnums, avatarData, accessoriesEnabled }}
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
