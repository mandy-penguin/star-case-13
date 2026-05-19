import React, { useState, useRef, useEffect } from 'react';
import { Save, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface ImageTransform {
  x: number;
  y: number;
  scale: number;
  rotation: number;
}

interface TouchData {
  clientX: number;
  clientY: number;
}

interface CalibrationModeProps {
  onBackToHome: () => void;
  onCalibrationComplete: (transform: ImageTransform) => void;
}

const CalibrationMode = ({ onBackToHome, onCalibrationComplete }: CalibrationModeProps) => {
  const { toast } = useToast();
  const [transform, setTransform] = useState<ImageTransform>({ x: 50, y: 50, scale: 1, rotation: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isRotating, setIsRotating] = useState(false);
  const imageRef = useRef<HTMLDivElement>(null);
  const rotationStartRef = useRef<{ angle: number; startRotation: number }>({ angle: 0, startRotation: 0 });
  const touchStartRef = useRef<{ touches: TouchData[]; transform: ImageTransform; initialDistance?: number }>({ 
    touches: [], 
    transform: { x: 0, y: 0, scale: 1, rotation: 0 } 
  });
  const mouseStartRef = useRef<{ x: number; y: number; transform: ImageTransform }>({ x: 0, y: 0, transform: { x: 0, y: 0, scale: 1, rotation: 0 } });

  const calibrationImageUrl = "/lovable-uploads/fb48c938-2940-4eb3-9c87-b96208ff058f.png";

  useEffect(() => {
    const saved = localStorage.getItem('imageTransform');
    if (saved) {
      const savedTransform = JSON.parse(saved);
      setTransform(savedTransform);
    }
  }, []);

  const convertTouchList = (touchList: React.TouchList): TouchData[] => {
    const result: TouchData[] = [];
    for (let i = 0; i < touchList.length; i++) {
      const touch = touchList.item(i);
      if (touch) {
        result.push({
          clientX: touch.clientX,
          clientY: touch.clientY
        });
      }
    }
    return result;
  };

  const getTouchDistance = (touches: TouchData[]) => {
    if (touches.length < 2) return 0;
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const getTouchCenter = (touches: TouchData[]) => {
    if (touches.length === 1) {
      return { x: touches[0].clientX, y: touches[0].clientY };
    }
    const x = (touches[0].clientX + touches[1].clientX) / 2;
    const y = (touches[0].clientY + touches[1].clientY) / 2;
    return { x, y };
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    
    const touches = convertTouchList(e.touches);
    const initialDistance = touches.length >= 2 ? getTouchDistance(touches) : undefined;
    
    touchStartRef.current = {
      touches,
      transform: { ...transform },
      initialDistance
    };
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || touchStartRef.current.touches.length === 0) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    const startTouches = touchStartRef.current.touches;
    const currentTouches = convertTouchList(e.touches);
    const startTransform = touchStartRef.current.transform;
    
    if (startTouches.length === 1 && currentTouches.length === 1) {
      // Single touch - drag
      const deltaX = currentTouches[0].clientX - startTouches[0].clientX;
      const deltaY = currentTouches[0].clientY - startTouches[0].clientY;
      
      const sensitivity = 0.5;
      const newX = startTransform.x + (deltaX / window.innerWidth) * 100 * sensitivity;
      const newY = startTransform.y + (deltaY / window.innerHeight) * 100 * sensitivity;
      
      setTransform(prev => ({
        ...prev,
        x: Math.max(0, Math.min(100, newX)),
        y: Math.max(0, Math.min(100, newY))
      }));
    } else if (startTouches.length === 2 && currentTouches.length === 2 && touchStartRef.current.initialDistance) {
      // Two touches - pinch to zoom and drag
      const currentDistance = getTouchDistance(currentTouches);
      const startDistance = touchStartRef.current.initialDistance;
      
      // Handle zoom with improved sensitivity
      if (startDistance > 0) {
        const scaleRatio = currentDistance / startDistance;
        const dampedScaleRatio = 1 + (scaleRatio - 1) * 0.5;
        const newScale = startTransform.scale * dampedScaleRatio;
        
        setTransform(prev => ({
          ...prev,
          scale: Math.max(0.5, Math.min(3, newScale))
        }));
      }
      
      // Handle drag with two fingers
      const startCenter = getTouchCenter(startTouches);
      const currentCenter = getTouchCenter(currentTouches);
      
      const deltaX = currentCenter.x - startCenter.x;
      const deltaY = currentCenter.y - startCenter.y;
      
      const sensitivity = 0.3;
      const newX = startTransform.x + (deltaX / window.innerWidth) * 100 * sensitivity;
      const newY = startTransform.y + (deltaY / window.innerHeight) * 100 * sensitivity;
      
      setTransform(prev => ({
        ...prev,
        x: Math.max(0, Math.min(100, newX)),
        y: Math.max(0, Math.min(100, newY))
      }));
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    touchStartRef.current = { touches: [], transform: { x: 0, y: 0, scale: 1, rotation: 0 } };
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    
    mouseStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      transform: { ...transform }
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const deltaX = e.clientX - mouseStartRef.current.x;
    const deltaY = e.clientY - mouseStartRef.current.y;
    const startTransform = mouseStartRef.current.transform;
    
    const newX = startTransform.x + (deltaX / window.innerWidth) * 100;
    const newY = startTransform.y + (deltaY / window.innerHeight) * 100;
    
    setTransform(prev => ({
      ...prev,
      x: Math.max(0, Math.min(100, newX)),
      y: Math.max(0, Math.min(100, newY))
    }));
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const scaleChange = e.deltaY > 0 ? 0.9 : 1.1;
    setTransform(prev => ({
      ...prev,
      scale: Math.max(0.5, Math.min(3, prev.scale * scaleChange))
    }));
  };

  const handleRotationStart = (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsRotating(true);
    
    if (imageRef.current) {
      const rect = imageRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      
      const startAngle = Math.atan2(clientY - centerY, clientX - centerX);
      rotationStartRef.current = {
        angle: startAngle,
        startRotation: transform.rotation
      };
    }
  };

  const handleRotationMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isRotating || !imageRef.current) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    const rect = imageRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    const currentAngle = Math.atan2(clientY - centerY, clientX - centerX);
    const angleDiff = currentAngle - rotationStartRef.current.angle;
    const newRotation = rotationStartRef.current.startRotation + (angleDiff * 180) / Math.PI;
    
    setTransform(prev => ({
      ...prev,
      rotation: newRotation % 360
    }));
  };

  const handleRotationEnd = (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsRotating(false);
  };

  const handleSave = () => {
    localStorage.setItem('imageTransform', JSON.stringify(transform));
    toast({
      title: "Settings Saved!",
      description: "Your image position and size have been saved.",
    });
    // Navigate back to settings after saving
    onBackToHome();
  };

  return (
    <div 
      className="fixed inset-0 bg-white overflow-hidden select-none"
      onMouseMove={isRotating ? handleRotationMove : handleMouseMove}
      onMouseUp={isRotating ? handleRotationEnd : handleMouseUp}
      onMouseLeave={isRotating ? handleRotationEnd : handleMouseUp}
      onTouchMove={isRotating ? handleRotationMove : undefined}
      onTouchEnd={isRotating ? handleRotationEnd : undefined}
      style={{ touchAction: 'none', height: '100dvh' }}
    >
      <div
        ref={imageRef}
        className={`absolute transition-transform duration-75 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        style={{
          left: `${transform.x}%`,
          top: `${transform.y}%`,
          transform: `translate(-50%, -50%) scale(${transform.scale}) rotate(${transform.rotation}deg)`,
          touchAction: 'none'
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onWheel={handleWheel}
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={calibrationImageUrl}
          alt="Calibration image"
          className="max-w-none object-cover rounded-lg shadow-lg pointer-events-none"
          style={{
            width: '216px',
            height: '342.4px'
          }}
          draggable={false}
        />
        
        <div 
          className="absolute -top-2 -right-2 w-8 h-8 bg-blue-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center cursor-pointer touch-manipulation"
          onTouchStart={handleRotationStart}
          onMouseDown={handleRotationStart}
          style={{ touchAction: 'none' }}
        >
          <div className="w-2 h-2 bg-white rounded-full"></div>
        </div>
      </div>

      <div className="fixed top-20 left-4 z-10">
        <Button
          onClick={onBackToHome}
          variant="outline"
          size="sm"
          className="rounded-xl shadow-sm bg-white border-gray-300 text-black hover:bg-gray-50"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </div>

      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-10">
        <Button
          onClick={handleSave}
          size="lg"
          className="bg-black hover:bg-gray-800 text-white px-8 py-4 rounded-xl shadow-sm"
        >
          <Save className="mr-2 h-5 w-5" />
          Save Position
        </Button>
      </div>
    </div>
  );
};

export default CalibrationMode;
