import { useState, useEffect } from 'react';
import { Proverb } from '@/constants/proverbs';

const MAX_RECENT_PROVERBS = 5;

export function useRecentProverbs() {
  const [recentProverbs, setRecentProverbs] = useState<Proverb[]>([]);
  
  // 로컬 스토리지에서 최근 학습 속담 불러오기
  useEffect(() => {
    const recent = localStorage.getItem('recentProverbs');
    if (recent) {
      try {
        setRecentProverbs(JSON.parse(recent));
      } catch (error) {
        console.error('Failed to parse recent proverbs:', error);
        localStorage.removeItem('recentProverbs');
      }
    }
  }, []);
  
  // 최근 학습 속담 추가
  const addRecentProverb = (proverb: Proverb) => {
    // 이미 있는 경우 제거
    const filtered = recentProverbs.filter(p => p.id !== proverb.id);
    
    // 최근 속담 목록 앞에 추가
    const newRecentProverbs = [proverb, ...filtered].slice(0, MAX_RECENT_PROVERBS);
    
    setRecentProverbs(newRecentProverbs);
    localStorage.setItem('recentProverbs', JSON.stringify(newRecentProverbs));
  };
  
  return {
    recentProverbs,
    addRecentProverb,
  };
} 