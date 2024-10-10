"use client";

import { useAvatar } from "@/app/context/AvatarContext";

export default function AvatarCustomizer() {
  const { extractedEnums } = useAvatar();
  return (
    <div>
      <p>{extractedEnums.accessories[0]}</p>
    </div>
  );
}
