import os
import hashlib
from qiskit import QuantumCircuit, transpile
from qiskit_ibm_runtime import QiskitRuntimeService
# Fallback to Aer for local execution if API key is not provided (still a real quantum simulation backend, but code structure is ready)
from qiskit_aer import AerSimulator 

class IBMQuantumAPI:
    def __init__(self):
        from dotenv import load_dotenv, find_dotenv
        load_dotenv(find_dotenv())
        
        token = os.getenv("IBM_QUANTUM_TOKEN")
        crn = os.getenv("IBM_QUANTUM_CRN")
        self.use_real_backend = False
        
        if not token or not crn:
            print("Missing IBM_QUANTUM_TOKEN or IBM_QUANTUM_CRN. Using AerSimulator for local execution.")
            self.backend = AerSimulator()
            return
            
        try:
            # Initialize real IBM Quantum Service via IBM Cloud CRN
            self.service = QiskitRuntimeService(channel="ibm_cloud", token=token, instance=crn)
            self.backend = self.service.least_busy(operational=True, simulator=False)
            self.use_real_backend = True
            print(f"Connected to IBM Quantum backend: {self.backend.name}")
        except Exception as e:
            print(f"IBM Quantum connection failed, falling back to local simulation: {e}")
            self.backend = AerSimulator()

    def execute_braid_circuit(self, seed: bytes) -> bytes:
        """
        Executes a quantum circuit mapping the abstract braid operations.
        4 Qubits simulating Anyons A1, A2, A3, A4.
        """
        # Map seed to initial rotations
        seed_hash = hashlib.sha256(seed).digest()
        
        qc = QuantumCircuit(4, 4)
        
        # Initial state prep based on EEG seed
        for i in range(4):
            angle = float(seed_hash[i]) / 255.0 * 3.14159
            qc.rx(angle, i)
            
        # Simultaneous Braiding of Pair (A1, A3) and Pair (A2, A4)
        # Using SWAP and CNOT to mimic non-abelian braiding exchange
        # Pair A1 (q0), A3 (q2)
        qc.cz(0, 2)
        qc.swap(0, 2)
        
        # Pair A2 (q1), A4 (q3)
        qc.cz(1, 3)
        qc.swap(1, 3)
        
        # Measure
        qc.measure([0,1,2,3], [0,1,2,3])
        
        # Execute
        transpiled_qc = transpile(qc, self.backend)
        if self.use_real_backend:
            # For real backend, we use Sampler
            # Note: keeping synchronous for simplicity, but it takes time
            from qiskit_ibm_runtime import SamplerV2 as Sampler
            sampler = Sampler(backend=self.backend)
            job = sampler.run([transpiled_qc])
            result = job.result()
            # Extract quasi-probabilities or bitstrings (simplified handling here)
            counts = result[0].data.c.get_counts()
        else:
            # AerSimulator
            job = self.backend.run(transpiled_qc, shots=512)
            result = job.result()
            counts = result.get_counts()

        # Deterministically grab the most common state, or extract full entropy
        # Here we extract bits as entropy
        entropy_string = "".join(list(counts.keys()))
        entropy_bytes = hashlib.sha256(entropy_string.encode()).digest()
        
        return entropy_bytes

def get_quantum_provider():
    """Factory to swap out IBM Quantum with a future topological API"""
    return IBMQuantumAPI()
