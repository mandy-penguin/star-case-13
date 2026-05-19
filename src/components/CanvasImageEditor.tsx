import React, { useRef, useEffect, useState } from 'react';
import { ArrowLeft, Save, Undo, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

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

interface CanvasImageEditorProps {
  routineId: string;
  imageId?: string; // undefined when creating new
  templateData?: string; // base64 template image
  onBack: () => void;
  onSave: () => void;
}

const CanvasImageEditor = ({ routineId, imageId, templateData, onBack, onSave }: CanvasImageEditorProps) => {
  const { toast } = useToast();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const backgroundCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [imageName, setImageName] = useState('');
  const [templateImage, setTemplateImage] = useState<HTMLImageElement | null>(null);
  const [strokes, setStrokes] = useState<Array<{x: number, y: number, isStart?: boolean}>>([]);

  useEffect(() => {
    if (imageId) {
      // Load existing image for editing
      loadExistingImage();
    } else {
      // Load template image for new creation; default to base image if none provided
      const src = templateData && templateData.length > 0 ? templateData : '/canvas.png';
      loadTemplateImage(src);
    }
  }, [imageId, templateData]);

  const loadExistingImage = () => {
    const saved = localStorage.getItem('customRoutines');
    if (saved) {
      const routines: CustomRoutine[] = JSON.parse(saved);
      const routine = routines.find(r => r.id === routineId);
      const image = routine?.images.find(img => img.id === imageId);
      
      if (image) {
        setImageName(image.name);
        // Load the existing painted image
        const img = new Image();
        img.onload = () => {
          setTemplateImage(img);
          drawImageToCanvas(img);
        };
        img.src = image.data;
      }
    }
  };

  const loadTemplateImage = (data: string) => {
    const img = new Image();
    img.onload = () => {
      setTemplateImage(img);
      drawImageToCanvas(img);
    };
    img.src = data;
    setImageName('New Image');
  };

  const drawImageToCanvas = (img: HTMLImageElement) => {
    const canvas = canvasRef.current;
    const backgroundCanvas = backgroundCanvasRef.current;
    if (!canvas || !backgroundCanvas) return;

    const ctx = canvas.getContext('2d');
    const bgCtx = backgroundCanvas.getContext('2d');
    if (!ctx || !bgCtx) return;

    // Set canvas size to be even larger, almost full screen
    const maxWidth = window.innerWidth - 20; // Minimal margin on sides
    const maxHeight = window.innerHeight - 100; // Less space for header and controls
    
    const aspectRatio = img.width / img.height;
    
    let canvasWidth, canvasHeight;
    if (aspectRatio > 1) {
      // Landscape image
      canvasWidth = Math.min(maxWidth, maxHeight * aspectRatio);
      canvasHeight = canvasWidth / aspectRatio;
    } else {
      // Portrait or square image
      canvasHeight = Math.min(maxHeight, maxWidth / aspectRatio);
      canvasWidth = canvasHeight * aspectRatio;
    }

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    backgroundCanvas.width = canvasWidth;
    backgroundCanvas.height = canvasHeight;

    // Draw template image to background canvas
    bgCtx.drawImage(img, 0, 0, canvasWidth, canvasHeight);

    // Clear main canvas (for drawing)
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  };

  const getCanvasPoint = (e: React.TouchEvent | React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;

    if ('touches' in e) {
      clientX = e.touches[0]?.clientX || e.changedTouches[0]?.clientX || 0;
      clientY = e.touches[0]?.clientY || e.changedTouches[0]?.clientY || 0;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  const startDrawing = (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    setIsDrawing(true);
    const point = getCanvasPoint(e);
    setStrokes(prev => [...prev, { ...point, isStart: true }]);
    drawPoint(point.x, point.y, true);
  };

  const draw = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDrawing) return;
    e.preventDefault();
    
    const point = getCanvasPoint(e);
    setStrokes(prev => [...prev, point]);
    drawPoint(point.x, point.y, false);
  };

  const stopDrawing = (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    setIsDrawing(false);
  };

  const drawPoint = (x: number, y: number, isStart: boolean) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;

    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = '#000000';
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 8;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (isStart) {
      ctx.beginPath();
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setStrokes([]);
  };

  const undoLastStroke = () => {
    // Find indices of stroke starts
    const startIndices = strokes
      .map((stroke, index) => (stroke.isStart ? index : -1))
      .filter(index => index !== -1);

    if (startIndices.length === 0) return;
    const lastStartIndex = startIndices[startIndices.length - 1];
    const newStrokes = strokes.slice(0, lastStartIndex);
    setStrokes(newStrokes);
    redrawCanvas(newStrokes);
  };

  const redrawCanvas = (strokesToRedraw: Array<{x: number, y: number, isStart?: boolean}>) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let lastWasStart = false;
    strokesToRedraw.forEach(stroke => {
      drawPoint(stroke.x, stroke.y, !!stroke.isStart || lastWasStart);
      lastWasStart = !!stroke.isStart;
    });
  };

  const saveImage = () => {
    if (!imageName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a name for the image",
        variant: "destructive"
      });
      return;
    }

    const canvas = canvasRef.current;
    const backgroundCanvas = backgroundCanvasRef.current;
    if (!canvas || !backgroundCanvas) return;

    // Create a composite canvas
    const compositeCanvas = document.createElement('canvas');
    compositeCanvas.width = canvas.width;
    compositeCanvas.height = canvas.height;
    const compositeCtx = compositeCanvas.getContext('2d');
    if (!compositeCtx) return;

    // Draw background first, then drawing on top
    compositeCtx.drawImage(backgroundCanvas, 0, 0);
    compositeCtx.drawImage(canvas, 0, 0);

    const imageData = compositeCanvas.toDataURL('image/png');

    // Save to localStorage
    const saved = localStorage.getItem('customRoutines');
    if (saved) {
      const routines: CustomRoutine[] = JSON.parse(saved);
      const routineIndex = routines.findIndex(r => r.id === routineId);
      
      if (routineIndex !== -1) {
        if (imageId) {
          // Update existing image
          const imageIndex = routines[routineIndex].images.findIndex(img => img.id === imageId);
          if (imageIndex !== -1) {
            routines[routineIndex].images[imageIndex] = {
              id: imageId,
              name: imageName.trim(),
              data: imageData
            };
          }
        } else {
          // Create new image
          const newImage: CustomRoutineImage = {
            id: Date.now().toString(),
            name: imageName.trim(),
            data: imageData
          };
          routines[routineIndex].images.push(newImage);
        }

        localStorage.setItem('customRoutines', JSON.stringify(routines));
        
        toast({
          title: "Success",
          description: "Image saved successfully"
        });

        onSave();
      }
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col p-6 pt-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 mt-8">
        <Button
          onClick={onBack}
          variant="outline"
          size="sm"
          className="rounded-xl shadow-sm bg-white border-gray-300 text-black hover:bg-gray-50 px-4 py-2"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <h1 className="text-xl font-semibold text-black tracking-tight">
          {imageId ? 'Edit Image' : 'Create Image'}
        </h1>
        <div className="w-16"></div>
      </div>

      {/* Image Name Input */}
      <div className="mb-4">
        <Input
          value={imageName}
          onChange={(e) => setImageName(e.target.value)}
          placeholder="Enter image name"
          className="rounded-xl"
        />
      </div>

      {/* Canvas Container */}
      <div className="flex-1 flex flex-col items-center">
        <div className="relative mb-4">
          {/* Background Canvas (template) */}
          <canvas
            ref={backgroundCanvasRef}
            className="absolute top-0 left-0 border-2 border-gray-300 rounded-lg pointer-events-none select-none"
            style={{ opacity: 0.7, touchAction: 'none' as any }}
          />
          {/* Drawing Canvas */}
          <canvas
            ref={canvasRef}
            className="border-2 border-gray-300 rounded-lg"
            style={{ touchAction: 'none' as any }}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
          />
        </div>

        {/* Controls */}
        <div className="flex gap-3 mb-6">
          <Button
            onClick={undoLastStroke}
            variant="outline"
            className="rounded-xl"
            disabled={strokes.length === 0}
          >
            <Undo className="h-4 w-4" />
          </Button>
          <Button
            onClick={clearCanvas}
            variant="outline"
            className="rounded-xl"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button
            onClick={saveImage}
            className="bg-black hover:bg-gray-800 text-white rounded-xl"
          >
            <Save className="mr-2 h-4 w-4" />
            Save
          </Button>
        </div>

        <div className="text-sm text-gray-600 text-center">
          <p>Paint over the template with your finger or mouse</p>
          <p>Use black strokes to create your custom image</p>
        </div>
      </div>
    </div>
  );
};

export default CanvasImageEditor;