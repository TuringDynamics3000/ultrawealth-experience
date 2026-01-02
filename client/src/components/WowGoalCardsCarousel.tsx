import { WowGoalCard as WowGoalCardType } from "@/data/wowCards.data";
import { WowGoalCard } from "./WowGoalCard";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface WowGoalCardsCarouselProps {
  cards: WowGoalCardType[];
}

export function WowGoalCardsCarousel({ cards }: WowGoalCardsCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const scrollLeft = scrollContainerRef.current.scrollLeft;
      const cardWidth = scrollContainerRef.current.offsetWidth; // Approximate
      const index = Math.round(scrollLeft / (cardWidth * 0.8)); // Adjust for card width + gap
      setActiveIndex(Math.min(Math.max(index, 0), cards.length - 1));
    }
  };

  const scrollToCard = (index: number) => {
    if (scrollContainerRef.current) {
      const cardWidth = 340 + 24; // Card width + gap (approximate for mobile)
      // For desktop, it's different, but this is a simple implementation
      // Better to use scrollIntoView on the card element if we had refs to them
      
      // Simple scroll calculation
      const container = scrollContainerRef.current;
      const scrollAmount = index * (container.offsetWidth < 768 ? container.offsetWidth - 32 : 400);
      
      container.scrollTo({
        left: scrollAmount,
        behavior: 'smooth'
      });
      setActiveIndex(index);
    }
  };

  return (
    <div className="w-full py-12 md:py-20 bg-[#F9F7F2]">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-8 md:mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#111827] tracking-tight font-serif">
            Life happens. <br className="md:hidden" />
            <span className="text-[#6F6A63]">We keep up.</span>
          </h2>
        </div>

        {/* Carousel Container */}
        <div 
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex overflow-x-auto gap-6 pb-8 -mx-4 px-4 md:mx-0 md:px-0 snap-x snap-mandatory scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {cards.map((card) => (
            <div 
              key={card.id} 
              className="min-w-[85vw] md:min-w-[400px] lg:min-w-[440px] snap-center first:pl-0 last:pr-4"
            >
              <WowGoalCard card={card} />
            </div>
          ))}
        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center gap-2 mt-4 md:mt-8">
          {cards.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollToCard(index)}
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-300",
                activeIndex === index 
                  ? "bg-[#111827] w-6" 
                  : "bg-[#D1D5DB] hover:bg-[#9CA3AF]"
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
