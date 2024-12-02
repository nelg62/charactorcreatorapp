import Image from "next/image";

interface AvatarPreviewProps {
  avatarDataPreview: string;
}

export default function AvatarPreview({
  avatarDataPreview,
}: AvatarPreviewProps) {
  return (
    <div className="md:h-1/2 w-full md:w-1/3 p-4 flex items-center justify-center md:border-r">
      <Image
        src={avatarDataPreview}
        alt="Display Avatar"
        height={500}
        width={500}
        className="max-h-28 max-w-28 md:max-h-48 md:max-w-48 rounded-full border border-gray-300"
      />
    </div>
  );
}
