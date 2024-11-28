import Image from "next/image";

interface AvatarPreviewProps {
  avatarDataPreview: string;
}

export default function AvatarPreview({
  avatarDataPreview,
}: AvatarPreviewProps) {
  return (
    <div className=" w-full md:w-1/3 p-2 flex items-center justify-center md:border-r">
      <Image
        src={avatarDataPreview}
        alt="Display Avatar"
        height={100}
        width={100}
        className="rounded-full border border-gray-300"
      />
    </div>
  );
}
