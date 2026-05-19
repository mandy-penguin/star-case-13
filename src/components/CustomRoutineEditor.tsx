import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Edit2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

interface CustomRoutineImage {
  id: string;
  name: string;
  data: string; // base64 image data
}

interface CustomRoutine {
  id: string;
  name: string;
  images: CustomRoutineImage[];
  createdAt: string;
}

interface CustomRoutineEditorProps {
  routineId: string;
  onBack: () => void;
  onEditImage: (routineId: string, imageId?: string, templateData?: string) => void;
}

const CustomRoutineEditor = ({ routineId, onBack, onEditImage }: CustomRoutineEditorProps) => {
  const { toast } = useToast();
  const [routine, setRoutine] = useState<CustomRoutine | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

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

  const saveRoutine = (updatedRoutine: CustomRoutine) => {
    const saved = localStorage.getItem('customRoutines');
    if (saved) {
      const routines: CustomRoutine[] = JSON.parse(saved);
      const updatedRoutines = routines.map(r => 
        r.id === routineId ? updatedRoutine : r
      );
      localStorage.setItem('customRoutines', JSON.stringify(updatedRoutines));
      setRoutine(updatedRoutine);
    }
  };

  const handleAddNewImage = () => {
    // Always start with the default base image in public/canvas.png
    const templateData = '/canvas.png';
    onEditImage(routineId, undefined, templateData);
  };

  const handleRenameImage = (imageId: string, newName: string) => {
    if (!routine || !newName.trim()) return;

    const updatedImages = routine.images.map(img => 
      img.id === imageId ? { ...img, name: newName.trim() } : img
    );
    
    const updatedRoutine = { ...routine, images: updatedImages };
    saveRoutine(updatedRoutine);
    setEditingId(null);
    setEditingName('');

    toast({
      title: "Success",
      description: "Image renamed successfully"
    });
  };

  const handleDeleteImage = (imageId: string) => {
    if (!routine) return;

    const updatedImages = routine.images.filter(img => img.id !== imageId);
    const updatedRoutine = { ...routine, images: updatedImages };
    saveRoutine(updatedRoutine);

    toast({
      title: "Success",
      description: "Image deleted successfully"
    });
  };

  const startEditing = (image: CustomRoutineImage) => {
    setEditingId(image.id);
    setEditingName(image.name);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditingName('');
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
        <h1 className="text-xl font-semibold text-black tracking-tight">{routine.name}</h1>
        <div className="w-16"></div>
      </div>

      {/* Add New Image */}
      <div className="mb-6">
        <Button
          onClick={handleAddNewImage}
          className="w-full h-12 bg-black hover:bg-gray-800 text-white rounded-xl"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add New Image
        </Button>
      </div>

      {/* Images Grid */}
      <div className="grid grid-cols-2 gap-4">
        {routine.images.length === 0 ? (
          <div className="col-span-2 text-center py-8 text-gray-500">
            <p>No images yet. Tap “Add New Image” to start from the base canvas.</p>
          </div>
        ) : (
          routine.images.map((image) => (
            <div
              key={image.id}
              className="bg-white border border-gray-300 rounded-xl overflow-hidden shadow-sm"
            >
              {/* Image Preview */}
              <div className="aspect-square relative">
                <img
                  src={image.data}
                  alt={image.name}
                  className="w-full h-full object-cover"
                />
                <Button
                  onClick={() => onEditImage(routineId, image.id)}
                  className="absolute top-2 right-2 h-8 w-8 p-0 bg-black/70 hover:bg-black/80 text-white rounded-lg"
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
              </div>

              {/* Image Details */}
              <div className="p-3">
                {editingId === image.id ? (
                  <div className="space-y-2">
                    <Input
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      className="text-sm rounded-lg"
                      autoFocus
                    />
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleRenameImage(image.id, editingName)}
                        size="sm"
                        className="flex-1 bg-black hover:bg-gray-800 text-white rounded-lg text-xs"
                      >
                        Save
                      </Button>
                      <Button
                        onClick={cancelEditing}
                        variant="outline"
                        size="sm"
                        className="flex-1 rounded-lg text-xs"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="font-medium text-sm text-black mb-2">{image.name}</p>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => startEditing(image)}
                        size="sm"
                        variant="outline"
                        className="flex-1 rounded-lg text-xs"
                      >
                        <Edit2 className="h-3 w-3 mr-1" />
                        Rename
                      </Button>
                      <Button
                        onClick={() => handleDeleteImage(image.id)}
                        size="sm"
                        variant="outline"
                        className="flex-1 rounded-lg text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CustomRoutineEditor;