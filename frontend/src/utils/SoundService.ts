class SoundService {
    private audioContext: AudioContext | null = null;

    private init() {
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
    }

    private playTone(freq: number, type: OscillatorType, duration: number, volume: number = 0.1) {
        this.init();
        if (!this.audioContext) return;

        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.audioContext.currentTime);

        gain.gain.setValueAtTime(volume, this.audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.audioContext.currentTime + duration);

        osc.connect(gain);
        gain.connect(this.audioContext.destination);

        osc.start();
        osc.stop(this.audioContext.currentTime + duration);
    }

    playClick() {
        // Short, sharp tick
        this.playTone(800, 'sine', 0.1, 0.7);
    }

    playCorrect() {
        // Success "ding" - two notes
        this.playTone(523.25, 'sine', 0.1, 0.7); // C5
        setTimeout(() => this.playTone(659.25, 'sine', 0.3, 0.1), 100); // E5
    }

    playIncorrect() {
        // Low buzz/thump
        this.playTone(150, 'sawtooth', 0.4, 0.7);
    }

    playFinish() {
        // Triumphant melody: C5 -> E5 -> G5 -> C6
        const notes = [523.25, 659.25, 783.99, 1046.50];
        notes.forEach((freq, i) => {
            setTimeout(() => this.playTone(freq, 'sine', 0.2, 0.7), i * 150);
        });
    }
}

export const soundService = new SoundService();
