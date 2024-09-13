import MainCarousel from "@/components/MainCarousel";
import ResizableMenu from "@/components/ResizableMenu";
import { Progress } from "@/components/ui/progress";
import CreateCharacterForm from "@/components/CharacterCreatorForm";
import Image from "next/image";
import CreateAvatar from "@/components/CreateAvatar";
import AvatarCustomizer from "@/components/MainCarousel";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-24 gap-4">
      <AvatarCustomizer />
      {/* <MainCarousel />
      <Progress value={20} indicatorColor="bg-red-500" className="bg-white" />
      <ResizableMenu />
      <CreateCharacterForm />
      <CreateAvatar /> */}
    </main>
  );
}
