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
        <div className="flex items-center justify-center px-4 py-3 rounded-md border-2 border-black bg-retroBlue font-pixel">
          <button
            onClick={() =>
              toggleState(
                activeAttribute as "accessories" | "facialHair" | "mask"
              )
            }
            className="px-4 py-2 text-xs uppercase bg-white text-black border-2 border-black rounded-md hover:bg-retroOrange transition-all"
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
