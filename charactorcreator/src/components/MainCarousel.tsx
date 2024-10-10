"use client";

import { useAvatar } from "@/app/context/AvatarContext";
import Image from "next/image";

export default function AvatarCustomizer() {
  const { extractedEnums, avatarData } = useAvatar();
  return (
    <div>
      <div>
        <Image src={avatarData} alt="Display Avatar" height={100} width={100} />
      </div>
      <p>{extractedEnums.accessories[0]}</p>
    </div>
  );
}
