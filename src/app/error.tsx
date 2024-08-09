'use client'; // Error components must be Client Components

import { ErrorWrapper } from '@/components/common/style';
import Button from '@/elements/buttons/Button';
import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <ErrorWrapper>
      <p className="text-center text-5xl">Something went wrong!</p>
      <Button
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
      >
        Try again
      </Button>
    </ErrorWrapper>
  );
}
