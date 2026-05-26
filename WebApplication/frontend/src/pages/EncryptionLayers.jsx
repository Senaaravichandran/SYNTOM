import React, { useState, useEffect } from "react";
import { Brain, Shield, Clock, Network } from "lucide-react";
import { motion } from "framer-motion";

const EncryptionLayers = () => {
  const [brainwaveOffset, setBrainwaveOffset] = useState(0);
  const [timeRotation, setTimeRotation] = useState(0);
  const [braidPhase, setBraidPhase] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setBrainwaveOffset((prev) => (prev + 1) % 100);
      setTimeRotation((prev) => (prev + 2) % 360);
      setBraidPhase((prev) => (prev + 0.5) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const layers = [
    {
      id: 1,
      title: "Imported Brainwaves",
      description: "EEG sensor data converted to cryptographic key material",
      icon: Brain,
      color: "from-purple-500 to-pink-500",
      animation: "wave"
    },
    {
      id: 2,
      title: "Hybrid Quantum Algorithm",
      description: "Post-quantum cryptographic suite for maximum security",
      icon: Shield,
      color: "from-blue-500 to-cyan-500",
      animation: "quantum",
      subComponents: [
        "AES-256-GCM (Symmetric Encryption)",
        "HQC-128 / Kyber768 (Post-Quantum KEM)",
        "Dilithium ML-DSA (Digital Signatures)",
        "Quantum Entropy Generation",
        "HKDF Key Derivation",
        "HMAC Authentication"
      ]
    },
    {
      id: 3,
      title: "Time Dilation",
      description: "Temporal desynchronization for replay attack prevention",
      icon: Clock,
      color: "from-amber-500 to-orange-500",
      animation: "time"
    },
    {
      id: 4,
      title: "Anyonic Braided Exchange",
      description: "Mathematical braid group key derivation with quantum properties",
      icon: Network,
      color: "from-green-500 to-emerald-500",
      animation: "braid"
    }
  ];

  const renderWaveAnimation = () => {
    const points = [];
    for (let i = 0; i <= 100; i++) {
      const x = (i / 100) * 400;
      const y = 50 + Math.sin((i + brainwaveOffset) * 0.1) * 30;
      points.push(`${x},${y}`);
    }
    return (
      <svg className="w-full h-32" viewBox="0 0 400 100">
        <defs>
          <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#a855f7" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#ec4899" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#a855f7" stopOpacity="0.8" />
          </linearGradient>
        </defs>
        <polyline
          points={points.join(" ")}
          fill="none"
          stroke="url(#waveGradient)"
          strokeWidth="3"
          strokeLinecap="round"
        />
        {[...Array(5)].map((_, i) => {
          const x = ((i * 20 + brainwaveOffset) % 100) * 4;
          const y = 50 + Math.sin((i * 20 + brainwaveOffset) * 0.1) * 30;
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r="4"
              fill="#ec4899"
              opacity="0.8"
            >
              <animate
                attributeName="r"
                values="4;6;4"
                dur="1s"
                repeatCount="indefinite"
              />
            </circle>
          );
        })}
      </svg>
    );
  };

  const renderQuantumAnimation = () => {
    return (
      <div className="relative w-full h-32 flex items-center justify-center">
        {[...Array(3)].map((_, ring) => (
          <motion.div
            key={ring}
            className="absolute rounded-full border-2"
            style={{
              width: `${(ring + 1) * 60}px`,
              height: `${(ring + 1) * 60}px`,
              borderColor: ring === 0 ? "#3b82f6" : ring === 1 ? "#06b6d4" : "#8b5cf6",
              opacity: 0.3,
            }}
            animate={{
              rotate: ring % 2 === 0 ? 360 : -360,
              scale: [1, 1.1, 1],
            }}
            transition={{
              rotate: { duration: 3 + ring, repeat: Infinity, ease: "linear" },
              scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
            }}
          />
        ))}
        {[...Array(6)].map((_, i) => {
          const angle = (i * 60 + timeRotation) * (Math.PI / 180);
          const x = Math.cos(angle) * 80;
          const y = Math.sin(angle) * 80;
          return (
            <motion.div
              key={i}
              className="absolute w-3 h-3 rounded-full"
              style={{
                left: `calc(50% + ${x}px)`,
                top: `calc(50% + ${y}px)`,
                background: `linear-gradient(135deg, #3b82f6, #06b6d4)`,
              }}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          );
        })}
      </div>
    );
  };

  const renderTimeAnimation = () => {
    return (
      <div className="relative w-full h-32 flex items-center justify-center">
        <motion.div
          className="absolute w-24 h-24 rounded-full border-4 border-amber-500/30"
          animate={{ rotate: timeRotation }}
          transition={{ duration: 0.05, ease: "linear" }}
        >
          <div className="absolute top-1/2 left-1/2 w-1 h-10 bg-amber-500 origin-bottom -translate-x-1/2 -translate-y-full" />
          <div className="absolute top-1/2 left-1/2 w-1 h-8 bg-orange-500 origin-bottom -translate-x-1/2 -translate-y-full rotate-90" />
        </motion.div>
        {[...Array(12)].map((_, i) => {
          const angle = (i * 30) * (Math.PI / 180);
          const x = Math.cos(angle) * 60;
          const y = Math.sin(angle) * 60;
          return (
            <div
              key={i}
              className="absolute w-2 h-2 bg-amber-400/50 rounded-full"
              style={{
                left: `calc(50% + ${x}px)`,
                top: `calc(50% + ${y}px)`,
                transform: "translate(-50%, -50%)",
              }}
            />
          );
        })}
        <motion.div
          className="absolute w-32 h-32 rounded-full border-2 border-orange-500/20"
          animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </div>
    );
  };

  const renderBraidAnimation = () => {
    const strands = 3;
    return (
      <div className="relative w-full h-32">
        <svg className="w-full h-full" viewBox="0 0 400 100">
          <defs>
            <linearGradient id="braidGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#34d399" />
            </linearGradient>
            <linearGradient id="braidGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#34d399" />
              <stop offset="100%" stopColor="#6ee7b7" />
            </linearGradient>
            <linearGradient id="braidGradient3" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#6ee7b7" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>
          </defs>
          {[...Array(strands)].map((_, strandIndex) => {
            const path = [];
            for (let x = 0; x <= 400; x += 10) {
              const phase = (braidPhase + x * 0.5 + strandIndex * 120) * (Math.PI / 180);
              const y = 50 + Math.sin(phase) * 25;
              path.push(`${x},${y}`);
            }
            return (
              <polyline
                key={strandIndex}
                points={path.join(" ")}
                fill="none"
                stroke={`url(#braidGradient${strandIndex + 1})`}
                strokeWidth="4"
                strokeLinecap="round"
                opacity="0.8"
              />
            );
          })}
        </svg>
      </div>
    );
  };

  return (
    <div className="min-h-screen p-8">
      {/* Header */}
      <div className="mb-12 text-center">
        <motion.h1 
          className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-500 to-green-400 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Encryption Architecture
        </motion.h1>
        <motion.p 
          className="text-gray-300 text-lg max-w-3xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          Four-layer quantum-resistant encryption system
        </motion.p>
      </div>

      {/* Layers */}
      <div className="max-w-5xl mx-auto space-y-8">
        {layers.map((layer, index) => (
          <motion.div
            key={layer.id}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.2, duration: 0.6 }}
            className="relative bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-lg border border-gray-700 rounded-2xl p-8 hover:border-gray-600 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/20"
          >
            {/* Header */}
            <div className="flex items-center gap-6 mb-6">
              <div className={`w-20 h-20 rounded-xl bg-gradient-to-br ${layer.color} flex items-center justify-center shadow-lg`}>
                <layer.icon className="w-10 h-10 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-white mb-1">
                  {layer.title}
                </h2>
                <p className="text-gray-300 text-sm">
                  {layer.description}
                </p>
              </div>
              <div className={`text-5xl font-bold bg-gradient-to-br ${layer.color} bg-clip-text text-transparent`}>
                {String(layer.id).padStart(2, '0')}
              </div>
            </div>

            {/* Animation */}
            <div className="bg-gray-900/40 rounded-xl p-6 border border-gray-700/50">
              {layer.animation === "wave" && renderWaveAnimation()}
              {layer.animation === "quantum" && renderQuantumAnimation()}
              {layer.animation === "time" && renderTimeAnimation()}
              {layer.animation === "braid" && renderBraidAnimation()}
            </div>

            {/* Sub-components for Hybrid Quantum */}
            {layer.subComponents && (
              <div className="mt-6 grid grid-cols-2 gap-3">
                {layer.subComponents.map((component, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.2 + idx * 0.1, duration: 0.4 }}
                    className="bg-gray-800/60 border border-gray-700/50 rounded-lg p-3 hover:border-cyan-500/50 transition-all"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                      <span className="text-sm text-gray-300">{component}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Flow Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="mt-12 text-center"
      >
        <div className="inline-flex items-center gap-4 px-8 py-4 bg-gradient-to-r from-purple-900/30 via-blue-900/30 to-green-900/30 border border-purple-500/30 rounded-full">
          <span className="text-gray-300 font-medium">Data Flow:</span>
          <div className="flex items-center gap-2">
            {["Brainwaves", "Quantum", "Time", "Braid"].map((step, i) => (
              <React.Fragment key={step}>
                <span className="text-sm font-semibold text-white">{step}</span>
                {i < 3 && (
                  <svg className="w-4 h-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default EncryptionLayers;
