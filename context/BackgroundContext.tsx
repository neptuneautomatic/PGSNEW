'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export interface BackgroundRotatorSettings {
  intervalSeconds: number;
  mode: 'sequence' | 'shuffled';
  isPaused: boolean;
  overlayOpacity: number; // 0.0 to 0.95
  blurAmount: number; // 0 to 16 px
}

interface BackgroundContextType {
  images: string[];
  currentIndex: number;
  settings: BackgroundRotatorSettings;
  isModalOpen: boolean;
  nextImage: () => void;
  prevImage: () => void;
  setImageIndex: (index: number) => void;
  uploadImages: (files: FileList | File[]) => Promise<{ success: boolean; count: number; error?: string }>;
  removeImage: (index: number) => void;
  resetToDefaults: () => void;
  updateSettings: (newSettings: Partial<BackgroundRotatorSettings>) => void;
  setIsModalOpen: (open: boolean) => void;
}

// 5 High quality curated default parking & smart facility wallpapers
export const DEFAULT_BACKGROUND_IMAGES: string[] = [
  'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=2000&q=80', // Illuminated smart parking garage
  'https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=2000&q=80', // Multi-tier parking architecture
  'https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?auto=format&fit=crop&w=2000&q=80', // Neon smart garage night view
  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2000&q=80', // Futuristic glass commercial architecture
  'https://images.unsplash.com/photo-1545178803-4056771d60a3?auto=format&fit=crop&w=2000&q=80', // Modern transportation terminal
];

const DEFAULT_SETTINGS: BackgroundRotatorSettings = {
  intervalSeconds: 5,
  mode: 'sequence',
  isPaused: false,
  overlayOpacity: 0.68,
  blurAmount: 2,
};

const BackgroundContext = createContext<BackgroundContextType | undefined>(undefined);

// Helper function to compress uploaded images via Canvas to avoid localStorage quota limits
async function compressImage(file: File, maxWidth = 1600, maxHeight = 1000, quality = 0.8): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.onerror = () => reject(new Error('Failed to load image for compression'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

export function BackgroundProvider({ children }: { children: React.ReactNode }) {
  const [images, setImages] = useState<string[]>(DEFAULT_BACKGROUND_IMAGES);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [settings, setSettings] = useState<BackgroundRotatorSettings>(DEFAULT_SETTINGS);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  // Load saved settings & images from localStorage on client mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedImgs = localStorage.getItem('pgs_bg_rotator_images');
        if (savedImgs) {
          const parsed = JSON.parse(savedImgs);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setImages(parsed);
          }
        }

        const savedSettings = localStorage.getItem('pgs_bg_rotator_settings');
        if (savedSettings) {
          const parsedSettings = JSON.parse(savedSettings);
          setSettings((prev) => ({
            ...prev,
            ...parsedSettings,
            intervalSeconds: parsedSettings.intervalSeconds === 10 ? 5 : (parsedSettings.intervalSeconds || 5),
          }));
        } else {
          setSettings((prev) => ({ ...prev, intervalSeconds: 5 }));
        }
      } catch (err) {
        console.warn('Failed to parse saved background settings:', err);
      } finally {
        setIsLoaded(true);
      }
    }
  }, []);

  // Save changes to localStorage
  const saveImagesToStorage = (newImages: string[]) => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('pgs_bg_rotator_images', JSON.stringify(newImages));
      } catch (err) {
        console.warn('Unable to persist images to localStorage:', err);
      }
    }
  };

  const saveSettingsToStorage = (newSettings: BackgroundRotatorSettings) => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('pgs_bg_rotator_settings', JSON.stringify(newSettings));
      } catch (err) {
        console.warn('Unable to persist settings to localStorage:', err);
      }
    }
  };

  const updateSettings = useCallback((partial: Partial<BackgroundRotatorSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...partial };
      saveSettingsToStorage(updated);
      return updated;
    });
  }, []);

  // Navigation handlers
  const nextImage = useCallback(() => {
    if (images.length <= 1) return;
    if (settings.mode === 'shuffled') {
      let nextIdx = Math.floor(Math.random() * images.length);
      if (nextIdx === currentIndex) {
        nextIdx = (nextIdx + 1) % images.length;
      }
      setCurrentIndex(nextIdx);
    } else {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }
  }, [images.length, settings.mode, currentIndex]);

  const prevImage = useCallback(() => {
    if (images.length <= 1) return;
    if (settings.mode === 'shuffled') {
      let nextIdx = Math.floor(Math.random() * images.length);
      if (nextIdx === currentIndex) {
        nextIdx = (nextIdx - 1 + images.length) % images.length;
      }
      setCurrentIndex(nextIdx);
    } else {
      setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    }
  }, [images.length, settings.mode, currentIndex]);

  const setImageIndex = useCallback((index: number) => {
    if (index >= 0 && index < images.length) {
      setCurrentIndex(index);
    }
  }, [images.length]);

  // Upload user images (4-5 images support)
  const uploadImages = useCallback(async (files: FileList | File[]): Promise<{ success: boolean; count: number; error?: string }> => {
    const fileArray = Array.from(files).filter((f) => f.type.startsWith('image/'));
    if (fileArray.length === 0) {
      return { success: false, count: 0, error: 'No valid image files provided.' };
    }

    try {
      const compressedUrls: string[] = [];
      for (const file of fileArray) {
        const compressed = await compressImage(file);
        compressedUrls.push(compressed);
      }

      setImages((prev) => {
        // If current images are default, replace with uploaded images so user sees their own uploads directly
        const isCurrentlyDefault = prev.length === DEFAULT_BACKGROUND_IMAGES.length && 
          prev.every((img, i) => img === DEFAULT_BACKGROUND_IMAGES[i]);
        
        const baseList = isCurrentlyDefault ? [] : prev;
        const updated = [...baseList, ...compressedUrls].slice(-10); // Keep max 10 images
        saveImagesToStorage(updated);
        return updated;
      });

      return { success: true, count: compressedUrls.length };
    } catch (err: any) {
      return { success: false, count: 0, error: err?.message || 'Error processing images' };
    }
  }, []);

  const removeImage = useCallback((index: number) => {
    setImages((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      const finalImages = updated.length > 0 ? updated : DEFAULT_BACKGROUND_IMAGES;
      saveImagesToStorage(finalImages);
      return finalImages;
    });
    setCurrentIndex((prev) => (prev >= index ? Math.max(0, prev - 1) : prev));
  }, []);

  const resetToDefaults = useCallback(() => {
    setImages(DEFAULT_BACKGROUND_IMAGES);
    setCurrentIndex(0);
    saveImagesToStorage(DEFAULT_BACKGROUND_IMAGES);
  }, []);

  // Auto-rotation timer hook
  useEffect(() => {
    if (!isLoaded || settings.isPaused || images.length <= 1) return;

    const intervalMs = Math.max(2, settings.intervalSeconds) * 1000;
    const timer = setInterval(() => {
      nextImage();
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isLoaded, settings.isPaused, settings.intervalSeconds, images.length, nextImage]);

  return (
    <BackgroundContext.Provider
      value={{
        images,
        currentIndex,
        settings,
        isModalOpen,
        nextImage,
        prevImage,
        setImageIndex,
        uploadImages,
        removeImage,
        resetToDefaults,
        updateSettings,
        setIsModalOpen,
      }}
    >
      {children}
    </BackgroundContext.Provider>
  );
}

export function useBackground() {
  const context = useContext(BackgroundContext);
  if (!context) {
    throw new Error('useBackground must be used within a BackgroundProvider');
  }
  return context;
}
