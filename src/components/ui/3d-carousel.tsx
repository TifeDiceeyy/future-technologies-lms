import { useEffect, useRef, useState } from "react";

const IMAGES = [
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300&h=300&fit=crop",
  "https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=300&h=300&fit=crop",
  "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=300&h=300&fit=crop",
  "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=300&h=300&fit=crop",
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=300&h=300&fit=crop",
  "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=300&h=300&fit=crop",
  "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop",
];

const CARD_WIDTH = 220;
const CARD_HEIGHT = 280;
const CARD_GAP = 24;
const DRAG_SENSITIVITY = 0.4;

function CarouselCard({
  src,
  index,
  total,
  rotation,
}: {
  src: string;
  index: number;
  total: number;
  rotation: number;
}) {
  const angle = (index / total) * 360 + rotation;
  const radius = Math.max(280, total * 55);
  const rad = (angle * Math.PI) / 180;
  const x = Math.sin(rad) * radius;
  const z = Math.cos(rad) * radius;
  const scale = (z + radius) / (2 * radius);
  const opacity = 0.4 + scale * 0.6;

  return (
    <div
      className="absolute"
      style={{
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        transform: `translateX(${x}px) translateZ(${z}px)`,
        opacity,
        zIndex: Math.round(scale * 100),
        transition: "opacity 0.1s",
      }}
    >
      <div
        className="w-full h-full rounded-2xl overflow-hidden border border-border bg-card shadow-xl"
        style={{ transform: `scale(${0.75 + scale * 0.25})` }}
      >
        <img
          src={src}
          alt={`Learning environment ${index + 1}`}
          className="w-full h-full object-cover"
          draggable={false}
        />
      </div>
    </div>
  );
}

export default function ThreeDPhotoCarousel() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState(0);
  const isDragging = useRef(false);
  const lastX = useRef(0);
  const velocity = useRef(0);
  const animFrame = useRef<number>(0);

  const applyMomentum = () => {
    if (Math.abs(velocity.current) < 0.1) return;
    velocity.current *= 0.96;
    setRotation((r) => r + velocity.current);
    animFrame.current = requestAnimationFrame(applyMomentum);
  };

  const onPointerDown = (e: React.PointerEvent) => {
    isDragging.current = true;
    lastX.current = e.clientX;
    velocity.current = 0;
    cancelAnimationFrame(animFrame.current);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    const delta = (e.clientX - lastX.current) * DRAG_SENSITIVITY;
    velocity.current = delta;
    setRotation((r) => r + delta);
    lastX.current = e.clientX;
  };

  const onPointerUp = () => {
    isDragging.current = false;
    animFrame.current = requestAnimationFrame(applyMomentum);
  };

  useEffect(() => {
    const id = requestAnimationFrame(function autoSpin() {
      if (!isDragging.current) {
        setRotation((r) => r + 0.12);
      }
      requestAnimationFrame(autoSpin);
    });
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => () => cancelAnimationFrame(animFrame.current), []);

  return (
    <div className="relative w-full flex items-center justify-center overflow-hidden select-none py-8">
      <div
        ref={containerRef}
        className="relative cursor-grab active:cursor-grabbing"
        style={{
          width: CARD_WIDTH + CARD_GAP,
          height: CARD_HEIGHT + 60,
          perspective: 1000,
          perspectiveOrigin: "50% 50%",
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
      >
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ transformStyle: "preserve-3d" }}
        >
          {IMAGES.map((src, i) => (
            <CarouselCard
              key={src}
              src={src}
              index={i}
              total={IMAGES.length}
              rotation={rotation}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
