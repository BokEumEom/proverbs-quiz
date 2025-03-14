import { useState, useEffect } from 'react';
import { Proverb } from '@/constants/proverbs';

export function useSavedProverbs() {
  const [savedProverbs, setSavedProverbs] = useState<Proverb[]>([]);
  
  // 로컬 스토리지에서 저장된 속담 불러오기
  useEffect(() => {
    const saved = localStorage.getItem('savedProverbs');
    if (saved) {
      try {
        setSavedProverbs(JSON.parse(saved));
      } catch (error) {
        console.error('Failed to parse saved proverbs:', error);
        localStorage.removeItem('savedProverbs');
      }
    }
  }, []);
  
  // 속담 저장하기
  const saveProverb = (proverb: Proverb) => {
    const isAlreadySaved = savedProverbs.some(p => p.id === proverb.id);
    
    if (!isAlreadySaved) {
      const newSavedProverbs = [...savedProverbs, proverb];
      setSavedProverbs(newSavedProverbs);
      localStorage.setItem('savedProverbs', JSON.stringify(newSavedProverbs));
    }
  };
  
  // 저장된 속담 제거하기
  const removeProverb = (proverbId: number) => {
    const newSavedProverbs = savedProverbs.filter(p => p.id !== proverbId);
    setSavedProverbs(newSavedProverbs);
    localStorage.setItem('savedProverbs', JSON.stringify(newSavedProverbs));
  };
  
  // 속담이 저장되었는지 확인
  const isProverbSaved = (proverbId: number) => {
    return savedProverbs.some(p => p.id === proverbId);
  };
  
  return {
    savedProverbs,
    saveProverb,
    removeProverb,
    isProverbSaved,
  };
} 