/**
 * ROMANTIC WEB AUDIO SYNTHESIZER
 * Zero external audio file dependencies! Synthesizes a warm, romantic,
 * dreamy music box arpeggio and interactive sound effects (chimes, sparkles, confetti fanfare).
 */

class RomanticAudio {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.timerId = null;
    this.currentNoteIndex = 0;
    
    // Romantic melody notes (frequencies in Hz: F4, A4, C5, E5, D5, etc. - soft dreamy progression)
    this.melody = [
      { note: 349.23, dur: 0.6 }, // F4
      { note: 440.00, dur: 0.6 }, // A4
      { note: 523.25, dur: 0.8 }, // C5
      { note: 659.25, dur: 1.0 }, // E5
      
      { note: 329.63, dur: 0.6 }, // E4
      { note: 392.00, dur: 0.6 }, // G4
      { note: 493.88, dur: 0.8 }, // B4
      { note: 587.33, dur: 1.0 }, // D5
      
      { note: 293.66, dur: 0.6 }, // D4
      { note: 349.23, dur: 0.6 }, // F4
      { note: 440.00, dur: 0.8 }, // A4
      { note: 523.25, dur: 1.0 }, // C5
      
      { note: 261.63, dur: 0.6 }, // C4
      { note: 329.63, dur: 0.6 }, // E4
      { note: 392.00, dur: 0.8 }, // G4
      { note: 523.25, dur: 1.2 }, // C5
      
      { note: 349.23, dur: 0.6 }, // F4
      { note: 440.00, dur: 0.6 }, // A4
      { note: 523.25, dur: 0.8 }, // C5
      { note: 698.46, dur: 1.4 }, // F5
      
      { note: 392.00, dur: 0.6 }, // G4
      { note: 493.88, dur: 0.6 }, // B4
      { note: 587.33, dur: 0.8 }, // D5
      { note: 783.99, dur: 1.6 }  // G5
    ];
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Play a soft bell/music-box chime tone
  playTone(freq, duration = 0.8, type = 'sine', volume = 0.12) {
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      // Delicate envelope (fast attack, gentle natural exponential decay)
      gain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(volume, this.ctx.currentTime + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration + 0.05);
    } catch (e) {
      console.warn('Audio note play error:', e);
    }
  }

  // Romantic Sparkle Sound for Button Clicks & Love Reactions
  playSparkle() {
    this.init();
    if (!this.ctx) return;
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playTone(freq, 0.45, 'triangle', 0.08);
      }, idx * 75);
    });
  }

  // Grand Celebration Fanfare for Blowing Birthday Candles
  playCelebrationFanfare() {
    this.init();
    if (!this.ctx) return;
    // Cheerful romantic birthday chord progression
    const chords = [
      [523.25, 659.25, 783.99],       // C Major
      [587.33, 739.99, 880.00],       // D Major
      [659.25, 830.61, 987.77],       // E Major
      [783.99, 987.77, 1174.66, 1567.98] // G Grand Arpeggio
    ];

    chords.forEach((chord, i) => {
      setTimeout(() => {
        chord.forEach(freq => this.playTone(freq, 1.2, 'sine', 0.1));
      }, i * 220);
    });
  }

  // Unfolding Paper sound effect
  playEnvelopeOpen() {
    this.init();
    if (!this.ctx) return;
    // Swoosh and sweet chord
    this.playTone(440, 0.4, 'sine', 0.06);
    setTimeout(() => this.playTone(554.37, 0.5, 'sine', 0.07), 100);
    setTimeout(() => this.playTone(659.25, 0.8, 'sine', 0.09), 200);
  }

  // Toggle ambient melody loop
  toggleMelody() {
    this.init();
    if (this.isPlaying) {
      this.stopMelody();
      return false;
    } else {
      this.startMelody();
      return true;
    }
  }

  startMelody() {
    this.isPlaying = true;
    this.currentNoteIndex = 0;
    this.stepMelody();
  }

  stepMelody() {
    if (!this.isPlaying) return;

    const item = this.melody[this.currentNoteIndex];
    // Main note with warm harmony
    this.playTone(item.note, item.dur * 1.5, 'sine', 0.1);
    this.playTone(item.note * 0.5, item.dur * 1.8, 'sine', 0.04); // Deep octave bass warmth

    this.currentNoteIndex = (this.currentNoteIndex + 1) % this.melody.length;
    
    // Wait duration for next note
    this.timerId = setTimeout(() => {
      this.stepMelody();
    }, item.dur * 850);
  }

  stopMelody() {
    this.isPlaying = false;
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
  }
}

// Global instance
window.romanticAudio = new RomanticAudio();
