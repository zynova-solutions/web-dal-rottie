
"use client";
import React, { useRef, useState } from "react";
import Image from "next/image";

interface Dish {
  id?: string | number;
  name: string;
  image?: string;
  price: number;
  likes?: number;
  description?: string;
}

interface Props {
  dishes: Dish[];
  onAddToCart?: (dish: Dish) => void;
}

export default function SpecialtiesScroller({ dishes, onAddToCart }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [failedImages, setFailedImages] = useState<{ [key: string]: boolean }>({});

  // Mouse drag handlers
  const onMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX - (scrollRef.current?.offsetLeft || 0));
    setScrollLeft(scrollRef.current?.scrollLeft || 0);
  };
  const onMouseLeave = () => setIsDragging(false);
  const onMouseUp = () => setIsDragging(false);
  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - (scrollRef.current?.offsetLeft || 0);
    const walk = (x - startX) * 1.2; // scroll speed
    if (scrollRef.current) scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  // Button scroll
  const scrollBy = (amount: number) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: amount, behavior: "smooth" });
    }
  };

  function getImgSrc(dish: Dish, idx: number) {
    // If image is missing or previously failed, use static fallback
    if (!dish.image || dish.image.trim() === '' || failedImages[String(dish.id ?? idx)]) {
      return '/images/static-fallback.jpg';
    }
    return dish.image;
  }

  function handleImgError(id: string | number | undefined) {
    if (id === undefined) return;
    setFailedImages(prev => ({ ...prev, [String(id)]: true }));
  }

  return (
    <div>
      <div className="relative">
        {/* Left button */}
        <button
          aria-label="Scroll left"
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white shadow rounded-full p-2 border border-[#e7e0d2] disabled:opacity-30"
          style={{ display: dishes.length > 0 ? undefined : "none" }}
          onClick={() => scrollBy(-200)}
          tabIndex={0}
        >
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path stroke="#7a1313" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
        </button>
        {/* Right button */}
        <button
          aria-label="Scroll right"
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white shadow rounded-full p-2 border border-[#e7e0d2] disabled:opacity-30"
          style={{ display: dishes.length > 0 ? undefined : "none" }}
          onClick={() => scrollBy(200)}
          tabIndex={0}
        >
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path stroke="#7a1313" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
        </button>
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto pb-2 no-scrollbar cursor-grab active:cursor-grabbing"
          style={{ scrollBehavior: "smooth" }}
          onMouseDown={onMouseDown}
          onMouseLeave={onMouseLeave}
          onMouseUp={onMouseUp}
          onMouseMove={onMouseMove}
        >
          {dishes.map((dish: Dish, idx: number) => (
            <div key={dish.id || idx} className="min-w-[180px] max-w-[200px] bg-white rounded-2xl shadow-lg p-3 flex flex-col items-center border border-[#f3e0e0] hover:shadow-2xl hover:-translate-y-1 transition-all duration-200 group cursor-pointer relative">
              <div className="w-full aspect-square bg-gray-100 rounded-lg overflow-hidden mb-2 flex items-center justify-center">
                <Image
                  src={getImgSrc(dish, idx)}
                  alt={dish.name}
                  width={120}
                  height={120}
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-200"
                  onError={() => {
                    // Only set fallback if not already set
                    if (!failedImages[String(dish.id ?? idx)]) {
                      handleImgError(dish.id ?? idx);
                    }
                  }}
                />
                <button
                  className="absolute bottom-2 right-2 bg-[#4a2c0a] hover:bg-[#7a1313] text-white rounded-full w-8 h-8 flex items-center justify-center shadow-md border-2 border-white z-10"
                  title="Add to cart"
                  onClick={e => {
                    e.stopPropagation();
                    if (onAddToCart) {
                      onAddToCart(dish);
                    }
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>
              <div className="flex items-center justify-between w-full mb-1">
                <div className="font-bold text-sm text-[#7a1313] truncate" title={dish.name}>{dish.name}</div>
                {dish.likes ? <span className="ml-2 text-xs text-pink-600 font-bold">♡ {dish.likes}</span> : null}
              </div>
              <div className="flex items-center justify-between w-full mb-1">
                <span className="text-base font-semibold text-[#4a2c0a]">{Number(dish.price).toFixed(2)} €</span>
              </div>
              {dish.description && <div className="text-xs text-gray-600 mt-1 text-center line-clamp-3">{dish.description}</div>}
            </div>
          ))}
          {dishes.length === 0 && (
            <div className="text-gray-400 py-8">No specialties found.</div>
          )}
        </div>
        <style jsx global>{`
          .no-scrollbar::-webkit-scrollbar { display: none; }
          .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        `}</style>
      </div>
    </div>
  );
}