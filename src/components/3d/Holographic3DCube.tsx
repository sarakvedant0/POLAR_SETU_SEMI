import React, { useState, useRef, useEffect, useCallback } from 'react';

interface Holographic3DCubeProps {
  icon: React.ComponentType<{ className?: string }>;
  size?: number; // width & height in px
  label?: string;
  category?: string;
  isHovered?: boolean;
  isActive?: boolean;
  color?: string;
  enableDrag?: boolean;
  autoRotateSpeed?: number; // seconds per 360 rotation (default: 12)
  className?: string;
  onClick?: () => void;
  onHoverChange?: (hovered: boolean) => void;
}

export const Holographic3DCube: React.FC<Holographic3DCubeProps> = ({
  icon: Icon,
  size = 64,
  label,
  isHovered = false,
  isActive = false,
  color = '#38bdf8',
  enableDrag = true,
  autoRotateSpeed = 12,
  className = '',
  onClick,
  onHoverChange,
}) => {
  // Manual drag rotation states
  const [isDragging, setIsDragging] = useState(false);
  const [manualRotation, setManualRotation] = useState<{ x: number; y: number }>({ x: 14, y: 0 });
  const [autoAngle, setAutoAngle] = useState(0);
  const lastPointer = useRef<{ x: number; y: number } | null>(null);
  const animFrameId = useRef<number | null>(null);
  const lastTime = useRef<number>(performance.now());
  const hoveredInternal = useRef(false);

  // Live continuous 360 rotation loop
  useEffect(() => {
    let currentY = 0;
    const speedDegPerMs = 360 / (autoRotateSpeed * 1000);

    const loop = (now: number) => {
      const dt = now - lastTime.current;
      lastTime.current = now;

      if (!isDragging) {
        // Increment live continuous 360 angle
        currentY = (currentY + dt * speedDegPerMs) % 360;
        setAutoAngle(currentY);
      }

      animFrameId.current = requestAnimationFrame(loop);
    };

    lastTime.current = performance.now();
    animFrameId.current = requestAnimationFrame(loop);

    return () => {
      if (animFrameId.current) {
        cancelAnimationFrame(animFrameId.current);
      }
    };
  }, [isDragging, autoRotateSpeed]);

  // Pointer drag event handlers for 360 manual inspection
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (!enableDrag) return;
    setIsDragging(true);
    lastPointer.current = { x: e.clientX, y: e.clientY };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }, [enableDrag]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging || !lastPointer.current) return;
    const dx = e.clientX - lastPointer.current.x;
    const dy = e.clientY - lastPointer.current.y;
    lastPointer.current = { x: e.clientX, y: e.clientY };

    setManualRotation((prev) => ({
      x: Math.max(-65, Math.min(65, prev.x - dy * 0.5)),
      y: (prev.y + dx * 0.6) % 360,
    }));
  }, [isDragging]);

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    if (isDragging) {
      setIsDragging(false);
      lastPointer.current = null;
      try {
        (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {
        // safely ignore
      }
    }
  }, [isDragging]);

  const currentRotationX = isDragging ? manualRotation.x : 14;
  const currentRotationY = isDragging ? manualRotation.y : (autoAngle + manualRotation.y) % 360;

  // Proportional 3D cube dimensions: fits neatly inside the reticle boundary
  const cubeDim = Math.max(26, Math.round(size * 0.72));
  const halfSize = cubeDim / 2;
  const activeGlow = isHovered || isActive;

  return (
    <div
      className={`relative select-none flex items-center justify-center cursor-pointer group ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
      }}
      onClick={onClick}
      onMouseEnter={() => {
        hoveredInternal.current = true;
        onHoverChange?.(true);
      }}
      onMouseLeave={() => {
        hoveredInternal.current = false;
        onHoverChange?.(false);
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      title={label ? `${label} (Live 360° Interactive Block)` : 'Live 360° Block'}
    >
      {/* =========================================================
          1. HOLOGRAPHIC GROUND RETICLE & ORBITAL PULSE RINGS
      ========================================================= */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: `${size * 1.12}px`,
          height: `${size * 1.12}px`,
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%) rotateX(72deg) translateZ(-6px)',
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Soft Radial Ambient Cyan Ground Light */}
        <div
          className="absolute inset-0 rounded-full blur-sm transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle, ${color}66 0%, ${color}22 45%, transparent 75%)`,
            opacity: activeGlow ? 1 : 0.75,
          }}
        />

        {/* Outer Cyan Dashed Orbital Ring (Smooth Reverse Spin) */}
        <div
          className="absolute inset-0 rounded-full border border-dashed animate-ground-ring"
          style={{
            borderColor: activeGlow ? '#38bdf8' : 'rgba(56, 189, 248, 0.5)',
            borderWidth: '1.5px',
          }}
        />

        {/* Concentric Inner Ring */}
        <div
          className="absolute inset-2 rounded-full border"
          style={{
            borderColor: activeGlow ? 'rgba(34, 211, 238, 0.9)' : 'rgba(34, 211, 238, 0.45)',
            boxShadow: activeGlow ? '0 0 12px rgba(34, 211, 238, 0.8)' : 'none',
          }}
        />

        {/* Concentric Pulsing Ripple */}
        <div
          className="absolute inset-1.5 rounded-full border border-cyan-400/40 animate-ping opacity-35"
        />

        {/* Crosshair Cardinal Ticks */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-1.5 bg-cyan-300/80" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0.5 h-1.5 bg-cyan-300/80" />
        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 w-1.5 bg-cyan-300/80" />
        <div className="absolute right-0 top-1/2 -translate-y-1/2 h-0.5 w-1.5 bg-cyan-300/80" />
      </div>

      {/* =========================================================
          2. 3D PRESERVE-3D ROTATING CUBE ENGINE
      ========================================================= */}
      <div
        className="preserve-3d relative flex items-center justify-center transition-transform duration-75"
        style={{
          width: `${cubeDim}px`,
          height: `${cubeDim}px`,
          perspective: '1000px',
        }}
      >
        <div
          className="preserve-3d relative w-full h-full flex items-center justify-center"
          style={{
            transform: `rotateX(${currentRotationX}deg) rotateY(${currentRotationY}deg)`,
            transformOrigin: 'center center',
          }}
        >
          {/* Inner Glowing Holographic Luminous Orb */}
          <div
            className="absolute rounded-full pointer-events-none"
            style={{
              width: `${cubeDim * 0.45}px`,
              height: `${cubeDim * 0.45}px`,
              transform: 'translateZ(0)',
              background: `radial-gradient(circle, #ffffff 0%, ${color} 50%, transparent 85%)`,
              boxShadow: `0 0 ${activeGlow ? '32px' : '18px'} ${color}`,
              filter: 'blur(2px)',
              opacity: activeGlow ? 0.9 : 0.7,
            }}
          />

          {/* FACE 1: FRONT */}
          <div
            className="absolute inset-0 flex items-center justify-center backdrop-blur-xs transition-colors duration-200"
            style={{
              transform: `translateZ(${halfSize}px)`,
              background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.28) 0%, rgba(14, 116, 144, 0.12) 60%, rgba(3, 105, 161, 0.32) 100%)',
              border: `1.5px solid ${activeGlow ? '#7dd3fc' : 'rgba(56, 189, 248, 0.85)'}`,
              boxShadow: `inset 0 0 16px rgba(34, 211, 238, 0.35), 0 0 ${activeGlow ? '20px' : '10px'} rgba(34, 211, 238, 0.4)`,
            }}
          >
            <Icon className="w-1/2 h-1/2 text-cyan-100 drop-shadow-[0_0_8px_rgba(34,211,238,0.9)]" />
            <div className="absolute top-1 left-1 w-1.5 h-1.5 border-t border-l border-cyan-200" />
            <div className="absolute top-1 right-1 w-1.5 h-1.5 border-t border-r border-cyan-200" />
            <div className="absolute bottom-1 left-1 w-1.5 h-1.5 border-b border-l border-cyan-200" />
            <div className="absolute bottom-1 right-1 w-1.5 h-1.5 border-b border-r border-cyan-200" />
          </div>

          {/* FACE 2: BACK */}
          <div
            className="absolute inset-0 flex items-center justify-center backdrop-blur-xs transition-colors duration-200"
            style={{
              transform: `rotateY(180deg) translateZ(${halfSize}px)`,
              background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.25) 0%, rgba(14, 116, 144, 0.1) 60%, rgba(3, 105, 161, 0.28) 100%)',
              border: `1.5px solid ${activeGlow ? '#7dd3fc' : 'rgba(56, 189, 248, 0.8)'}`,
              boxShadow: `inset 0 0 16px rgba(34, 211, 238, 0.3), 0 0 ${activeGlow ? '20px' : '10px'} rgba(34, 211, 238, 0.35)`,
            }}
          >
            <Icon className="w-1/2 h-1/2 text-cyan-100 drop-shadow-[0_0_8px_rgba(34,211,238,0.9)]" />
            <div className="absolute top-1 left-1 w-1.5 h-1.5 border-t border-l border-cyan-200" />
            <div className="absolute top-1 right-1 w-1.5 h-1.5 border-t border-r border-cyan-200" />
            <div className="absolute bottom-1 left-1 w-1.5 h-1.5 border-b border-l border-cyan-200" />
            <div className="absolute bottom-1 right-1 w-1.5 h-1.5 border-b border-r border-cyan-200" />
          </div>

          {/* FACE 3: RIGHT */}
          <div
            className="absolute inset-0 flex items-center justify-center backdrop-blur-xs transition-colors duration-200"
            style={{
              transform: `rotateY(90deg) translateZ(${halfSize}px)`,
              background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.32) 0%, rgba(14, 116, 144, 0.15) 60%, rgba(3, 105, 161, 0.35) 100%)',
              border: `1.5px solid ${activeGlow ? '#7dd3fc' : 'rgba(56, 189, 248, 0.85)'}`,
              boxShadow: `inset 0 0 16px rgba(34, 211, 238, 0.35), 0 0 ${activeGlow ? '20px' : '10px'} rgba(34, 211, 238, 0.4)`,
            }}
          >
            <Icon className="w-1/2 h-1/2 text-cyan-100 drop-shadow-[0_0_8px_rgba(34,211,238,0.9)]" />
            <div className="absolute top-1 left-1 w-1.5 h-1.5 border-t border-l border-cyan-200" />
            <div className="absolute top-1 right-1 w-1.5 h-1.5 border-t border-r border-cyan-200" />
            <div className="absolute bottom-1 left-1 w-1.5 h-1.5 border-b border-l border-cyan-200" />
            <div className="absolute bottom-1 right-1 w-1.5 h-1.5 border-b border-r border-cyan-200" />
          </div>

          {/* FACE 4: LEFT */}
          <div
            className="absolute inset-0 flex items-center justify-center backdrop-blur-xs transition-colors duration-200"
            style={{
              transform: `rotateY(-90deg) translateZ(${halfSize}px)`,
              background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.3) 0%, rgba(14, 116, 144, 0.14) 60%, rgba(3, 105, 161, 0.32) 100%)',
              border: `1.5px solid ${activeGlow ? '#7dd3fc' : 'rgba(56, 189, 248, 0.85)'}`,
              boxShadow: `inset 0 0 16px rgba(34, 211, 238, 0.35), 0 0 ${activeGlow ? '20px' : '10px'} rgba(34, 211, 238, 0.4)`,
            }}
          >
            <Icon className="w-1/2 h-1/2 text-cyan-100 drop-shadow-[0_0_8px_rgba(34,211,238,0.9)]" />
            <div className="absolute top-1 left-1 w-1.5 h-1.5 border-t border-l border-cyan-200" />
            <div className="absolute top-1 right-1 w-1.5 h-1.5 border-t border-r border-cyan-200" />
            <div className="absolute bottom-1 left-1 w-1.5 h-1.5 border-b border-l border-cyan-200" />
            <div className="absolute bottom-1 right-1 w-1.5 h-1.5 border-b border-r border-cyan-200" />
          </div>

          {/* FACE 5: TOP (Holographic glass top reflection) */}
          <div
            className="absolute inset-0 flex items-center justify-center backdrop-blur-xs"
            style={{
              transform: `rotateX(90deg) translateZ(${halfSize}px)`,
              background: 'linear-gradient(180deg, rgba(186, 230, 253, 0.45) 0%, rgba(56, 189, 248, 0.25) 50%, rgba(14, 116, 144, 0.35) 100%)',
              border: `1.5px solid ${activeGlow ? '#bae6fd' : 'rgba(125, 211, 252, 0.9)'}`,
              boxShadow: 'inset 0 0 20px rgba(186, 230, 253, 0.4)',
            }}
          >
            {/* Diamond holographic lattice */}
            <div className="w-1/2 h-1/2 border border-cyan-200/60 rotate-45" />
          </div>

          {/* FACE 6: BOTTOM (Emissive floor projection) */}
          <div
            className="absolute inset-0 flex items-center justify-center backdrop-blur-xs"
            style={{
              transform: `rotateX(-90deg) translateZ(${halfSize}px)`,
              background: 'rgba(3, 105, 161, 0.45)',
              border: '1.5px solid rgba(56, 189, 248, 0.7)',
              boxShadow: '0 0 25px rgba(34, 211, 238, 0.7)',
            }}
          />
        </div>
      </div>
    </div>
  );
};
