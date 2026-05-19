import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Edit2, Trash2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

interface CustomRoutine {
  id: string;
  name: string;
  images: CustomRoutineImage[];
  createdAt: string;
}

interface CustomRoutineImage {
  id: string;
  name: string;
  data: string; // base64 image data
}

interface CustomRoutineManagerProps {
  onBackToSettings: () => void;
  onEditRoutine: (routineId: string) => void;
}

const CustomRoutineManager = ({ onBackToSettings, onEditRoutine }: CustomRoutineManagerProps) => {
  const { toast } = useToast();
  const [routines, setRoutines] = useState<CustomRoutine[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [newRoutineName, setNewRoutineName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  useEffect(() => {
    loadRoutines();
  }, []);

  const loadRoutines = () => {
    const saved = localStorage.getItem('customRoutines');
    if (saved) {
      setRoutines(JSON.parse(saved));
    }
  };

  const saveRoutines = (updatedRoutines: CustomRoutine[]) => {
    localStorage.setItem('customRoutines', JSON.stringify(updatedRoutines));
    setRoutines(updatedRoutines);
  };

  const handleCreateRoutine = () => {
    if (!newRoutineName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a routine name",
        variant: "destructive"
      });
      return;
    }

    const newRoutine: CustomRoutine = {
      id: Date.now().toString(),
      name: newRoutineName.trim(),
      images: [],
      createdAt: new Date().toISOString()
    };

    const updatedRoutines = [...routines, newRoutine];
    saveRoutines(updatedRoutines);
    setNewRoutineName('');
    setIsCreating(false);

    toast({
      title: "Success",
      description: "Custom routine created successfully"
    });
  };

  const handleRenameRoutine = (id: string, newName: string) => {
    if (!newName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid name",
        variant: "destructive"
      });
      return;
    }

    const updatedRoutines = routines.map(routine => 
      routine.id === id ? { ...routine, name: newName.trim() } : routine
    );
    saveRoutines(updatedRoutines);
    setEditingId(null);
    setEditingName('');

    toast({
      title: "Success",
      description: "Routine renamed successfully"
    });
  };

  const handleDeleteRoutine = (id: string) => {
    const updatedRoutines = routines.filter(routine => routine.id !== id);
    saveRoutines(updatedRoutines);

    toast({
      title: "Success",
      description: "Routine deleted successfully"
    });
  };

  const startEditing = (routine: CustomRoutine) => {
    setEditingId(routine.id);
    setEditingName(routine.name);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditingName('');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col p-6 pt-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 mt-8">
        <Button
          onClick={onBackToSettings}
          variant="outline"
          size="sm"
          className="rounded-xl shadow-sm bg-white border-gray-300 text-black hover:bg-gray-50 px-4 py-2"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <h1 className="text-2xl font-semibold text-black tracking-tight">Custom Routines</h1>
        <div className="w-16"></div>
      </div>

      {/* Create New Routine */}
      <div className="mb-6">
        {!isCreating ? (
          <Button
            onClick={() => setIsCreating(true)}
            className="w-full h-12 bg-black hover:bg-gray-800 text-white rounded-xl"
          >
            <Plus className="mr-2 h-4 w-4" />
            Create New Routine
          </Button>
        ) : (
          <div className="space-y-3">
            <Input
              value={newRoutineName}
              onChange={(e) => setNewRoutineName(e.target.value)}
              placeholder="Enter routine name"
              className="rounded-xl"
              autoFocus
            />
            <div className="flex gap-3">
              <Button
                onClick={handleCreateRoutine}
                className="flex-1 bg-black hover:bg-gray-800 text-white rounded-xl"
              >
                Create
              </Button>
              <Button
                onClick={() => {
                  setIsCreating(false);
                  setNewRoutineName('');
                }}
                variant="outline"
                className="flex-1 rounded-xl"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Routines List */}
      <div className="space-y-4">
        {routines.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No custom routines yet. Create one to get started!</p>
          </div>
        ) : (
          routines.map((routine) => (
            <div
              key={routine.id}
              className="bg-white border border-gray-300 rounded-xl p-4 shadow-sm"
            >
              {editingId === routine.id ? (
                <div className="space-y-3">
                  <Input
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    className="rounded-xl"
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleRenameRoutine(routine.id, editingName)}
                      size="sm"
                      className="bg-black hover:bg-gray-800 text-white rounded-xl"
                    >
                      Save
                    </Button>
                    <Button
                      onClick={cancelEditing}
                      variant="outline"
                      size="sm"
                      className="rounded-xl"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-black">{routine.name}</h3>
                    <p className="text-sm text-gray-500">
                      {routine.images.length} image{routine.images.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => onEditRoutine(routine.id)}
                      size="sm"
                      variant="outline"
                      className="rounded-xl"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      onClick={() => startEditing(routine)}
                      size="sm"
                      variant="outline"
                      className="rounded-xl"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      onClick={() => handleDeleteRoutine(routine.id)}
                      size="sm"
                      variant="outline"
                      className="rounded-xl text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CustomRoutineManager;