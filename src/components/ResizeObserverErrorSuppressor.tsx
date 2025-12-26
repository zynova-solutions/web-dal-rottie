'use client';

import { useEffect } from 'react';
import { suppressResizeObserverErrors } from '@/utils/resizeObserverFix';

export default function ResizeObserverErrorSuppressor() {
  useEffect(() => {
    suppressResizeObserverErrors();
  }, []);

  return null; // This component doesn't render anything
}
