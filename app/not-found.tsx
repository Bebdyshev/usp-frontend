'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Page Not Found</h2>
        
        <p className="text-gray-600 mb-6">
          The page you are looking for doesn't exist or has been moved.
        </p>
        
        <div className="flex flex-col space-y-3">
          <Button 
            asChild
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            <Link href="/">
              Return to home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
} 