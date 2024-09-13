"use client";
import React from "react";
import { useAvatar } from "../app/context/AvatarContext";

function AvatarDisplay() {
  const { avatarData } = useAvatar();

  return (
    <div>
      {avatarData ? (
        <img src={avatarData} alt="Generated Avatar" />
      ) : (
        "No avatar yet"
      )}
    </div>
  );
}

export default AvatarDisplay;
