import { useState, useEffect, useCallback, useRef } from 'react';

// Custom hook for virtualizing content based on viewport
export const useVirtualization = () => {
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        const newVisibleSections = new Set(visibleSections);
        
        entries.forEach((entry) => {
          const sectionId = entry.target.getAttribute('data-section');
          if (sectionId) {
            if (entry.isIntersecting) {
              newVisibleSections.add(sectionId);
            } else {
              newVisibleSections.delete(sectionId);
            }
          }
        });
        
        setVisibleSections(newVisibleSections);
      },
      {
        rootMargin: '100px', // Load content before it comes into view
        threshold: 0
      }
    );

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [visibleSections]);

  const observeSection = useCallback((element: Element | null) => {
    if (element && observerRef.current) {
      observerRef.current.observe(element);
    }
  }, []);

  return { visibleSections, observeSection };
};