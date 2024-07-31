"use client"; // Error components must be Client Components

import { ErrorWrapper } from "@/components/common/style";
import Button from "@/elements/buttons/Button";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <ErrorWrapper>
      <p className="text-5xl text-center">Something went wrong!</p>
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
