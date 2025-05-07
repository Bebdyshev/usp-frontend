'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h2>
        
        <p className="text-gray-600 mb-6">
          {error?.message || 'An unexpected error occurred'}
        </p>
        
        <div className="flex flex-col space-y-3">
          <Button 
            onClick={reset}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            Try again
          </Button>
          
          <Button 
            onClick={() => router.push('/')}
            variant="outline"
            className="w-full border-gray-300"
          >
            Return to home
          </Button>
        </div>
      </div>
    </div>
  );
} 