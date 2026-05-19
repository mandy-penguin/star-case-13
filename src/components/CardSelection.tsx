
import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CardSelectionProps {
  onBackToHome: () => void;
  onCardSelected: (card: string) => void;
}

const CardSelection = ({ onBackToHome, onCardSelected }: CardSelectionProps) => {
  const [selectedNumber, setSelectedNumber] = useState<string>('');
  const [selectedSuit, setSelectedSuit] = useState<string>('');

  // Arrange numbers in the specific matrix format requested
  const numberMatrix = [
    ['A', '2', '3', '4'],
    ['5', '6', '7', '8'],
    ['9', '10', 'J'],
    ['Q', 'K']
  ];

  const suits = [
    { symbol: 'C', name: 'Clubs' },
    { symbol: 'H', name: 'Hearts' },
    { symbol: 'S', name: 'Spades' },
    { symbol: 'D', name: 'Diamonds' }
  ];

  const handleNumberSelect = (number: string) => {
    setSelectedNumber(number);
    if (selectedSuit) {
      const card = `${number}${selectedSuit}`;
      onCardSelected(card);
    }
  };

  const handleSuitSelect = (suit: string) => {
    setSelectedSuit(suit);
    if (selectedNumber) {
      const card = `${selectedNumber}${suit}`;
      onCardSelected(card);
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
        <h1 className="text-2xl font-semibold text-black tracking-tight">Select Card</h1>
        <div className="w-16"></div>
      </div>

      {/* Card Selection Interface */}
      <div className="flex-1 flex flex-col justify-center">
        <div className="w-full max-w-md mx-auto bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
          {/* Number Section */}
          <div className="mb-8">
            <h2 className="text-black text-xl font-semibold text-center mb-6">Number</h2>
            <div className="space-y-3">
              {numberMatrix.map((row, rowIndex) => (
                <div key={rowIndex} className={`grid gap-3 ${row.length === 4 ? 'grid-cols-4' : row.length === 3 ? 'grid-cols-3' : 'grid-cols-2'}`}>
                  {row.map((number) => (
                    <button
                      key={number}
                      onClick={() => handleNumberSelect(number)}
                      className={`h-12 rounded-xl text-lg font-medium transition-all duration-200 shadow-sm ${
                        selectedNumber === number
                          ? 'bg-black text-white'
                          : 'bg-gray-100 hover:bg-gray-200 text-black'
                      } ${number === '10' ? 'text-base' : ''}`}
                    >
                      {number}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Suit Section */}
          <div>
            <h2 className="text-black text-xl font-semibold text-center mb-6">Suit</h2>
            <div className="grid grid-cols-4 gap-3">
              {suits.map((suit) => (
                <button
                  key={suit.symbol}
                  onClick={() => handleSuitSelect(suit.symbol)}
                  className={`h-14 rounded-xl text-2xl font-medium transition-all duration-200 shadow-sm ${
                    selectedSuit === suit.symbol
                      ? 'bg-black text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-black'
                  }`}
                >
                  {suit.symbol}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardSelection;
