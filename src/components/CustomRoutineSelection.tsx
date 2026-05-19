import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CustomRoutineImage {
  id: string;
  name: string;
  data: string;
}

interface CustomRoutine {
  id: string;
  name: string;
  images: CustomRoutineImage[];
  createdAt: string;
}

interface CustomRoutineSelectionProps {
  routineId: string;
  onBack: () => void;
  onImageSelected: (routineId: string, imageId: string) => void;
}

const CustomRoutineSelection = ({ routineId, onBack, onImageSelected }: CustomRoutineSelectionProps) => {
  const [routine, setRoutine] = useState<CustomRoutine | null>(null);

  useEffect(() => {
    loadRoutine();
  }, [routineId]);

  const loadRoutine = () => {
    const saved = localStorage.getItem('customRoutines');
    if (saved) {
      const routines: CustomRoutine[] = JSON.parse(saved);
      const foundRoutine = routines.find(r => r.id === routineId);
      setRoutine(foundRoutine || null);
    }
  };

  if (!routine) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p>Routine not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col p-6 pt-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 mt-8">
        <Button
          onClick={onBack}
          variant="outline"
          size="sm"
          className="rounded-xl shadow-sm bg-white border-gray-300 text-black hover:bg-gray-50 px-4 py-2"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <h1 className="text-2xl font-semibold text-black tracking-tight">{routine.name}</h1>
        <div className="w-16"></div>
      </div>

      {/* Images Grid */}
      <div className="flex-1 flex flex-col items-center justify-center">
        {routine.images.length === 0 ? (
          <div className="text-center">
            <p className="text-gray-500 mb-4">No images available in this routine</p>
            <p className="text-sm text-gray-400">Add images in the Custom Routine Builder</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-2xl w-full">
            {routine.images.map((image) => (
              <Button
                key={image.id}
                onClick={() => onImageSelected(routineId, image.id)}
                className="h-32 p-2 bg-white hover:bg-gray-50 border border-gray-300 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md flex flex-col items-center justify-center"
              >
                <img
                  src={image.data}
                  alt={image.name}
                  className="w-16 h-16 object-contain mb-2"
                />
                <span className="text-sm text-black font-medium text-center">
                  {image.name}
                </span>
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomRoutineSelection;