'use client';
import { useEffect } from 'react';
import { db } from '@/lib/firebase';
import { doc, updateDoc, increment, setDoc, getDoc } from 'firebase/firestore';

export default function VisitTracker() {
  useEffect(() => {
    const incrementVisit = async () => {
      // Check if session already visited to prevent refresh spamming
      const hasVisited = sessionStorage.getItem('hasVisited');
      
      if (!hasVisited) {
        const statsRef = doc(db, 'site-stats', 'general');
        
        try {
          // Try to update existing doc
          await updateDoc(statsRef, {
            totalVisits: increment(1)
          });
        } catch (error) {
          // If doc doesn't exist, create it
          await setDoc(statsRef, {
            totalVisits: 1
          });
        }
        
        // Mark session as visited
        sessionStorage.setItem('hasVisited', 'true');
      }
    };

    incrementVisit();
  }, []);

  return null; // This component renders nothing
}