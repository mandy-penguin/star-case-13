
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Download, X } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const InstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);

  useEffect(() => {
    const handler = (e: BeforeInstallPromptEvent) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler as EventListener);

    // For iOS Safari, show install prompt if not installed
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isInStandaloneMode = ('standalone' in window.navigator) && (window.navigator as any).standalone;
    
    if (isIOS && !isInStandaloneMode) {
      // Show iOS install instructions after a delay
      setTimeout(() => setShowInstallPrompt(true), 3000);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handler as EventListener);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
        setShowInstallPrompt(false);
      }
    }
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
  };

  if (!showInstallPrompt) return null;

  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

  return (
    <div className="fixed bottom-6 left-4 right-4 bg-white border border-gray-200 rounded-2xl p-6 shadow-lg z-50 max-w-sm mx-auto">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3">
          <div className="bg-gray-100 p-2 rounded-xl">
            <Download className="h-6 w-6 text-gray-700" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-black mb-1">Install App</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              {isIOS 
                ? "Tap the Share button below and select 'Add to Home Screen'"
                : "Install this app on your device for the best experience"
              }
            </p>
          </div>
        </div>
        <button
          onClick={handleDismiss}
          className="text-gray-400 hover:text-gray-600 p-1"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      
      {!isIOS && deferredPrompt && (
        <Button
          onClick={handleInstallClick}
          className="w-full bg-black hover:bg-gray-800 text-white font-medium py-3 rounded-xl transition-all duration-200"
        >
          Install Now
        </Button>
      )}
    </div>
  );
};

export default InstallPrompt;
