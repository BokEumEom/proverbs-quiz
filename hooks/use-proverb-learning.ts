import { useState, useEffect, useCallback } from 'react';
import { Proverb } from '@/constants/proverbs';

interface LearningState {
  knownProverbs: number[];
  reviewProverbs: number[];
  lastStudied: string | null;
  currentSessionIds: number[]; // 현재 세션에서 학습한 속담 ID
  lastBatch: number; // 마지막으로 학습한 배치 번호
}

export function useProverbLearning() {
  const [learningState, setLearningState] = useState<LearningState>({
    knownProverbs: [],
    reviewProverbs: [],
    lastStudied: null,
    currentSessionIds: [],
    lastBatch: 0
  });
  
  // 초기 로딩 플래그
  const [isInitialized, setIsInitialized] = useState(false);

  // 로컬 스토리지에서 학습 상태 불러오기 - 한 번만 실행
  useEffect(() => {
    if (!isInitialized) {
      const savedState = localStorage.getItem('proverbLearningState');
      if (savedState) {
        try {
          setLearningState(JSON.parse(savedState));
        } catch (error) {
          console.error('Failed to parse learning state:', error);
        }
      }
      setIsInitialized(true);
    }
  }, [isInitialized]);

  // 학습 상태 저장 - useCallback으로 메모이제이션
  const saveLearningState = useCallback((state: Partial<LearningState>) => {
    setLearningState(prevState => {
      const newState = { 
        ...prevState, 
        ...state, 
        lastStudied: new Date().toISOString() 
      };
      localStorage.setItem('proverbLearningState', JSON.stringify(newState));
      return newState;
    });
  }, []);

  // 개별 속담 상태 업데이트 - useCallback으로 메모이제이션
  const updateProverbStatus = useCallback((proverbId: number, isKnown: boolean) => {
    setLearningState(prevState => {
      const newKnownProverbs = isKnown 
        ? [...new Set([...prevState.knownProverbs, proverbId])]
        : prevState.knownProverbs;
      
      const newReviewProverbs = !isKnown
        ? [...new Set([...prevState.reviewProverbs, proverbId])]
        : prevState.reviewProverbs.filter(id => id !== proverbId);
      
      const newCurrentSessionIds = [...new Set([...prevState.currentSessionIds, proverbId])];
      
      const newState = {
        ...prevState,
        knownProverbs: newKnownProverbs,
        reviewProverbs: newReviewProverbs,
        currentSessionIds: newCurrentSessionIds,
        lastStudied: new Date().toISOString()
      };
      
      localStorage.setItem('proverbLearningState', JSON.stringify(newState));
      return newState;
    });
  }, []);

  // 학습 완료 처리 - useCallback으로 메모이제이션
  const completeSession = useCallback((knownIds: number[], reviewIds: number[]) => {
    setLearningState(prevState => {
      const newKnownProverbs = [...new Set([...prevState.knownProverbs, ...knownIds])];
      
      // 이미 알고 있는 속담은 복습 목록에서 제거
      const filteredReviewIds = reviewIds.filter(id => !newKnownProverbs.includes(id));
      const newReviewProverbs = [...new Set([...prevState.reviewProverbs, ...filteredReviewIds])];
      
      const newState = {
        ...prevState,
        knownProverbs: newKnownProverbs,
        reviewProverbs: newReviewProverbs,
        lastBatch: prevState.lastBatch + 1,
        currentSessionIds: [], // 세션 완료 시 현재 세션 ID 초기화
        lastStudied: new Date().toISOString()
      };
      
      localStorage.setItem('proverbLearningState', JSON.stringify(newState));
      return newState;
    });
  }, []);

  // 학습할 속담 필터링 - useCallback으로 메모이제이션
  const getStudyProverbs = useCallback((allProverbs: Proverb[], limit: number = 10, mode: 'next' | 'review' | 'restart' = 'next') => {
    // 모드에 따라 다른 속담 세트 반환
    if (mode === 'restart') {
      // 처음부터 다시 시작 - 첫 10개 반환
      return allProverbs.slice(0, limit);
    }
    
    if (mode === 'review') {
      // 복습 모드 - 복습이 필요한 속담만 반환
      const reviewProverbs = allProverbs.filter(p => 
        learningState.reviewProverbs.includes(p.id) && 
        !learningState.knownProverbs.includes(p.id)
      );
      return reviewProverbs.length > 0 ? reviewProverbs.slice(0, limit) : allProverbs.slice(0, limit);
    }
    
    // 다음 세트 모드 (기본)
    // 1. 현재 세션에서 학습하지 않은 속담 필터링
    const notInCurrentSession = allProverbs.filter(p => 
      !learningState.currentSessionIds.includes(p.id)
    );
    
    // 2. 복습이 필요한 속담 (현재 세션에서 학습하지 않은 것 중)
    const reviewProverbs = notInCurrentSession.filter(p => 
      learningState.reviewProverbs.includes(p.id) && 
      !learningState.knownProverbs.includes(p.id)
    );
    
    // 3. 아직 학습하지 않은 속담
    const newProverbs = notInCurrentSession.filter(p => 
      !learningState.knownProverbs.includes(p.id) && 
      !learningState.reviewProverbs.includes(p.id)
    );
    
    // 4. 이미 알고 있는 속담 (가장 낮은 우선순위)
    const knownProverbs = notInCurrentSession.filter(p => 
      learningState.knownProverbs.includes(p.id)
    );
    
    // 우선순위에 따라 조합
    const combined = [...reviewProverbs, ...newProverbs, ...knownProverbs];
    
    // 충분한 속담이 없으면 처음부터 다시 시작
    if (combined.length < limit) {
      return allProverbs.slice(0, limit);
    }
    
    return combined.slice(0, limit);
  }, [learningState]);

  // 학습 통계 - useCallback으로 메모이제이션
  const getStats = useCallback((allProverbs: Proverb[]) => {
    const totalCount = allProverbs.length;
    const knownCount = learningState.knownProverbs.length;
    const reviewCount = learningState.reviewProverbs.filter(
      id => !learningState.knownProverbs.includes(id)
    ).length;
    const newCount = totalCount - knownCount - reviewCount;
    
    return {
      totalCount,
      knownCount,
      reviewCount,
      newCount,
      progress: Math.round((knownCount / totalCount) * 100),
      lastBatch: learningState.lastBatch
    };
  }, [learningState]);

  // 학습 상태 초기화 - useCallback으로 메모이제이션
  const resetLearning = useCallback(() => {
    const initialState = {
      knownProverbs: [],
      reviewProverbs: [],
      lastStudied: null,
      currentSessionIds: [],
      lastBatch: 0
    };
    setLearningState(initialState);
    localStorage.removeItem('proverbLearningState');
  }, []);

  return {
    learningState,
    updateProverbStatus,
    completeSession,
    getStudyProverbs,
    getStats,
    resetLearning
  };
} 