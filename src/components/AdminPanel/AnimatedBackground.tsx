"use client";

import { useState, useEffect } from 'react';

interface Particle {
  left: number;
  top: number;
  duration: number;
  delay: number;
}

export default function AnimatedBackground() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    // Generate particle positions and animations on client side only
    const generatedParticles: Particle[] = Array.from({ length: 20 }, () => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      duration: 5 + Math.random() * 10,
      delay: Math.random() * 5,
    }));
    setParticles(generatedParticles);
  }, []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {/* Animated orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-pink-500/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Animated grid pattern */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
          animation: "gridMove 20s linear infinite",
        }}
      ></div>

      {/* Floating particles */}
      <div className="absolute inset-0">
        {particles.map((particle, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full"
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
              animation: `float ${particle.duration}s ease-in-out infinite`,
              animationDelay: `${particle.delay}s`,
            }}
          ></div>
        ))}
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes gridMove {
          0% {
            transform: translate(0, 0);
          }
          100% {
            transform: translate(50px, 50px);
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0) translateX(0);
            opacity: 0.2;
          }
          50% {
            transform: translateY(-20px) translateX(10px);
            opacity: 0.5;
          }
        }

        .delay-1000 {
          animation-delay: 1s;
        }

        .delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
}

