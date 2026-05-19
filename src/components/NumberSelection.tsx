
import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NumberSelectionProps {
  onBackToHome: () => void;
  onNumberSelected: (number: string) => void;
}

const NumberSelection = ({ onBackToHome, onNumberSelected }: NumberSelectionProps) => {
  const [firstDigit, setFirstDigit] = useState<string>('');
  const [secondDigit, setSecondDigit] = useState<string>('');

  const digits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

  const handleFirstDigitSelect = (digit: string) => {
    setFirstDigit(digit);
    if (secondDigit) {
      const number = `${digit}${secondDigit}`;
      onNumberSelected(number.padStart(2, '0'));
    }
  };

  const handleSecondDigitSelect = (digit: string) => {
    setSecondDigit(digit);
    if (firstDigit) {
      const number = `${firstDigit}${digit}`;
      onNumberSelected(number.padStart(2, '0'));
    }
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
        <h1 className="text-2xl font-semibold text-black tracking-tight">Select Number</h1>
        <div className="w-16"></div>
      </div>

      {/* Number Selection Interface */}
      <div className="flex-1 flex flex-col justify-center">
        <div className="w-full max-w-md mx-auto bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
          {/* First Digit Section */}
          <div className="mb-8">
            <h2 className="text-black text-xl font-semibold text-center mb-6">First Digit</h2>
            <div className="grid grid-cols-5 gap-3">
              {digits.map((digit) => (
                <button
                  key={digit}
                  onClick={() => handleFirstDigitSelect(digit)}
                  className={`h-12 rounded-xl text-lg font-medium transition-all duration-200 shadow-sm ${
                    firstDigit === digit
                      ? 'bg-black text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-black'
                  }`}
                >
                  {digit}
                </button>
              ))}
            </div>
          </div>

          {/* Second Digit Section */}
          <div>
            <h2 className="text-black text-xl font-semibold text-center mb-6">Second Digit</h2>
            <div className="grid grid-cols-5 gap-3">
              {digits.map((digit) => (
                <button
                  key={digit}
                  onClick={() => handleSecondDigitSelect(digit)}
                  className={`h-12 rounded-xl text-lg font-medium transition-all duration-200 shadow-sm ${
                    secondDigit === digit
                      ? 'bg-black text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-black'
                  }`}
                >
                  {digit}
                </button>
              ))}
            </div>
          </div>

          {/* Selected Number Display */}
          {(firstDigit || secondDigit) && (
            <div className="mt-8 text-center">
              <p className="text-gray-600 mb-2">Selected Number:</p>
              <p className="text-3xl font-bold text-black">
                {(firstDigit || '0') + (secondDigit || '0')}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NumberSelection;
