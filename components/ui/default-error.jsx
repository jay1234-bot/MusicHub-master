'use client';

import Link from 'next/link';

export default function DefaultError() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">
            Something went wrong!
          </h1>
          <p className="text-muted-foreground">
            We're sorry, but there seems to be an issue. Please try again later.
          </p>
        </div>
        <div className="space-y-4">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}
