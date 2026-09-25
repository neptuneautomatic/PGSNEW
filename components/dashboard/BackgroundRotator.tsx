'use client';

import React from 'react';
import { useBackground } from '@/context/BackgroundContext';
import BackgroundSettingsModal from './BackgroundSettingsModal';

export default function BackgroundRotator() {
  const { images, currentIndex, settings } = useBackground();

  return (
    <>
      {/* 5 Rotating Background Images Layer Fixed in Viewport */}
      <div className="absolute inset-0 pointer-events-none select-none z-0 overflow-hidden w-full h-full">
        {images.map((img, idx) => {
          const isVisible = idx === currentIndex;
          return (
            <div
              key={idx}
              className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ease-in-out transform ${
                isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'
              }`}
              style={{
                backgroundImage: `url(${img})`,
                transitionProperty: 'opacity, transform',
                transitionDuration: '1000ms',
              }}
            />
          );
        })}

        {/* Semi-transparent Frost Tint Overlay & Backdrop Filter for high table/card readability */}
        <div
          className="absolute inset-0 bg-slate-950 transition-all duration-500"
          style={{
            opacity: settings.overlayOpacity ?? 0.65,
            backdropFilter: (settings.blurAmount ?? 2) > 0 ? `blur(${settings.blurAmount}px)` : 'none',
            WebkitBackdropFilter: (settings.blurAmount ?? 2) > 0 ? `blur(${settings.blurAmount}px)` : 'none',
          }}
        />

        {/* Subtle radial vignette gradient to highlight the central dashboard area */}
        <div className="absolute inset-0 bg-radial from-transparent via-black/20 to-black/60 pointer-events-none" />
      </div>

      {/* Global Background Settings & Upload Modal */}
      <BackgroundSettingsModal />
    </>
  );
}
