import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import HomePage from './HomePage';
import CalibrationMode from './CalibrationMode';
import CardSelection from './CardSelection';
import NumberSelection from './NumberSelection';
import EspSelection from './EspSelection';
import SettingsHome from './SettingsHome';
import CardSettings, { CardAnimationSettings } from './CardSettings';
import OfflineIndicator from './OfflineIndicator';
import CustomRoutineManager from './CustomRoutineManager';
import CustomRoutineEditor from './CustomRoutineEditor';
import CustomRoutineSelection from './CustomRoutineSelection';
import CanvasImageEditor from './CanvasImageEditor';

interface ImageTransform {
  x: number;
  y: number;
  scale: number;
  rotation: number;
}

const ImageEditor = () => {
  const { toast } = useToast();
  const [currentScreen, setCurrentScreen] = useState<
    'home' | 
    'settingsHome' | 
    'calibration' | 
    'cardSettings' | 
    'viewer' | 
    'cardSelection' | 
    'numberSelection' | 
    'espSelection' | 
    'cardViewer' | 
    'numberViewer' | 
    'espViewer' |
    'customRoutineManager' |
    'customRoutineEditor' |
    'customRoutineSelection' |
    'customRoutineViewer' |
    'canvasImageEditor'
  >('home');
  const [transform, setTransform] = useState<ImageTransform>({ x: 50, y: 50, scale: 1, rotation: 0 });
  const [selectedCard, setSelectedCard] = useState<string>('');
  const [showCalibrationImage, setShowCalibrationImage] = useState(false);
  const [showCardImage, setShowCardImage] = useState(false);
  const [cardImageVisible, setCardImageVisible] = useState(false);
  const [cardSettings, setCardSettings] = useState<CardAnimationSettings>({ delay: 5, fadeOutDelay: 3, enableRedirect: false, redirectUrl: 'https://www.google.com/images?q=blank', redirectDelay: 5 });
  const [isInlineCalibration, setIsInlineCalibration] = useState(false);
  const [lastTapTime, setLastTapTime] = useState(0);
  const [sequenceCompleted, setSequenceCompleted] = useState(false);
  const [selectedCustomRoutineId, setSelectedCustomRoutineId] = useState<string>('');
  const [selectedCustomImageId, setSelectedCustomImageId] = useState<string>('');
  const [canvasTemplateData, setCanvasTemplateData] = useState<string>('');

  // Inline calibration state
  const [isDragging, setIsDragging] = useState(false);
  const [isZooming, setIsZooming] = useState(false);
  const touchStartRef = useRef<{ touches: Array<{clientX: number, clientY: number}>; transform: ImageTransform; initialDistance?: number }>({ 
    touches: [], 
    transform: { x: 0, y: 0, scale: 1, rotation: 0 } 
  });
  const mouseStartRef = useRef<{ x: number; y: number; transform: ImageTransform }>({ x: 0, y: 0, transform: { x: 0, y: 0, scale: 1, rotation: 0 } });

  useEffect(() => {
    const saved = localStorage.getItem('imageTransform');
    if (saved) {
      const savedTransform = JSON.parse(saved);
      setTransform(savedTransform);
    }

    // Load card animation settings
    const savedCardSettings = localStorage.getItem('cardAnimationSettings');
    if (savedCardSettings) {
      const parsedCardSettings = JSON.parse(savedCardSettings);
      setCardSettings(parsedCardSettings);
    }

    // Auto-enable redirect for browser users (not PWA) only if no calibration has been done
    const isStandalonePWA = window.matchMedia('(display-mode: standalone)').matches;
    if (!isStandalonePWA && !saved) {
      setCardSettings(prev => ({ ...prev, enableRedirect: true }));
    }
  }, []);

  const handleSettingsClick = () => {
    setCurrentScreen('settingsHome');
  };

  const handleCardsClick = () => {
    setCurrentScreen('cardSelection');
  };

  const handleNumbersClick = () => {
    setCurrentScreen('numberSelection');
  };

  const handleEspClick = () => {
    console.log('ESP button clicked, setting screen to espSelection');
    setCurrentScreen('espSelection');
  };

  const handleCustomRoutineClick = (routineId: string) => {
    setSelectedCustomRoutineId(routineId);
    setCurrentScreen('customRoutineSelection');
  };

  const handleCustomRoutineBuilderClick = () => {
    setCurrentScreen('customRoutineManager');
  };

  const handleCustomRoutineManagerBack = () => {
    setCurrentScreen('settingsHome');
  };

  const handleEditRoutine = (routineId: string) => {
    setSelectedCustomRoutineId(routineId);
    setCurrentScreen('customRoutineEditor');
  };

  const handleCustomRoutineEditorBack = () => {
    setCurrentScreen('customRoutineManager');
  };

  const handleEditImage = (routineId: string, imageId?: string, templateData?: string) => {
    setSelectedCustomRoutineId(routineId);
    setSelectedCustomImageId(imageId || '');
    setCanvasTemplateData(templateData || '');
    setCurrentScreen('canvasImageEditor');
  };

  const handleCanvasImageEditorBack = () => {
    setCurrentScreen('customRoutineEditor');
  };

  const handleCanvasImageEditorSave = () => {
    setCurrentScreen('customRoutineEditor');
  };

  const handleCustomImageSelected = (routineId: string, imageId: string) => {
    setSelectedCustomRoutineId(routineId);
    setSelectedCustomImageId(imageId);
    setCurrentScreen('customRoutineViewer');
    setShowCalibrationImage(false);
    setShowCardImage(false);
    setCardImageVisible(false);
    setSequenceCompleted(false);
    
    const saved = localStorage.getItem('imageTransform');
    if (!saved) {
      setIsInlineCalibration(true);
    } else {
      setIsInlineCalibration(false);
    }
  };

  const handleBackToHome = () => {
    setCurrentScreen('home');
    setShowCalibrationImage(false);
    setShowCardImage(false);
    setCardImageVisible(false);
  };

  const handleBackToSettings = () => {
    setCurrentScreen('settingsHome');
  };

  const handleImageCalibrationClick = () => {
    setCurrentScreen('calibration');
  };

  const handleCardSettingsClick = () => {
    setCurrentScreen('cardSettings');
  };

  const handleCalibrationComplete = (newTransform: ImageTransform) => {
    setTransform(newTransform);
    setCurrentScreen('viewer');
  };

  const handleCardSelected = (card: string) => {
    console.log('Selected card:', card);
    setSelectedCard(card);
    setCurrentScreen('cardViewer');
    setShowCalibrationImage(false);
    setShowCardImage(false);
    setCardImageVisible(false);
    setSequenceCompleted(false); // Reset sequence state
    
    // Check if calibration has been done before
    const saved = localStorage.getItem('imageTransform');
    if (!saved) {
      // No previous calibration - enable inline calibration
      setIsInlineCalibration(true);
    } else {
      // Previous calibration exists - no inline calibration needed
      setIsInlineCalibration(false);
    }
  };

  const handleNumberSelected = (number: string) => {
    console.log('Selected number:', number);
    setSelectedCard(number);
    setCurrentScreen('numberViewer');
    setShowCalibrationImage(false);
    setShowCardImage(false);
    setCardImageVisible(false);
    setSequenceCompleted(false); // Reset sequence state
    
    // Check if calibration has been done before
    const saved = localStorage.getItem('imageTransform');
    if (!saved) {
      // No previous calibration - enable inline calibration
      setIsInlineCalibration(true);
    } else {
      // Previous calibration exists - no inline calibration needed
      setIsInlineCalibration(false);
    }
  };

  const handleEspSelected = (shape: string) => {
    console.log('Selected ESP shape:', shape);
    console.log('Setting screen to espViewer');
    setSelectedCard(shape);
    setCurrentScreen('espViewer');
    setShowCalibrationImage(false);
    setShowCardImage(false);
    setCardImageVisible(false);
    setSequenceCompleted(false); // Reset sequence state
    
    // Check if calibration has been done before
    const saved = localStorage.getItem('imageTransform');
    if (!saved) {
      // No previous calibration - enable inline calibration
      setIsInlineCalibration(true);
    } else {
      // Previous calibration exists - no inline calibration needed
      setIsInlineCalibration(false);
    }
  };

  const handleScreenPress = (e: React.TouchEvent | React.MouseEvent) => {
    // Don't handle screen press if clicking on the Done button or sequence is completed
    if ((e.target as HTMLElement).closest('button') || sequenceCompleted) {
      return;
    }
    
    e.preventDefault();
    e.stopPropagation();
    
    const currentTime = Date.now();
    const timeSinceLastTap = currentTime - lastTapTime;
    
    // Prevent rapid taps (debounce)
    if (timeSinceLastTap < 300) {
      return;
    }
    
    setLastTapTime(currentTime);
    
    console.log('Screen press detected, current state:', { showCalibrationImage, showCardImage, isInlineCalibration });
    
    if (currentScreen === 'cardViewer' || currentScreen === 'numberViewer' || currentScreen === 'espViewer' || currentScreen === 'customRoutineViewer') {
      // Handle initial tap for inline calibration (browser mode)
      if (isInlineCalibration && !showCalibrationImage && !showCardImage) {
        console.log('Initial tap: showing calibration image for inline calibration');
        setShowCalibrationImage(true);
        return;
      }
      
      // Handle normal flow for PWA mode
      if (!isInlineCalibration) {
        if (!showCalibrationImage && !showCardImage) {
          // First press: show calibration image
          console.log('First press: showing calibration image');
          setShowCalibrationImage(true);
          return;
        }
        
        if (showCalibrationImage && !showCardImage) {
          // Second press: hide calibration, show card after configured delay
          console.log('Second press: hiding calibration, starting card sequence');
          setShowCalibrationImage(false);
          setShowCardImage(true);
          
          // Show card image after configured delay with fade-in
          setTimeout(() => {
            setCardImageVisible(true);
            
            // Hide card image after fade-out delay
            setTimeout(() => {
              setCardImageVisible(false);
              // After fade-out animation completes, handle redirect
              setTimeout(() => {
                setShowCardImage(false);
                setSequenceCompleted(true); // Mark sequence as completed
                // Handle redirect based on current settings (reload from localStorage)
                const currentCardSettings = localStorage.getItem('cardAnimationSettings');
                const parsedSettings = currentCardSettings ? JSON.parse(currentCardSettings) : cardSettings;
                
                const saved = localStorage.getItem('imageTransform');
                if (saved) {
                  // Calibration has been done - follow card settings
                  if (parsedSettings.enableRedirect && parsedSettings.redirectUrl) {
                    const redirectDelay = parsedSettings.redirectDelay * 1000;
                    console.log(`Starting redirect countdown with ${redirectDelay / 1000} second delay...`);
                    setTimeout(() => {
                      console.log('Redirecting to:', parsedSettings.redirectUrl);
                      window.location.href = parsedSettings.redirectUrl;
                    }, redirectDelay);
                  }
                } else {
                  // No calibration done - redirect by default (browser mode)
                  console.log('No calibration found, redirecting by default...');
                  setTimeout(() => {
                    window.location.href = parsedSettings.redirectUrl;
                  }, 5000);
                }
              }, 500);
            }, cardSettings.fadeOutDelay * 1000);
          }, cardSettings.delay * 1000);
        }
      }
    }
  };

  const handleCalibrationDone = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('Calibration Done button clicked');
    localStorage.setItem('imageTransform', JSON.stringify(transform));
    setIsInlineCalibration(false);
    setShowCalibrationImage(false);
    
    // Start card sequence immediately after calibration is done
    setShowCardImage(true);
    
    // Show card image after configured delay with fade-in
    setTimeout(() => {
      setCardImageVisible(true);
      
      // Hide card image after fade-out delay
      setTimeout(() => {
        setCardImageVisible(false);
        // After fade-out animation completes, handle redirect
        setTimeout(() => {
          setShowCardImage(false);
          setSequenceCompleted(true); // Mark sequence as completed
          // Handle redirect based on current settings (reload from localStorage)
          const currentCardSettings = localStorage.getItem('cardAnimationSettings');
          const parsedSettings = currentCardSettings ? JSON.parse(currentCardSettings) : cardSettings;
          
          if (parsedSettings.enableRedirect && parsedSettings.redirectUrl) {
            const redirectDelay = parsedSettings.redirectDelay * 1000;
            console.log(`Starting redirect countdown with ${redirectDelay / 1000} second delay after calibration...`);
            setTimeout(() => {
              console.log('Redirecting to:', parsedSettings.redirectUrl);
              window.location.href = parsedSettings.redirectUrl;
            }, redirectDelay);
          }
        }, 500);
      }, cardSettings.fadeOutDelay * 1000);
    }, cardSettings.delay * 1000);
  };

  const handleReset = () => {
    localStorage.removeItem('imageTransform');
    setTransform({ x: 50, y: 50, scale: 1, rotation: 0 });
    setCurrentScreen('calibration');
    toast({
      title: "Reset Complete",
      description: "Back to calibration mode. Adjust your image and save again.",
    });
  };

  const getAnimationClass = () => {
    return cardImageVisible ? 'opacity-100' : 'opacity-0';
  };

  const convertTouchList = (touchList: React.TouchList): Array<{clientX: number, clientY: number}> => {
    const result: Array<{clientX: number, clientY: number}> = [];
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

  const getTouchDistance = (touches: Array<{clientX: number, clientY: number}>) => {
    if (touches.length < 2) return 0;
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const getTouchCenter = (touches: Array<{clientX: number, clientY: number}>) => {
    if (touches.length === 1) {
      return { x: touches[0].clientX, y: touches[0].clientY };
    }
    const x = (touches[0].clientX + touches[1].clientX) / 2;
    const y = (touches[0].clientY + touches[1].clientY) / 2;
    return { x, y };
  };

  const handleInlineCalibrationTouchStart = (e: React.TouchEvent) => {
    if (!isInlineCalibration || !showCalibrationImage) return;
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

  const handleInlineCalibrationTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !isInlineCalibration || touchStartRef.current.touches.length === 0) return;
    
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

  const handleInlineCalibrationTouchEnd = (e: React.TouchEvent) => {
    if (!isInlineCalibration) return;
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    touchStartRef.current = { touches: [], transform: { x: 0, y: 0, scale: 1, rotation: 0 } };
  };

  const handleInlineCalibrationMouseDown = (e: React.MouseEvent) => {
    if (!isInlineCalibration || !showCalibrationImage) return;
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    
    mouseStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      transform: { ...transform }
    };
  };

  const handleInlineCalibrationMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !isInlineCalibration) return;
    
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

  const handleInlineCalibrationMouseUp = (e: React.MouseEvent) => {
    if (!isInlineCalibration) return;
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleInlineCalibrationWheel = (e: React.WheelEvent) => {
    if (!isInlineCalibration || !showCalibrationImage) return;
    e.preventDefault();
    e.stopPropagation();
    
    const scaleChange = e.deltaY > 0 ? 0.9 : 1.1;
    setTransform(prev => ({
      ...prev,
      scale: Math.max(0.5, Math.min(3, prev.scale * scaleChange))
    }));
  };

  const showInitialCalibrationTap = isInlineCalibration && !showCalibrationImage && !showCardImage;

  if (currentScreen === 'home') {
    return (
      <>
        <OfflineIndicator />
        <HomePage 
          onSettingsClick={handleSettingsClick}
          onCardsClick={handleCardsClick}
          onNumbersClick={handleNumbersClick}
          onEspClick={handleEspClick}
          onCustomRoutineClick={handleCustomRoutineClick}
        />
      </>
    );
  }

  if (currentScreen === 'settingsHome') {
    return (
      <>
        <OfflineIndicator />
        <SettingsHome 
          onBackToHome={handleBackToHome}
          onImageCalibrationClick={handleImageCalibrationClick}
          onCardSettingsClick={handleCardSettingsClick}
          onCustomRoutineBuilderClick={handleCustomRoutineBuilderClick}
        />
      </>
    );
  }

  if (currentScreen === 'cardSettings') {
    return (
      <>
        <OfflineIndicator />
        <CardSettings onBackToSettings={handleBackToSettings} />
      </>
    );
  }

  if (currentScreen === 'cardSelection') {
    return (
      <>
        <OfflineIndicator />
        <CardSelection onBackToHome={handleBackToHome} onCardSelected={handleCardSelected} />
      </>
    );
  }

  if (currentScreen === 'numberSelection') {
    return (
      <>
        <OfflineIndicator />
        <NumberSelection onBackToHome={handleBackToHome} onNumberSelected={handleNumberSelected} />
      </>
    );
  }

  if (currentScreen === 'espSelection') {
    console.log('Rendering ESP selection screen');
    return (
      <>
        <OfflineIndicator />
        <EspSelection onBackToHome={handleBackToHome} onEspSelected={handleEspSelected} />
      </>
    );
  }

  if (currentScreen === 'calibration') {
    return (
      <>
        <OfflineIndicator />
        <CalibrationMode 
          onBackToHome={handleBackToSettings}
          onCalibrationComplete={handleCalibrationComplete}
        />
      </>
    );
  }

  if (currentScreen === 'cardViewer' || currentScreen === 'numberViewer' || currentScreen === 'espViewer' || currentScreen === 'customRoutineViewer') {
    const isNumberViewer = currentScreen === 'numberViewer';
    const isEspViewer = currentScreen === 'espViewer';
    const isCustomViewer = currentScreen === 'customRoutineViewer';
    
    let imageSource = '';
    let altText = '';
    
    if (isCustomViewer) {
      const saved = localStorage.getItem('customRoutines');
      if (saved) {
        const routines = JSON.parse(saved);
        const routine = routines.find((r: any) => r.id === selectedCustomRoutineId);
        const image = routine?.images.find((img: any) => img.id === selectedCustomImageId);
        imageSource = image?.data || '';
        altText = `Custom image ${image?.name || 'Unknown'}`;
      }
    } else {
      imageSource = isNumberViewer ? `/${selectedCard}.png` : isEspViewer ? `/esp-${selectedCard.toLowerCase()}.png` : `/${selectedCard}.png`;
      altText = isNumberViewer ? `Selected number ${selectedCard}` : isEspViewer ? `Selected ESP shape ${selectedCard}` : `Selected card ${selectedCard}`;
    }

    return (
      <>
        <OfflineIndicator />
        <div 
          className="fixed inset-0 bg-white overflow-hidden select-none cursor-pointer"
          style={{ touchAction: 'none' }}
          onTouchStart={handleScreenPress}
          onMouseDown={handleScreenPress}
          onMouseMove={isInlineCalibration ? handleInlineCalibrationMouseMove : undefined}
          onMouseUp={isInlineCalibration ? handleInlineCalibrationMouseUp : undefined}
          onMouseLeave={isInlineCalibration ? handleInlineCalibrationMouseUp : undefined}
        >
          {/* Initial tap instruction for browser calibration */}
          {showInitialCalibrationTap && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-gray-600 p-8">
                <p className="text-lg mb-2">Tap anywhere to start calibration</p>
                <p className="text-sm text-gray-500">Position and resize the image for your display</p>
              </div>
            </div>
          )}

          {showCalibrationImage && (
            <>
              <div
                className={`absolute transition-transform duration-75 ${isInlineCalibration ? 'cursor-move' : ''}`}
                style={{
                  left: `${transform.x}%`,
                  top: `${transform.y}%`,
                  transform: `translate(-50%, -50%) scale(${transform.scale}) rotate(${transform.rotation}deg)`,
                  touchAction: isInlineCalibration ? 'none' : 'none'
                }}
                onMouseDown={isInlineCalibration ? handleInlineCalibrationMouseDown : undefined}
                onTouchStart={isInlineCalibration ? handleInlineCalibrationTouchStart : undefined}
                onTouchMove={isInlineCalibration ? handleInlineCalibrationTouchMove : undefined}
                onTouchEnd={isInlineCalibration ? handleInlineCalibrationTouchEnd : undefined}
                onWheel={isInlineCalibration ? handleInlineCalibrationWheel : undefined}
              >
                <img
                  src="/lovable-uploads/fb48c938-2940-4eb3-9c87-b96208ff058f.png"
                  alt="Calibration image"
                  className="max-w-none object-cover rounded-lg shadow-lg pointer-events-none"
                  style={{
                    width: '216px',
                    height: '342.4px'
                  }}
                  draggable={false}
                />
                
                {isInlineCalibration && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                )}
              </div>
              {isInlineCalibration && (
                <div className="fixed bottom-4 right-4 z-10 flex gap-2">
                  <Button
                    onClick={handleCalibrationDone}
                    variant="default"
                    size="lg"
                    className="bg-black hover:bg-gray-800 text-white px-8 py-4 rounded-xl shadow-lg"
                  >
                    Done
                  </Button>
                </div>
              )}
            </>
          )}

          {showCardImage && (
            <div
              className={`absolute transition-all duration-1000 ${getAnimationClass()}`}
              style={{
                left: `${transform.x}%`,
                top: `${transform.y}%`,
                transform: `translate(-50%, -50%) scale(${transform.scale}) rotate(${transform.rotation}deg)`,
                touchAction: 'none'
              }}
            >
              <img
                src={imageSource}
                alt={altText}
                className="max-w-none object-cover rounded-lg shadow-lg pointer-events-none"
                style={{
                  width: '216px',
                  height: '342.4px'
                }}
                draggable={false}
              />
            </div>
          )}
        </div>
      </>
    );
  }

  if (currentScreen === 'customRoutineManager') {
    return (
      <>
        <OfflineIndicator />
        <CustomRoutineManager
          onBackToSettings={handleCustomRoutineManagerBack}
          onEditRoutine={handleEditRoutine}
        />
      </>
    );
  }

  if (currentScreen === 'customRoutineEditor') {
    return (
      <>
        <OfflineIndicator />
        <CustomRoutineEditor
          routineId={selectedCustomRoutineId}
          onBack={handleCustomRoutineEditorBack}
          onEditImage={handleEditImage}
        />
      </>
    );
  }

  if (currentScreen === 'customRoutineSelection') {
    return (
      <>
        <OfflineIndicator />
        <CustomRoutineSelection
          routineId={selectedCustomRoutineId}
          onBack={handleBackToHome}
          onImageSelected={handleCustomImageSelected}
        />
      </>
    );
  }

  if (currentScreen === 'canvasImageEditor') {
    return (
      <>
        <OfflineIndicator />
        <CanvasImageEditor
          routineId={selectedCustomRoutineId}
          imageId={selectedCustomImageId || undefined}
          templateData={canvasTemplateData || undefined}
          onBack={handleCanvasImageEditorBack}
          onSave={handleCanvasImageEditorSave}
        />
      </>
    );
  }

  return (
    <>
      <OfflineIndicator />
      <div 
        className="fixed inset-0 bg-white overflow-hidden select-none"
        style={{ touchAction: 'none' }}
      >
        <div
          className="absolute transition-transform duration-75"
          style={{
            left: `${transform.x}%`,
            top: `${transform.y}%`,
            transform: `translate(-50%, -50%) scale(${transform.scale}) rotate(${transform.rotation}deg)`,
            touchAction: 'none'
          }}
        >
          <img
            src="/lovable-uploads/fb48c938-2940-4eb3-9c87-b96208ff058f.png"
            alt="Display image"
            className="max-w-none object-cover rounded-lg shadow-lg pointer-events-none"
            style={{
              width: '216px',
              height: '342.4px'
            }}
            draggable={false}
          />
        </div>

        <div className="fixed top-4 left-4 z-10">
          <Button
            onClick={handleBackToSettings}
            variant="secondary"
            size="sm"
            className="rounded-full shadow-lg"
          >
            Back to Settings
          </Button>
        </div>
        
        <div className="fixed bottom-4 right-4 z-10">
          <Button
            onClick={handleReset}
            variant="secondary"
            size="sm"
            className="rounded-full shadow-lg"
          >
            Recalibrate
          </Button>
        </div>
      </div>
    </>
  );
};

export default ImageEditor;
