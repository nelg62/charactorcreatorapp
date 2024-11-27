import { useAvatar } from "@/app/context/AvatarContext";

interface ToggleButtonProps {
  activeAttribute: string;
  isEnabled: Record<"accessories" | "facialHair" | "mask", boolean>;
}

export default function ToggleButton({
  activeAttribute,
  isEnabled,
}: ToggleButtonProps) {
  const { toggleState } = useAvatar();
  return (
    <div>
      {["accessories", "facialHair", "mask"].includes(activeAttribute) && (
        <div className="px-4 py-2 text-sm font-medium bg-blue-500 flex items-center justify-center rounded text-white">
          <button
            onClick={() =>
              toggleState(
                activeAttribute as "accessories" | "facialHair" | "mask"
              )
            }
            className="btn toggle-btn"
          >
            {isEnabled[activeAttribute as keyof typeof isEnabled]
              ? `Disable ${activeAttribute}`
              : `Enable ${activeAttribute}`}
          </button>
        </div>
      )}
    </div>
  );
}
