
import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOfflineStatus } from '@/hooks/useOfflineStatus';

const OfflineIndicator = () => {
  const isOffline = useOfflineStatus();

  if (!isOffline) return null;

  return (
    <div className="fixed top-0 left-0 right-0 bg-red-600 text-white text-center py-3 z-50 flex items-center justify-center gap-3 safe-area-inset-top">
      <WifiOff className="h-5 w-5" />
      <span className="text-base font-medium">You're offline - but the app still works!</span>
    </div>
  );
};

export default OfflineIndicator;
