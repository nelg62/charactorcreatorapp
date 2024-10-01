import { useAvatar } from "../context/AvatarContext";

function AvatarDisplay() {
  const { avatarData } = useAvatar(); // Get avatar data from the context

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
