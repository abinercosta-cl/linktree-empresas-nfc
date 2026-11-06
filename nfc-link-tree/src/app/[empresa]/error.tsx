"use client"; // Error boundaries precisam ser Client Components

import ErrorState from "@/components/ErrorState";

export default function Error({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  return <ErrorState digest={error.digest} retry={retry} />;
}
