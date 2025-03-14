import { useState, useEffect } from 'react';
import { Proverb } from '@/constants/proverbs';

interface LearningState {
  knownProverbs: number[];
  reviewProverbs: number[];
  lastStudied: string | null;
}

export function useProverbLearning() {
  const [learningState, setLearningState] = useState<LearningState>({
    knownProverbs: [],
    reviewProverbs: [],
    lastStudied: null
  });

  // 로컬 스토리지에서 학습 상태 불러오기
  useEffect(() => {
    const savedState = localStorage.getItem('proverbLearningState');
    if (savedState) {
      try {
        setLearningState(JSON.parse(savedState));
      } catch (error) {
        console.error('Failed to parse learning state:', error);
      }
    }
  }, []);

  // 학습 상태 저장
  const saveLearningState = (state: Partial<LearningState>) => {
    const newState = { ...learningState, ...state, lastStudied: new Date().toISOString() };
    setLearningState(newState);
    localStorage.setItem('proverbLearningState', JSON.stringify(newState));
  };

  // 학습 완료 처리
  const completeSession = (knownIds: number[], reviewIds: number[]) => {
    saveLearningState({
      knownProverbs: [...new Set([...learningState.knownProverbs, ...knownIds])],
      reviewProverbs: [...new Set([...learningState.reviewProverbs, ...reviewIds])]
    });
  };

  // 학습할 속담 필터링 (아직 모르는 것 + 복습할 것 우선)
  const getStudyProverbs = (allProverbs: Proverb[], limit: number = 10) => {
    // 복습할 속담
    const reviewProverbs = allProverbs.filter(p => 
      learningState.reviewProverbs.includes(p.id) && 
      !learningState.knownProverbs.includes(p.id)
    );
    
    // 아직 학습하지 않은 속담
    const newProverbs = allProverbs.filter(p => 
      !learningState.knownProverbs.includes(p.id) && 
      !learningState.reviewProverbs.includes(p.id)
    );
    
    // 복습할 것 + 새로운 것 조합 (limit 개수만큼)
    const combined = [...reviewProverbs, ...newProverbs];
    return combined.slice(0, limit);
  };

  // 학습 통계
  const getStats = (allProverbs: Proverb[]) => {
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
      progress: Math.round((knownCount / totalCount) * 100)
    };
  };

  // 학습 상태 초기화
  const resetLearning = () => {
    setLearningState({
      knownProverbs: [],
      reviewProverbs: [],
      lastStudied: null
    });
    localStorage.removeItem('proverbLearningState');
  };

  return {
    learningState,
    completeSession,
    getStudyProverbs,
    getStats,
    resetLearning
  };
} 