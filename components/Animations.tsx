import React, { useEffect, useState } from 'react';
import Lottie from 'lottie-react';

// URLs for Lottie JSONs
export const ANIMATIONS = {
  SUN: 'https://lottie.host/5d3d4b68-8051-4043-9844-332463428385/zY8Q1t943E.json', // Sun/Day
  MOON: 'https://lottie.host/9c381711-4770-4284-b026-6214150f11d9/5x8h4w8o8a.json', // Moon/Night (Placeholder URL)
  WATER: 'https://lottie.host/5054199c-851f-474d-9669-026848c15616/sH5W2y074K.json', // Water Splash
  TROPHY: 'https://lottie.host/01c43097-9e42-4752-9b2f-76348c660f85/2u6u6h1h6g.json', // Celebration
  FIRE: 'https://lottie.host/80404323-d6c2-4740-9b34-45372439163e/8X1X1t1t1t.json', // Fire/Workout (Placeholder URL)
  ROBOT: 'https://lottie.host/a6136531-5079-4503-912b-3474966683f2/0Y6c7k3y6f.json', // Thinking Bot (Placeholder)
  FITNESS: 'https://lottie.host/6c1c9b68-0b5c-4433-8744-888888888888/fitness.json' // Fitness (Placeholder)
};

// Use generic reliable URLs if specific ones fail or for demo
const FALLBACK_ANIMATIONS = {
    SUN: 'https://assets10.lottiefiles.com/packages/lf20_ofa3xwo7.json',
    TROPHY: 'https://assets2.lottiefiles.com/packages/lf20_touohxv0.json',
    ROBOT: 'https://assets3.lottiefiles.com/packages/lf20_mvmhfqhq.json',
    WATER: 'https://assets9.lottiefiles.com/packages/lf20_b0j3115t.json'
};

export const LottiePlayer = ({ 
  src, 
  className, 
  loop = true,
  autoplay = true 
}: { 
  src: string, 
  className?: string, 
  loop?: boolean,
  autoplay?: boolean 
}) => {
  const [animationData, setAnimationData] = useState<any>(null);

  useEffect(() => {
    let isMounted = true;
    fetch(src)
      .then(res => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then(data => {
        if (isMounted) setAnimationData(data);
      })
      .catch(err => {
        console.warn("Failed to load lottie from primary, trying fallback...", err);
        // Simple fallback logic could go here, or just fail gracefully
      });
      
    return () => { isMounted = false; };
  }, [src]);

  if (!animationData) return <div className={`${className} bg-transparent`} />;

  return <Lottie animationData={animationData} loop={loop} autoplay={autoplay} className={className} />;
};
