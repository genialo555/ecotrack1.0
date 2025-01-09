import { useInView } from 'react-intersection-observer';

interface ScrollAnimationOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

export const useScrollAnimation = (options: ScrollAnimationOptions = {}) => {
  const {
    threshold = 0.3,
    rootMargin = '-100px 0px',
    triggerOnce = false,
  } = options;

  const { ref, inView } = useInView({
    threshold,
    rootMargin,
    triggerOnce,
  });

  const getAnimationClass = (delay: number = 0) => `
    transition-all duration-[1000ms] ease-out
    ${inView 
      ? `opacity-100 transform translate-y-0 ${delay ? `delay-[${delay}ms]` : ''}`
      : 'opacity-80 transform translate-y-2'
    }
  `;

  return { ref, inView, getAnimationClass };
};
