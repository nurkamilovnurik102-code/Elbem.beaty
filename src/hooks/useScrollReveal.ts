/** Reveals public page sections once, without a continuous scroll listener. */
import {useEffect} from 'react';

const REVEAL_TARGETS = [
  '.section-heading', '.service-card', '.master-card', '.product-card',
  '.gallery-row > *', '.feature-grid > *', '.quick-grid > *',
  '.review-card', '.contact-cards > *', '.academy-highlight > *',
  '.booking-step', '.detail-layout',
].join(', ');

export function useScrollReveal(page: string, admin: boolean, loading: boolean) {
  useEffect(() => {
    if (admin || loading || typeof IntersectionObserver === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const elements = document.querySelectorAll<HTMLElement>(REVEAL_TARGETS);
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('elbem-visible');
        observer.unobserve(entry.target);
      }
    }, {threshold: 0.08, rootMargin: '0px 0px -24px 0px'});

    elements.forEach((element, index) => {
      element.classList.add('elbem-reveal');
      element.style.setProperty('--elbem-delay', `${Math.min(index % 4, 3) * 60}ms`);
      observer.observe(element);
    });
    return () => observer.disconnect();
  }, [page, admin, loading]);
}
