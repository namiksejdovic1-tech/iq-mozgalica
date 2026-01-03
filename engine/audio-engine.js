// Adaptive Audio Engine
// Automatically selects music and SFX based on game context

class AudioEngine {
    constructor() {
        this.musicLibrary = this.initializeMusicLibrary();
        this.sfxLibrary = this.initializeSFXLibrary();
        this.currentMusic = null;
        this.musicVolume = 1.0;
    }

    initializeMusicLibrary() {
        return {
            calm_focus: {
                bpm: 80,
                intensity: 0.3,
                url: '/audio/music/calm_focus.ogg',
                duration: 180
            },
            rising_tension: {
                bpm: 100,
                intensity: 0.5,
                url: '/audio/music/rising_tension.ogg',
                duration: 120
            },
            adrenaline_loop_90: {
                bpm: 90,
                intensity: 0.6,
                url: '/audio/music/adrenaline_90.ogg',
                duration: 150
            },
            adrenaline_loop_110: {
                bpm: 110,
                intensity: 0.7,
                url: '/audio/music/adrenaline_110.ogg',
                duration: 150
            },
            adrenaline_loop_130: {
                bpm: 130,
                intensity: 0.8,
                url: '/audio/music/adrenaline_130.ogg',
                duration: 150
            },
            high_intensity: {
                bpm: 150,
                intensity: 0.95,
                url: '/audio/music/high_intensity.ogg',
                duration: 100
            },
            victory_hit: {
                bpm: 120,
                intensity: 0.9,
                url: '/audio/music/victory_hit.ogg',
                duration: 10
            },
            soft_fail: {
                bpm: 70,
                intensity: 0.2,
                url: '/audio/music/soft_fail.ogg',
                duration: 5
            },
            dopamine_trigger: {
                bpm: 140,
                intensity: 0.85,
                url: '/audio/music/dopamine_trigger.ogg',
                duration: 8
            }
        };
    }

    initializeSFXLibrary() {
        return {
            soft_click: { url: '/audio/sfx/soft_click.wav', duration: 0.1 },
            dopamine_pop: { url: '/audio/sfx/dopamine_pop.wav', duration: 0.3 },
            low_buzz: { url: '/audio/sfx/low_buzz.wav', duration: 0.4 },
            alarm_soft: { url: '/audio/sfx/alarm_soft.wav', duration: 0.5 },
            power_chime: { url: '/audio/sfx/power_chime.wav', duration: 0.6 },
            streak_build: { url: '/audio/sfx/streak_build.wav', duration: 0.7 },
            countdown_tick: { url: '/audio/sfx/countdown_tick.wav', duration: 0.2 },
            time_warning: { url: '/audio/sfx/time_warning.wav', duration: 1.0 },
            combo_hit: { url: '/audio/sfx/combo_hit.wav', duration: 0.4 },
            perfect_score: { url: '/audio/sfx/perfect_score.wav', duration: 1.2 }
        };
    }

    // AI Music Selector
    selectMusic(context) {
        const { category, difficulty, userStressLevel = 0.5, sessionLength = 60, timeRemaining = 60 } = context;

        // Time-based selection
        if (timeRemaining < 10) {
            return this.musicLibrary.high_intensity;
        }

        // Category-based BPM mapping
        const bpmRanges = {
            speed: { min: 130, max: 150 },
            math: { min: 110, max: 130 },
            attention: { min: 100, max: 120 },
            logic: { min: 90, max: 110 },
            memory: { min: 90, max: 110 },
            language: { min: 90, max: 105 }
        };

        const range = bpmRanges[category] || { min: 100, max: 120 };
        const targetBPM = range.min + ((difficulty / 10) * (range.max - range.min));

        // Adjust for stress level
        const adjustedBPM = targetBPM * (1 - (userStressLevel * 0.2));

        // Select closest music track
        return this.getClosestMusicTrack(adjustedBPM);
    }

    getClosestMusicTrack(targetBPM) {
        let closest = null;
        let minDiff = Infinity;

        for (const [key, music] of Object.entries(this.musicLibrary)) {
            if (key.startsWith('adrenaline_loop_')) {
                const diff = Math.abs(music.bpm - targetBPM);
                if (diff < minDiff) {
                    minDiff = diff;
                    closest = music;
                }
            }
        }

        return closest || this.musicLibrary.adrenaline_loop_110;
    }

    // Get complete audio package for a game
    getGameAudio(gameId, gameData) {
        const music = this.selectMusic({
            category: gameData.category,
            difficulty: gameData.difficulty_levels / 2,
            userStressLevel: 0.5,
            sessionLength: gameData.time_limit_sec
        });

        return {
            music: {
                ...music,
                loop: true,
                duck_on_voice: true,
                fadeIn: 2,
                fadeOut: 2
            },
            sfx: {
                tap: this.sfxLibrary.soft_click,
                correct: this.sfxLibrary.dopamine_pop,
                wrong: this.sfxLibrary.low_buzz,
                timeout: this.sfxLibrary.alarm_soft,
                level_up: this.sfxLibrary.power_chime,
                combo: this.sfxLibrary.streak_build,
                countdown: this.sfxLibrary.countdown_tick,
                warning: this.sfxLibrary.time_warning,
                perfect: this.sfxLibrary.perfect_score
            },
            settings: {
                musicVolume: 0.7,
                sfxVolume: 1.0,
                masterVolume: 1.0
            }
        };
    }

    // Voice ducking (lower music when TTS speaks)
    onVoiceStart() {
        this.musicVolume = 0.25;
        return { action: 'duck', volume: this.musicVolume };
    }

    onVoiceEnd() {
        this.musicVolume = 1.0;
        return { action: 'restore', volume: this.musicVolume };
    }

    // Dynamic music adjustment during gameplay
    adjustMusicForTime(timeRemaining) {
        if (timeRemaining <= 10) {
            return this.musicLibrary.high_intensity;
        } else if (timeRemaining <= 20) {
            return this.musicLibrary.adrenaline_loop_130;
        }
        return null; // Keep current music
    }

    // Get victory/defeat audio
    getEndGameAudio(won, score) {
        if (won && score >= 90) {
            return this.musicLibrary.dopamine_trigger;
        } else if (won) {
            return this.musicLibrary.victory_hit;
        } else {
            return this.musicLibrary.soft_fail;
        }
    }

    // Generate audio manifest for offline caching
    getAudioManifest() {
        const allAudio = [];

        // Add all music tracks
        Object.values(this.musicLibrary).forEach(track => {
            allAudio.push({
                url: track.url,
                type: 'music',
                format: 'ogg',
                preload: true
            });
        });

        // Add all SFX
        Object.values(this.sfxLibrary).forEach(sfx => {
            allAudio.push({
                url: sfx.url,
                type: 'sfx',
                format: 'wav',
                preload: true
            });
        });

        return allAudio;
    }
}

module.exports = new AudioEngine();
