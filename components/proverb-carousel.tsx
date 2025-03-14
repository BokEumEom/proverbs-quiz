import { useState, useCallback, useEffect, memo } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProverbCard from "./proverb-card";
import { Proverb } from "@/constants/proverbs";

interface ProverbCarouselProps {
  proverbs: Proverb[];
  onComplete: (knownProverbs: number[], reviewProverbs: number[]) => void;
  onUpdateStatus: (proverbId: number, isKnown: boolean) => void;
}

// memo로 컴포넌트 메모이제이션
const ProverbCarousel = memo(({ 
  proverbs, 
  onComplete, 
  onUpdateStatus 
}: ProverbCarouselProps) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: false,
    draggable: true,
    skipSnaps: false
  });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [knownProverbs, setKnownProverbs] = useState<number[]>([]);
  const [reviewProverbs, setReviewProverbs] = useState<number[]>([]);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);
  const [isSessionCompleted, setIsSessionCompleted] = useState(false);

  const scrollPrev = useCallback(() => {
    if (emblaApi && canScrollPrev) emblaApi.scrollPrev();
  }, [emblaApi, canScrollPrev]);

  const scrollNext = useCallback(() => {
    if (emblaApi && canScrollNext) emblaApi.scrollNext();
  }, [emblaApi, canScrollNext]);

  const handleKnown = useCallback(() => {
    if (isSessionCompleted) return;
    
    const currentProverbId = proverbs[currentIndex].id;
    setKnownProverbs(prev => {
      const newKnownProverbs = [...prev, currentProverbId];
      // 복습 목록에서 제거
      setReviewProverbs(prev => prev.filter(id => id !== currentProverbId));
      return newKnownProverbs;
    });
    
    // 즉시 학습 상태 업데이트
    onUpdateStatus(currentProverbId, true);
    
    // 마지막 카드가 아니면 다음으로 이동
    if (currentIndex < proverbs.length - 1) {
      scrollNext();
    } else if (!isSessionCompleted) {
      // 마지막 카드면 세션 완료
      setIsSessionCompleted(true);
    }
  }, [currentIndex, proverbs, scrollNext, onUpdateStatus, isSessionCompleted]);

  const handleReview = useCallback(() => {
    if (isSessionCompleted) return;
    
    const currentProverbId = proverbs[currentIndex].id;
    setReviewProverbs(prev => {
      const newReviewProverbs = [...prev, currentProverbId];
      // 알고 있는 목록에서 제거
      setKnownProverbs(prev => prev.filter(id => id !== currentProverbId));
      return newReviewProverbs;
    });
    
    // 즉시 학습 상태 업데이트
    onUpdateStatus(currentProverbId, false);
    
    // 마지막 카드가 아니면 다음으로 이동
    if (currentIndex < proverbs.length - 1) {
      scrollNext();
    } else if (!isSessionCompleted) {
      // 마지막 카드면 세션 완료
      setIsSessionCompleted(true);
    }
  }, [currentIndex, proverbs, scrollNext, onUpdateStatus, isSessionCompleted]);

  // 세션 완료 시 onComplete 호출
  useEffect(() => {
    if (isSessionCompleted) {
      onComplete(knownProverbs, reviewProverbs);
    }
  }, [isSessionCompleted, knownProverbs, reviewProverbs, onComplete]);

  // 현재 슬라이드 인덱스 및 스크롤 가능 상태 업데이트
  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      setCurrentIndex(emblaApi.selectedScrollSnap());
      setCanScrollPrev(emblaApi.canScrollPrev());
      setCanScrollNext(emblaApi.canScrollNext());
    };

    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
    onSelect(); // 초기 상태 설정

    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi]);

  // 마지막 카드에서 다음으로 넘어가면 완료 처리
  useEffect(() => {
    if (!emblaApi || isSessionCompleted) return;

    const handleComplete = () => {
      if (currentIndex === proverbs.length - 1 && !canScrollNext) {
        setIsSessionCompleted(true);
      }
    };

    emblaApi.on('settle', handleComplete);
    
    return () => {
      emblaApi.off('settle', handleComplete);
    };
  }, [emblaApi, currentIndex, proverbs.length, canScrollNext, isSessionCompleted]);

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
          disabled={!canScrollPrev}
          className={`p-2 rounded-full ${
            !canScrollPrev
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
              : 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600'
          }`}
          aria-label="이전 카드"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button 
          onClick={scrollNext}
          disabled={!canScrollNext}
          className={`p-2 rounded-full ${
            !canScrollNext
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
              : 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600'
          }`}
          aria-label="다음 카드"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      <p className="text-center text-sm text-gray-500 mt-4">
        좌우로 스와이프하여 카드를 넘길 수 있습니다
      </p>
    </div>
  );
});

ProverbCarousel.displayName = 'ProverbCarousel';

export default ProverbCarousel; 