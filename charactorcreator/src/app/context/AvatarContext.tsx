"use client";

import { openPeeps } from "@dicebear/collection";
import { schema } from "@dicebear/core";
import React, { createContext, useContext } from "react";
import { JSONSchema7Definition } from "json-schema";

interface AvatarContextType {
  extractedEnums: Record<string, string[]>;
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
  return (
    <AvatarContext.Provider value={{ extractedEnums }}>
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
