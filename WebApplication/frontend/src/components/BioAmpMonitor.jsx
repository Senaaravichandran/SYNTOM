import React, { useRef, useState, useEffect } from 'react';
import { Activity, CheckCircle, Usb } from 'lucide-react';
import { motion } from 'framer-motion';

const BioAmpMonitor = ({ onCaptureComplete }) => {
  const canvasRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [captureProgress, setProgress] = useState(0);

  // Using Web Serial API for real EXG capture
  const connectDevice = async () => {
    try {
      const port = await navigator.serial.requestPort();
      await port.open({ baudRate: 115200 });
      setIsConnected(true);
      setIsCapturing(true);

      const decoder = new TextDecoderStream();
      const inputDone = port.readable.pipeTo(decoder.writable);
      const inputStream = decoder.readable;
      const reader = inputStream.getReader();

      let samples = [];
      const MAX_SAMPLES = 500; // Capture ~500 samples for the seed
      
      const drawEEG = (newValue) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        
        // Map value to canvas height (assuming typical EXG ADC values 0-4095)
        const y = height - (newValue / 4095) * height;
        
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'; // Fade effect
        ctx.fillRect(0, 0, width, height);
        
        ctx.beginPath();
        ctx.strokeStyle = '#00E68F';
        ctx.lineWidth = 2;
        // Shift old samples logic omitted for brevity in canvas, 
        // a simple scrolling line:
        const xPos = (samples.length / MAX_SAMPLES) * width;
        ctx.lineTo(xPos, y);
        ctx.stroke();
      };

      try {
        while (true) {
          const { value, done } = await reader.read();
          if (done) {
            reader.releaseLock();
            break;
          }
          // Parse lines
          const lines = value.split('\n');
          for (let line of lines) {
            let val = parseInt(line.trim());
            if (!isNaN(val)) {
              samples.push(val);
              drawEEG(val);
              setProgress((samples.length / MAX_SAMPLES) * 100);
              
              if (samples.length >= MAX_SAMPLES) {
                // Done capturing
                reader.cancel(); // Stop reading
                setIsCapturing(false);
                onCaptureComplete(samples); // Send to parent
                return;
              }
            }
          }
        }
      } catch (err) {
        console.error("Read error", err);
      }
    } catch (err) {
      console.error("Serial connection failed or denied", err);
    }
  };

  return (
    <div className="w-full bg-gray-900/90 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6 flex flex-col items-center mb-8 relative overflow-hidden text-white">
      <div className="flex items-center gap-2 mb-4 w-full justify-between">
        <div className="flex items-center gap-3">
          <Activity className={isCapturing ? "text-[#00E68F] animate-pulse" : "text-gray-400"} />
          <h3 className="text-xl font-semibold text-[#00E68F]">BioAmp EXG Neural Interface</h3>
        </div>
        {!isConnected && !isCapturing && captureProgress === 0 && (
          <motion.button
            onClick={connectDevice}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 bg-[#00E68F] text-black px-4 py-2 rounded-md font-bold"
          >
            <Usb size={18} /> Connect EXG Pill
          </motion.button>
        )}
        {captureProgress >= 100 && (
          <div className="flex items-center gap-2 text-[#00E68F] font-semibold">
            <CheckCircle /> Signal Secured
          </div>
        )}
      </div>

      <div className="relative w-full h-32 bg-black/50 border border-gray-700/50 rounded-lg overflow-hidden">
        <canvas ref={canvasRef} width={800} height={128} className="w-full h-full" />
        
        {isCapturing && (
          <div className="absolute top-2 left-2 text-xs text-[#00E68F] font-mono tracking-widest animate-pulse">
            REC: BIO_ANALOG_STREAM
          </div>
        )}
        
        {!isConnected && captureProgress === 0 && (
          <div className="absolute inset-0 flex items-center justify-center text-gray-500 font-mono text-sm">
            WAITING FOR DEVICE...
          </div>
        )}
      </div>

      {isCapturing && (
        <div className="w-full mt-4 h-2 bg-gray-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-[#00E68F] to-[#00B378] transition-all duration-300"
            style={{ width: `${captureProgress}%` }}
          />
        </div>
      )}
    </div>
  );
};

export default BioAmpMonitor;
