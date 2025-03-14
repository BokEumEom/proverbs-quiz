import { useState, useCallback, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProverbCard from "./proverb-card";
import { Proverb } from "@/constants/proverbs";

interface ProverbCarouselProps {
  proverbs: Proverb[];
  onComplete: (knownProverbs: number[], reviewProverbs: number[]) => void;
}

export default function ProverbCarousel({ proverbs, onComplete }: ProverbCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [knownProverbs, setKnownProverbs] = useState<number[]>([]);
  const [reviewProverbs, setReviewProverbs] = useState<number[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const handleKnown = () => {
    const currentProverbId = proverbs[currentIndex].id;
    setKnownProverbs(prev => [...prev, currentProverbId]);
    scrollNext();
  };

  const handleReview = () => {
    const currentProverbId = proverbs[currentIndex].id;
    setReviewProverbs(prev => [...prev, currentProverbId]);
    scrollNext();
  };

  // 현재 슬라이드 인덱스 업데이트
  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      setCurrentIndex(emblaApi.selectedScrollSnap());
      
      // 마지막 슬라이드에 도달했는지 확인
      if (emblaApi.selectedScrollSnap() === proverbs.length - 1) {
        // 마지막 카드에서 다음으로 넘어가면 완료 처리
        const handleComplete = () => {
          if (emblaApi.selectedScrollSnap() === proverbs.length - 1 && !isCompleted) {
            setIsCompleted(true);
            onComplete(knownProverbs, reviewProverbs);
          }
        };
        
        emblaApi.on('settle', handleComplete);
        return () => {
          emblaApi.off('settle', handleComplete);
        };
      }
    };

    emblaApi.on('select', onSelect);
    onSelect(); // 초기 인덱스 설정

    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi, proverbs.length, knownProverbs, reviewProverbs, onComplete, isCompleted]);

  return (
    <div className="relative">
      <div className="mb-4 flex justify-between items-center">
        <span className="text-sm text-gray-500">
          {currentIndex + 1} / {proverbs.length}
        </span>
        <div className="h-2 flex-1 mx-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-500 transition-all duration-300"
            style={{ width: `${((currentIndex) / proverbs.length) * 100}%` }}
          ></div>
        </div>
        <span className="text-sm text-gray-500">
          {Math.round(((currentIndex) / proverbs.length) * 100)}%
        </span>
      </div>

      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {proverbs.map((proverb, index) => (
            <div key={proverb.id} className="flex-[0_0_100%] min-w-0 pl-4 pr-4">
              <ProverbCard 
                proverb={proverb} 
                onKnown={handleKnown} 
                onReview={handleReview} 
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between mt-6">
        <button 
          onClick={scrollPrev}
          disabled={currentIndex === 0}
          className={`p-2 rounded-full ${
            currentIndex === 0 
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
              : 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600'
          }`}
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button 
          onClick={scrollNext}
          disabled={currentIndex === proverbs.length - 1}
          className={`p-2 rounded-full ${
            currentIndex === proverbs.length - 1
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
              : 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600'
          }`}
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      <p className="text-center text-sm text-gray-500 mt-4">
        좌우로 스와이프하여 카드를 넘길 수 있습니다
      </p>
    </div>
  );
} 