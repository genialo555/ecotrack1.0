import { useEffect, useState } from 'react';
import Script from 'next/script';

const StatsSection = () => {
  const [activeCard, setActiveCard] = useState<number | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const stats = [
    {
      id: 1,
      title: "Performance Flotte",
      value: "98%",
      description: "Réduction significative de 32% des émissions CO2 sur l'année écoulée",
    },
    {
      id: 2,
      title: "Réduction Émissions",
      value: "65.8",
      description: "Notre flotte se positionne dans le top 15% des flottes les plus éco-responsables",
    },
    {
      id: 3,
      title: "Green Fleet",
      value: "89.4",
      description: "Grâce à des optimisations constantes, 28k€ d'économies ont été réalisées",
    },
    {
      id: 4,
      title: "ECO2 Standard",
      value: "92.7",
      description: "Plus de 1200 actions positives enregistrées cette année",
    },
  ];

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const initParticles = () => {
      // @ts-ignore
      if (window.particlesJS) {
        // @ts-ignore
        window.particlesJS('particles-js', {
          particles: {
            number: {
              value: 100,
              density: {
                enable: true,
                value_area: 800
              }
            },
            color: {
              value: ["#f97316", "#3b82f6", "#22c55e", "#f59e0b", "#a855f7"]
            },
            shape: {
              type: "circle",
            },
            opacity: {
              value: 0.7,
              random: false,
              anim: {
                enable: true,
                speed: 1,
                opacity_min: 0.4,
                sync: false
              }
            },
            size: {
              value: 6,
              random: true,
              anim: {
                enable: true,
                speed: 2,
                size_min: 3,
                sync: false
              }
            },
            line_linked: {
              enable: true,
              distance: 150,
              color: "#f97316",
              opacity: 0.5,
              width: 2,
              color_rgb_line: true,
              consent: false
            },
            move: {
              enable: true,
              speed: 2,
              direction: "none",
              random: true,
              straight: false,
              out_mode: "bounce",
              bounce: true,
              attract: {
                enable: true,
                rotateX: 600,
                rotateY: 1200
              }
            }
          },
          interactivity: {
            detect_on: "canvas",
            events: {
              onhover: {
                enable: true,
                mode: "bubble"
              },
              onclick: {
                enable: true,
                mode: "repulse"
              },
              resize: true
            },
            modes: {
              bubble: {
                distance: 100,
                size: 12,
                duration: 0.4,
                opacity: 0.8,
                speed: 3
              },
              repulse: {
                distance: 200,
                duration: 0.4
              }
            }
          },
          retina_detect: true,
          fps_limit: 60
        });

        // Create highlight points
        setInterval(() => {
          const randomIndex = Math.floor(Math.random() * stats.length);
          setActiveCard(randomIndex);
          setTimeout(() => setActiveCard(null), 2000);
        }, 5000);
      }
    };

    if (document.getElementById('particles-script')?.hasAttribute('data-loaded')) {
      initParticles();
    } else {
      document.addEventListener('particles-loaded', initParticles);
    }

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('particles-loaded', initParticles);
    };
  }, []);

  return (
    <section className="relative min-h-screen overflow-hidden bg-base-100">
      <Script
        id="particles-script"
        src="https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js"
        onLoad={() => {
          document.getElementById('particles-script')?.setAttribute('data-loaded', 'true');
          document.dispatchEvent(new Event('particles-loaded'));
        }}
      />

      {/* Background Title */}
      <div className="absolute inset-0 flex items-center justify-center z-0 w-full overflow-hidden">
        <h1 className="text-[12vw] md:text-[8vw] font-bold text-base-content/5 select-none pointer-events-none whitespace-nowrap">
          Statistiques
        </h1>
      </div>

      {/* Particles Container */}
      <div 
        id="particles-js"
        className="absolute inset-0 z-10 cursor-pointer"
      />

      {/* Hover Card */}
      {activeCard !== null && (
        <div
          style={{
            position: 'absolute',
            top: mousePosition.y,
            left: mousePosition.x,
            transform: 'translate(-50%, -50%)',
            zIndex: 30,
          }}
          className="w-72 opacity-0 animate-fade-in p-6 bg-white/10 backdrop-blur-xl 
                     rounded-xl shadow-lg border border-white/20 
                     transition-all duration-300"
        >
          <div className="space-y-3">
            <h3 className="text-xl font-bold bg-gradient-to-r from-orange-500 via-blue-500 
                          to-green-500 bg-clip-text text-transparent">
              {stats[activeCard].title}
            </h3>
            <p className="text-3xl font-extrabold bg-gradient-to-r from-primary via-accent 
                         to-secondary bg-clip-text text-transparent">
              {stats[activeCard].value}
            </p>
            <p className="text-sm text-base-content/70">
              {stats[activeCard].description}
            </p>
          </div>
        </div>
      )}

      {/* Guide Text */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center
                    text-base-content/60 animate-pulse">
        Survolez les particules pour découvrir nos statistiques
      </div>
    </section>
  );
};

export default StatsSection;