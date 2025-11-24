import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass, Frown } from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader'; // Import your header

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <PageHeader title="Page Not Found" />
      <div className="max-w-md mx-auto pt-40 px-5 text-center">
        <Frown
          size={64}
          className="mx-auto text-gray-400 dark:text-gray-600 mb-4"
        />
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          404 - Not Found
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Sorry, the page you're looking for doesn't exist.
        </p>
        <button
          onClick={() => navigate('/')}
          className="flex items-center justify-center gap-2 py-3 px-6 rounded-full bg-blue-600 text-white font-semibold text-base hover:bg-blue-700 shadow-lg dark:bg-blue-500 dark:hover:bg-blue-600 transition-all mx-auto"
        >
          <Compass size={18} />
          Go to Homepage
        </button>
      </div>
    </div>
  );
}