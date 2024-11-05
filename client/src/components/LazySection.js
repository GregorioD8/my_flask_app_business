import React, { useState, useEffect, useRef } from 'react';

function LazySection({ children, placeholder = "Loading...", rootMargin = '100px', minHeight = '100vh' }) {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true); // Load content when it becomes visible
            observer.disconnect(); // Stop observing once loaded
          }
        });
      },
      { rootMargin }
    );

    const currentRef = sectionRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [rootMargin]);

  return (
    <div ref={sectionRef} style={{ minHeight }}>
      {isVisible ? children : <div style={{ minHeight }}>{placeholder}</div>}
    </div>
  );
}

export default LazySection;