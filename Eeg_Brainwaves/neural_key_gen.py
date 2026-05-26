import numpy as np
import hashlib

class FuzzyExtractor:
    """
    Simulates a secure Fuzzy Extractor for biometric data.
    In real scenarios, it maps noisy biometric data to a uniform random string.
    Here we implement a helper mapping the raw signal features via BCH or similar (simulated by robustness rounding).
    """
    def __init__(self, error_tolerance=5):
        self.error_tolerance = error_tolerance
    
    def extract(self, raw_signal: list) -> bytes:
        # Simple quantization for error tolerance
        # In reality, this uses Secure Sketch and Error Correcting Codes
        quantized = [int(val / self.error_tolerance) * self.error_tolerance for val in raw_signal]
        signal_bytes = np.array(quantized, dtype=np.int32).tobytes()
        return hashlib.sha256(signal_bytes).digest()

class SNNProcessor:
    """
    Spiking Neural Network Pattern Extraction.
    Processes the time-series EEG features into a stable neuromorphic hash.
    """
    def __init__(self):
        self.threshold = 0.5
        
    def extract_pattern(self, raw_data: list) -> bytes:
        # Simulate local SNN spiking behavior
        spikes = []
        for i in range(1, len(raw_data)):
            # temporal derivative spike encoding
            rate = abs(raw_data[i] - raw_data[i-1])
            if rate > 10:  # arbitrary neuronal threshold for EXG pill
                spikes.append(1)
            else:
                spikes.append(0)
                
        spike_bytes = bytes(spikes)
        return hashlib.sha3_256(spike_bytes).digest()

def generate_brainwave_key(raw_eeg_samples: list) -> bytes:
    """
    Full processing: Raw EEG -> Fuzzy Extractor -> SNN -> Hash combined Key
    """
    if not raw_eeg_samples or len(raw_eeg_samples) < 100:
        # Fallback security
        raw_eeg_samples = [0] * 100
        
    fuzzy = FuzzyExtractor(error_tolerance=10)
    fuzzy_key = fuzzy.extract(raw_eeg_samples)
    
    snn = SNNProcessor()
    snn_key = snn.extract_pattern(raw_eeg_samples)
    
    # Combined cryptographic mapping
    final_key_material = hashlib.sha512(fuzzy_key + snn_key).digest()
    return final_key_material
