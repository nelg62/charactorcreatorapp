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

export type CombinedOptions = (typeof dicebearSchema)["properties"] &
  OpenPeepsOptions;

export const getCombinedOptions = (): CombinedOptions => {
  return {
    ...dicebearSchema.properties,
    ...openPeeps.schema.properties,
  } as CombinedOptions;
};

// const combinedOptions = getCombinedOptions();

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
  accessoriesEnabled: boolean;
  toggleAccessories: () => void;
}

const AvatarContext = createContext<AvatarContextType | null>(null);

export const AvatarProvider = ({ children }: { children: React.ReactNode }) => {
  const [accessoriesEnabled, setAccessoriesEnabled] = useState(true);

  const combinedOptions = useMemo(() => getCombinedOptions(), []);
  const extractedEnums = useMemo(
    () => extractEnumsFromOptions(combinedOptions),
    [combinedOptions]
  );

  const toggleAccessories = () => setAccessoriesEnabled((prev) => !prev);

  return (
    <AvatarContext.Provider
      value={{
        combinedOptions,
        extractedEnums,
        accessoriesEnabled,
        toggleAccessories,
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
