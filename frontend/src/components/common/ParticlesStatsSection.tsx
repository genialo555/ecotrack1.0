'use client';

import React, { useEffect, useRef, useState } from 'react';

// Declare global types so TypeScript recognizes particlesJS on window
declare global {
  interface Window {
    particlesJS?: (
      tagId: string,
      params: Record<string, any>
    ) => void;
  }
}

/**
 * ParticlesStatsSection
 * - Renders a full-width, full-height container with Particles.js.
 * - On click, shows a "stat card" floating near the cursor.
 */
export default function ParticlesStatsSection() {
  const [showCard, setShowCard] = useState(false);
  const [cardPosition, setCardPosition] = useState({ x: 0, y: 0 });

  // Reference to the particles container
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // If particlesJS is available, initialize with your config
    if (typeof window !== 'undefined' && window.particlesJS) {
      window.particlesJS('particles-js', {
        particles: {
          number: {
            value: 380,
            density: {
              enable: true,
              value_area: 800,
            },
          },
          color: { value: '#ffffff' },
          shape: {
            type: 'circle',
            stroke: { width: 0, color: '#000000' },
            polygon: { nb_sides: 5 },
          },
          opacity: {
            value: 0.5,
            random: false,
          },
          size: {
            value: 3,
            random: true,
          },
          line_linked: {
            enable: true,
            distance: 150,
            color: '#ffffff',
            opacity: 0.4,
            width: 1,
          },
          move: {
            enable: true,
            speed: 6,
            direction: 'none',
            random: false,
            straight: false,
            out_mode: 'out',
            bounce: false,
          },
        },
        interactivity: {
          detect_on: 'canvas',
          events: {
            // Disable the default click mode for "push" so we can do our own
            onhover: {
              enable: true,
              mode: 'grab',
            },
            onclick: {
              enable: false, // we handle the click ourselves
              mode: 'push',
            },
            resize: true,
          },
          modes: {
            grab: { distance: 140, line_linked: { opacity: 1 } },
            bubble: { distance: 400, size: 40, duration: 2, opacity: 8, speed: 3 },
            repulse: { distance: 200, duration: 0.4 },
            push: { particles_nb: 4 },
            remove: { particles_nb: 2 },
          },
        },
        retina_detect: true,
      });
    }
  }, []);

  // Handle click anywhere on the container
  function handleContainerClick(e: React.MouseEvent<HTMLDivElement>) {
    // Show the card, and move it near the clicked position
    setShowCard(true);
    setCardPosition({ x: e.clientX, y: e.clientY });
  }

  return (
    <section className="relative w-full h-screen">
      {/* Particles.js container */}
      <div
        id="particles-js"
        ref={containerRef}
        className="w-full h-full"
        onClick={handleContainerClick}
      />

      {/* Conditionally render the floating "stat card" */}
      {showCard && (
        <div
          className="absolute bg-white text-black p-4 rounded-md shadow-lg"
          style={{
            left: cardPosition.x + 10,
            top: cardPosition.y + 10,
            zIndex: 9999,
          }}
        >
          <p className="font-semibold">I am in one card</p>
          {/* Example close button */}
          <button
            className="mt-2 text-sm bg-gray-700 text-white px-2 py-1 rounded-md"
            onClick={() => setShowCard(false)}
          >
            Close
          </button>
        </div>
      )}
    </section>
  );
}
