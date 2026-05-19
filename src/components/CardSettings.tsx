
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

interface CardSettingsProps {
  onBackToSettings: () => void;
}

export interface CardAnimationSettings {
  delay: number; // in seconds
  fadeOutDelay: number; // in seconds
  enableRedirect: boolean; // whether to redirect after fade
  redirectUrl: string; // custom redirect URL
  redirectDelay: number; // delay in seconds for redirect
}

const CardSettings = ({ onBackToSettings }: CardSettingsProps) => {
  const { toast } = useToast();
  const [settings, setSettings] = useState<CardAnimationSettings>({
    delay: 5,
    fadeOutDelay: 3,
    enableRedirect: false,
    redirectUrl: 'https://www.google.com/images?q=blank',
    redirectDelay: 5
  });

  // Load settings from localStorage on component mount
  useEffect(() => {
    const saved = localStorage.getItem('cardAnimationSettings');
    if (saved) {
      const savedSettings = JSON.parse(saved);
      setSettings(savedSettings);
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('cardAnimationSettings', JSON.stringify(settings));
    // Navigate back to settings after saving
    onBackToSettings();
  };

  return (
    <div className="min-h-screen bg-white flex flex-col p-6 pt-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-10 mt-8">
        <Button
          onClick={onBackToSettings}
          variant="outline"
          size="sm"
          className="rounded-xl shadow-sm bg-white border-gray-300 text-black hover:bg-gray-50 px-4 py-2"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <h1 className="text-2xl font-semibold text-black tracking-tight">Card Settings</h1>
        <div className="w-16"></div>
      </div>

      {/* Settings Content */}
      <div className="flex-1 flex flex-col items-center justify-center max-w-md mx-auto w-full space-y-8">
        
        {/* Appearance Delay Setting */}
        <div className="w-full bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
          <h3 className="text-xl font-semibold text-black mb-6">Appearance Delay</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-base">Delay time:</span>
              <span className="text-black font-medium text-lg">{settings.delay}s</span>
            </div>
            <Slider
              value={[settings.delay]}
              onValueChange={(value) => setSettings(prev => ({ ...prev, delay: value[0] }))}
              max={10}
              min={1}
              step={0.5}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-500">
              <span>1s</span>
              <span>10s</span>
            </div>
          </div>
        </div>

        {/* Fade Out Delay Setting */}
        <div className="w-full bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
          <h3 className="text-xl font-semibold text-black mb-6">Fade Out Delay</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-base">Time before fade out:</span>
              <span className="text-black font-medium text-lg">{settings.fadeOutDelay}s</span>
            </div>
            <Slider
              value={[settings.fadeOutDelay]}
              onValueChange={(value) => setSettings(prev => ({ ...prev, fadeOutDelay: value[0] }))}
              max={10}
              min={1}
              step={0.5}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-500">
              <span>1s</span>
              <span>10s</span>
            </div>
          </div>
        </div>

        {/* Redirect Settings */}
        <div className="w-full bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
          <h3 className="text-xl font-semibold text-black mb-6">Auto Redirect</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Checkbox
                id="enableRedirect"
                checked={settings.enableRedirect}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, enableRedirect: checked as boolean }))}
                className="h-5 w-5"
              />
              <label htmlFor="enableRedirect" className="text-gray-700 text-base cursor-pointer">
                Redirect to Google Images after fade
              </label>
            </div>
            
            {settings.enableRedirect && (
              <div className="space-y-4 pt-2">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm">Redirect delay:</span>
                    <span className="text-black font-medium">{settings.redirectDelay}s</span>
                  </div>
                  <Slider
                    value={[settings.redirectDelay]}
                    onValueChange={(value) => setSettings(prev => ({ ...prev, redirectDelay: value[0] }))}
                    max={10}
                    min={0.5}
                    step={0.5}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>0.5s</span>
                    <span>10s</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-gray-600 text-sm">Custom redirect URL:</label>
                  <Input
                    value={settings.redirectUrl}
                    onChange={(e) => setSettings(prev => ({ ...prev, redirectUrl: e.target.value }))}
                    placeholder="https://www.google.com/images?q=blank"
                    className="bg-white border-gray-300 text-black placeholder:text-gray-400 focus:border-gray-400 rounded-xl"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Save Button */}
        <Button
          onClick={handleSave}
          size="lg"
          className="bg-black hover:bg-gray-800 text-white px-10 py-4 rounded-xl text-lg font-medium transition-all duration-200 shadow-sm"
        >
          <Save className="mr-3 h-5 w-5" />
          Save Settings
        </Button>
      </div>
    </div>
  );
};

export default CardSettings;
