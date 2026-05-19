
import React from 'react';
import { ArrowLeft, Image, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SettingsHomeProps {
  onBackToHome: () => void;
  onImageCalibrationClick: () => void;
  onCardSettingsClick: () => void;
  onCustomRoutineBuilderClick: () => void;
}

const SettingsHome = ({ onBackToHome, onImageCalibrationClick, onCardSettingsClick, onCustomRoutineBuilderClick }: SettingsHomeProps) => {
  return (
    <div className="min-h-screen bg-white flex flex-col p-6 pt-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-12 mt-8">
        <Button
          onClick={onBackToHome}
          variant="outline"
          size="sm"
          className="rounded-xl shadow-sm bg-white border-gray-300 text-black hover:bg-gray-50 px-4 py-2"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <h1 className="text-2xl font-semibold text-black tracking-tight">Settings</h1>
        <div className="w-16"></div>
      </div>

      {/* Settings Options */}
      <div className="flex-1 flex flex-col items-center justify-center max-w-sm mx-auto w-full space-y-4">
        <Button
          className="w-full h-16 bg-white hover:bg-gray-50 border border-gray-300 rounded-xl text-black text-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md"
          onClick={onImageCalibrationClick}
        >
          <Image className="mr-4 h-6 w-6 text-gray-600" />
          Image Calibration
        </Button>

        <Button
          className="w-full h-16 bg-white hover:bg-gray-50 border border-gray-300 rounded-xl text-black text-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md"
          onClick={onCardSettingsClick}
        >
          <Sparkles className="mr-4 h-6 w-6 text-gray-600" />
          Card Animation Settings
        </Button>

        <Button
          className="w-full h-16 bg-white hover:bg-gray-50 border border-gray-300 rounded-xl text-black text-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md"
          onClick={onCustomRoutineBuilderClick}
        >
          <Sparkles className="mr-4 h-6 w-6 text-gray-600" />
          Custom Routine Builder
        </Button>
      </div>
    </div>
  );
};

export default SettingsHome;
