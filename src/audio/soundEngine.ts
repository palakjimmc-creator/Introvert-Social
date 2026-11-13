import {SoundChannels} from '../types/lounge';

class WallflowerSoundEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private rainGain: GainNode | null = null;
  private cafeGain: GainNode | null = null;
  private vinylGain: GainNode | null = null;
  private chordsGain: GainNode | null = null;
  private sources: AudioBufferSourceNode[] = [];
  private oscillators: OscillatorNode[] = [];
  private chordTimer: number | null = null;
  private isPlaying = false;
  private currentChannels: SoundChannels = {rain: 0.65, cafe: 0.35, vinyl: 0.28, chords: 0.3};

  private ensureContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as {webkitAudioContext: typeof AudioContext}).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      void this.ctx.resume();
    }
    return this.ctx;
  }

  private createNoiseBuffer(ctx: AudioContext, seconds: number, type: 'pink' | 'brown' | 'vinyl'): AudioBuffer {
    const sampleRate = ctx.sampleRate;
    const length = Math.floor(sampleRate * seconds);
    const buffer = ctx.createBuffer(1, length, sampleRate);
    const data = buffer.getChannelData(0);

    if (type === 'brown') {
      let lastOut = 0;
      for (let i = 0; i < length; i++) {
        const white = Math.random() * 2 - 1;
        lastOut = (lastOut + 0.02 * white) / 1.02;
        data[i] = lastOut * 3.2;
      }
    } else if (type === 'pink') {
      let b0 = 0;
      let b1 = 0;
      let b2 = 0;
      let b3 = 0;
      let b4 = 0;
      let b5 = 0;
      let b6 = 0;
      for (let i = 0; i < length; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.09;
        b6 = white * 0.115926;
      }
    } else {
      for (let i = 0; i < length; i++) {
        const r = Math.random();
        if (r > 0.9994) {
          data[i] = (Math.random() * 2 - 1) * 0.55;
        } else if (r > 0.997) {
          data[i] = (Math.random() * 2 - 1) * 0.08;
        } else {
          data[i] = (Math.random() * 2 - 1) * 0.004;
        }
      }
    }
    return buffer;
  }

  public start(channels: SoundChannels): void {
    this.currentChannels = {...channels};
    const ctx = this.ensureContext();
    if (this.isPlaying) {
      this.updateChannels(channels);
      return;
    }

    this.masterGain = ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.001, ctx.currentTime);
    this.masterGain.gain.exponentialRampToValueAtTime(0.85, ctx.currentTime + 0.6);
    this.masterGain.connect(ctx.destination);

    // 1. Rain on windowpane (filtered pink noise + gentle modulation)
    const rainSource = ctx.createBufferSource();
    rainSource.buffer = this.createNoiseBuffer(ctx, 4, 'pink');
    rainSource.loop = true;
    const rainFilter = ctx.createBiquadFilter();
    rainFilter.type = 'bandpass';
    rainFilter.frequency.value = 1350;
    rainFilter.Q.value = 0.45;
    this.rainGain = ctx.createGain();
    this.rainGain.gain.value = channels.rain * 0.36;
    rainSource.connect(rainFilter);
    rainFilter.connect(this.rainGain);
    this.rainGain.connect(this.masterGain);
    rainSource.start();
    this.sources.push(rainSource);

    // 2. Distant Espresso Bar (warm brown room hum)
    const cafeSource = ctx.createBufferSource();
    cafeSource.buffer = this.createNoiseBuffer(ctx, 4, 'brown');
    cafeSource.loop = true;
    const cafeFilter = ctx.createBiquadFilter();
    cafeFilter.type = 'lowpass';
    cafeFilter.frequency.value = 340;
    this.cafeGain = ctx.createGain();
    this.cafeGain.gain.value = channels.cafe * 0.45;
    cafeSource.connect(cafeFilter);
    cafeFilter.connect(this.cafeGain);
    this.cafeGain.connect(this.masterGain);
    cafeSource.start();
    this.sources.push(cafeSource);

    // 3. Vintage Vinyl Crackle
    const vinylSource = ctx.createBufferSource();
    vinylSource.buffer = this.createNoiseBuffer(ctx, 5, 'vinyl');
    vinylSource.loop = true;
    const vinylFilter = ctx.createBiquadFilter();
    vinylFilter.type = 'highpass';
    vinylFilter.frequency.value = 1800;
    this.vinylGain = ctx.createGain();
    this.vinylGain.gain.value = channels.vinyl * 0.25;
    vinylSource.connect(vinylFilter);
    vinylFilter.connect(this.vinylGain);
    this.vinylGain.connect(this.masterGain);
    vinylSource.start();
    this.sources.push(vinylSource);

    // 4. Warm Lo-Fi Chord Pad (Fmaj7 -> Em7 -> Dm9 -> Cmaj7)
    this.chordsGain = ctx.createGain();
    this.chordsGain.gain.value = channels.chords * 0.12;
    const chordFilter = ctx.createBiquadFilter();
    chordFilter.type = 'lowpass';
    chordFilter.frequency.value = 620;
    this.chordsGain.connect(chordFilter);
    chordFilter.connect(this.masterGain);

    const chordProgression = [
      [174.61, 220.0, 261.63, 329.63], // Fmaj7
      [164.81, 196.0, 246.94, 293.66], // Em7
      [146.83, 174.61, 220.0, 329.63], // Dm9
      [130.81, 196.0, 246.94, 329.63], // Cmaj7
    ];

    let chordIndex = 0;
    const oscGroup: OscillatorNode[] = [];
    chordProgression[0].forEach((freq) => {
      const osc = ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.value = freq;
      osc.connect(this.chordsGain!);
      osc.start();
      oscGroup.push(osc);
      this.oscillators.push(osc);
    });

    this.chordTimer = window.setInterval(() => {
      if (!this.ctx || !this.isPlaying) return;
      chordIndex = (chordIndex + 1) % chordProgression.length;
      const nextNotes = chordProgression[chordIndex];
      const now = this.ctx.currentTime;
      oscGroup.forEach((osc, idx) => {
        osc.frequency.setTargetAtTime(nextNotes[idx], now, 0.35);
      });
    }, 4500);

    this.isPlaying = true;
  }

  public updateChannels(channels: SoundChannels): void {
    this.currentChannels = {...channels};
    if (!this.ctx || !this.isPlaying) return;
    const now = this.ctx.currentTime;
    this.rainGain?.gain.setTargetAtTime(channels.rain * 0.36, now, 0.08);
    this.cafeGain?.gain.setTargetAtTime(channels.cafe * 0.45, now, 0.08);
    this.vinylGain?.gain.setTargetAtTime(channels.vinyl * 0.25, now, 0.08);
    this.chordsGain?.gain.setTargetAtTime(channels.chords * 0.12, now, 0.08);
  }

  public stop(): void {
    if (!this.isPlaying) return;
    this.isPlaying = false;
    if (this.chordTimer !== null) {
      window.clearInterval(this.chordTimer);
      this.chordTimer = null;
    }
    this.sources.forEach((src) => {
      try {
        src.stop();
        src.disconnect();
      } catch {
        // ignore already stopped
      }
    });
    this.oscillators.forEach((osc) => {
      try {
        osc.stop();
        osc.disconnect();
      } catch {
        // ignore already stopped
      }
    });
    this.sources = [];
    this.oscillators = [];
    if (this.masterGain) {
      this.masterGain.disconnect();
      this.masterGain = null;
    }
  }

  public playRingtonePulse(): void {
    const ctx = this.ensureContext();
    const now = ctx.currentTime;
    const notes = [659.25, 830.61, 987.77]; // gentle warm marimba-like triad
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.11);
      gain.gain.setValueAtTime(0.001, now + idx * 0.11);
      gain.gain.exponentialRampToValueAtTime(0.14, now + idx * 0.11 + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.11 + 0.55);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + idx * 0.11);
      osc.stop(now + idx * 0.11 + 0.6);
    });
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public getChannels(): SoundChannels {
    return this.currentChannels;
  }
}

export const soundEngine = new WallflowerSoundEngine();
