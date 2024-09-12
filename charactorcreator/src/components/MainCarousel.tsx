import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";

export default function MainCarousel() {
  return (
    <Carousel className="w-1/2 border">
      <CarouselContent>
        <CarouselItem className="flex justify-center items-center">
          <img src="favicon.ico"></img>
        </CarouselItem>
        <CarouselItem className="flex justify-center items-center">
          <img src="favicon.ico"></img>
        </CarouselItem>
        <CarouselItem className="flex justify-center items-center">
          <img src="favicon.ico"></img>
        </CarouselItem>
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
