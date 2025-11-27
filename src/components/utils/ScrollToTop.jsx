import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    // Instantly jump to top
    window.scrollTo(0, 0);
  }, [pathname, search]);

  return null;
}