"use client";
import { openPeeps } from "@dicebear/collection";
import { createAvatar, schema } from "@dicebear/core";
import { useMemo } from "react";

// type AvatarOptions = {
//   accessories: string[];
// };

export default function AvatarCustomizer() {
  const options = {
    ...schema.properties,
    ...openPeeps.schema.properties,
  };

  const accessories: string[] = options.accessories.default;

  console.log("🚀 ~ AvatarCustomizer ~ options:", accessories);

  const avatarData = useMemo(() => {
    return createAvatar(openPeeps, {
      size: 128,
      accessories: 
    }).toDataUri();
  }, []);

  return (
    <div className="avatar-customizer">
      <div className="avatar-display">
        <img src={avatarData} alt="Current Avatar" />
      </div>
    </div>
  );
}
