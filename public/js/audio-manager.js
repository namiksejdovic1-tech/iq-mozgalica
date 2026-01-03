// Neuromaster Audio Manager
// Handles all audio playback using Howler.js

class NeuromasterAudio {
    constructor() {
        this.manifest = null;
        this.sounds = {};
        this.bgMusic = null;
        this.isMuted = localStorage.getItem('audio_muted') === 'true';
        this.basePath = '/assets/'; // Adjust based on where assets are stored
    }

    async init() {
        try {
            const response = await fetch('/assets/neuromaster-manifest.json');
            this.manifest = await response.json();
            this.preloadSounds();
            console.log('✅ Neuromaster Audio Engine initialized');
        } catch (error) {
            console.error('❌ Failed to load audio manifest:', error);
        }
    }

    preloadSounds() {
        // Preload common SFX
        this.sounds.click = new Howl({ src: ['/assets/audio/sfx/click-modern.mp3'], volume: 0.5 });
        this.sounds.success = new Howl({ src: ['/assets/audio/sfx/success-shimmer.mp3'], volume: 0.7 });
        this.sounds.error = new Howl({ src: ['/assets/audio/sfx/error-thud.mp3'], volume: 0.4 });

        // Setup Background Music
        this.bgMusic = new Howl({
            src: ['/assets/audio/music/ambient-focus.mp3'],
            html5: true, // Better for large files
            loop: true,
            volume: 0.2
        });
    }

    playClick() {
        if (!this.isMuted) this.sounds.click?.play();
    }

    playSuccess() {
        if (!this.isMuted) this.sounds.success?.play();
    }

    playError() {
        if (!this.isMuted) this.sounds.error?.play();
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        localStorage.setItem('audio_muted', this.isMuted);
        Howler.mute(this.isMuted);
        return this.isMuted;
    }

    startMusic() {
        if (!this.isMuted && this.bgMusic && !this.bgMusic.playing()) {
            this.bgMusic.play();
            this.bgMusic.fade(0, 0.2, 2000); // Fade in
        }
    }

    stopMusic() {
        if (this.bgMusic) {
            this.bgMusic.fade(0.2, 0, 1000);
            setTimeout(() => this.bgMusic.stop(), 1000);
        }
    }

    // The Master Function from the user request
    triggerNeuromaster(key) {
        if (this.isMuted || !this.manifest) return;

        const asset = this.manifest.library[key];
        if (!asset) return;

        // 1. Inicijalizacija zvukova
        // Note: In a real app, you might want to preload these too, or handle loading latency
        const sfx = new Howl({ src: [`/assets/audio/sfx/${asset.sfx}`], volume: 0.6 });
        const voice = new Howl({ src: [`/assets/audio/voice/${asset.voice}`], volume: 1.0 });

        // 2. Audio Ducking
        if (this.bgMusic && this.bgMusic.playing()) {
            this.bgMusic.fade(0.2, 0.05, 300);
        }

        // 3. Play SFX
        sfx.play();

        // 4. Play Voice delayed
        setTimeout(() => {
            voice.play();

            // 5. Restore music
            voice.on('end', () => {
                if (this.bgMusic && this.bgMusic.playing()) {
                    this.bgMusic.fade(0.05, 0.2, 500);
                }
            });
        }, this.manifest.config.default_delay);
    }
}

// Export global instance
window.audioManager = new NeuromasterAudio();
window.audioManager.init();
