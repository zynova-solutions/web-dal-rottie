"use client";

import { useEffect, useRef } from 'react';

export function useOrderNotification() {
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    // Request notification permission on mount
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const playNotificationSound = async () => {
    try {
      // Also play a notification beep before the speech
      if (!audioContextRef.current) {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioContextRef.current = new AudioContextClass();
      }
      const audioContext = audioContextRef.current;
      // Try to resume context (required by some browsers)
      if (audioContext.state === 'suspended') {
        await audioContext.resume();
      }

      // Use Web Speech API to speak "New order placed"
      const utterance = new SpeechSynthesisUtterance('New order placed');
      utterance.rate = 1.1; // Slightly faster
      utterance.pitch = 1.2; // Slightly higher pitch
      utterance.volume = 1.0; // Full volume
      // Get available voices and prefer English
      const voices = window.speechSynthesis.getVoices();
      const englishVoice = voices.find(voice => voice.lang.startsWith('en')) || voices[0];
      if (englishVoice) {
        utterance.voice = englishVoice;
      }
      window.speechSynthesis.speak(utterance);

      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.2);
      console.log('🔔 Order notification: "New order placed" announced!');
    } catch (error) {
      console.error('Failed to play notification sound:', error);
    }
  };

  const showNotification = (title: string, body: string) => {
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        body,
        icon: '/images/logo.png',
        badge: '/images/logo.png',
        tag: 'order-notification',
        requireInteraction: false
      });
    }
  };

  return { playNotificationSound, showNotification };
}
