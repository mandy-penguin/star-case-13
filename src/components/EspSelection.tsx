import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EspSelectionProps {
  onBackToHome: () => void;
  onEspSelected: (shape: string) => void;
}

const EspSelection = ({ onBackToHome, onEspSelected }: EspSelectionProps) => {
  const [selectedShape, setSelectedShape] = useState<string>('');

  const shapes = [
    { symbol: '□', name: 'Square' },
    { symbol: '△', name: 'Triangle' },
    { symbol: '○', name: 'Circle' },
    { symbol: '★', name: 'Star' },
    { symbol: '〜', name: 'Wavy' },
    { symbol: '✕', name: 'Cross' }
  ];

  const handleShapeSelect = (shape: string) => {
    setSelectedShape(shape);
    onEspSelected(shape);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col p-6 pt-12">
      <div className="flex items-center justify-between mb-8 mt-8">
        <Button
          onClick={onBackToHome}
          variant="outline"
          className="rounded-xl shadow-sm bg-white border-gray-300 text-black hover:bg-gray-50 px-4 py-2"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <h1 className="text-2xl font-semibold text-black tracking-tight">Select ESP Shape</h1>
        <div className="w-16"></div>
      </div>

      {/* ESP Selection Interface */}
      <div className="flex-1 flex flex-col justify-center">
        <div className="w-full max-w-md mx-auto bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
          <h2 className="text-black text-xl font-semibold text-center mb-6">ESP Shapes</h2>
          <div className="grid grid-cols-2 gap-4">
            {shapes.map((shape) => (
              <button
                key={shape.name}
                onClick={() => handleShapeSelect(shape.name)}
                className={`h-20 rounded-xl text-4xl font-medium transition-all duration-200 shadow-sm flex flex-col items-center justify-center ${
                  selectedShape === shape.name
                    ? 'bg-black text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-black'
                }`}
              >
                <span className="text-3xl mb-1">{shape.symbol}</span>
                <span className="text-xs font-normal">{shape.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EspSelection;