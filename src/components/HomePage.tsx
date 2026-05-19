
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Settings, Eye, Hash, Shapes, Plus } from 'lucide-react';
import InstallPrompt from './InstallPrompt';

interface CustomRoutine {
  id: string;
  name: string;
  images: Array<{id: string; name: string; data: string}>;
  createdAt: string;
}

interface HomePageProps {
  onSettingsClick: () => void;
  onCardsClick: () => void;
  onNumbersClick: () => void;
  onEspClick: () => void;
  onCustomRoutineClick: (routineId: string) => void;
}

const HomePage = ({ onSettingsClick, onCardsClick, onNumbersClick, onEspClick, onCustomRoutineClick }: HomePageProps) => {
  const [customRoutines, setCustomRoutines] = useState<CustomRoutine[]>([]);

  useEffect(() => {
    loadCustomRoutines();
  }, []);

  const loadCustomRoutines = () => {
    const saved = localStorage.getItem('customRoutines');
    if (saved) {
      setCustomRoutines(JSON.parse(saved));
    }
  };
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 pt-12">
      <div className="space-y-4 w-full max-w-xs">
        <Button
          onClick={onCardsClick}
          className="w-full h-14 text-lg font-medium bg-black hover:bg-gray-800 text-white transition-all duration-200 shadow-sm hover:shadow-md rounded-xl border-0"
          size="lg"
        >
          <Eye className="mr-3 h-5 w-5" />
          Cards
        </Button>

        <Button
          onClick={onNumbersClick}
          className="w-full h-14 text-lg font-medium bg-black hover:bg-gray-800 text-white transition-all duration-200 shadow-sm hover:shadow-md rounded-xl border-0"
          size="lg"
        >
          <Hash className="mr-3 h-5 w-5" />
          Numbers
        </Button>

        <Button
          onClick={onEspClick}
          className="w-full h-14 text-lg font-medium bg-black hover:bg-gray-800 text-white transition-all duration-200 shadow-sm hover:shadow-md rounded-xl border-0"
          size="lg"
        >
          <Shapes className="mr-3 h-5 w-5" />
          ESP
        </Button>

        {/* Custom Routines */}
        {customRoutines.map((routine) => (
          <Button
            key={routine.id}
            onClick={() => onCustomRoutineClick(routine.id)}
            className="w-full h-14 text-lg font-medium bg-black hover:bg-gray-800 text-white transition-all duration-200 shadow-sm hover:shadow-md rounded-xl border-0"
            size="lg"
          >
            <Plus className="mr-3 h-5 w-5" />
            {routine.name}
          </Button>
        ))}

        <Button
          onClick={onSettingsClick}
          variant="outline"
          className="w-full h-14 text-lg font-medium border border-gray-300 text-black hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md rounded-xl bg-white"
          size="lg"
        >
          <Settings className="mr-3 h-5 w-5" />
          Settings
        </Button>
      </div>

      <InstallPrompt />
    </div>
  );
};

export default HomePage;
