"use client";
import Link from "next/link";
import { ErrorWrapper } from "@/components/common/style";

export default function NotFound() {
  return (
    <ErrorWrapper>
      <p className="text-5xl text-center">Not Found</p>
      <p className="text-2xl text-center">Could not find requested resource</p>
      <Link href="/" className="underline">
        Return Home
      </Link>
    </ErrorWrapper>
  );
}
