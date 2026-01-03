// Bosnian Text-to-Speech Engine
// Generates natural-sounding Bosnian voice instructions

class TTSEngine {
    constructor() {
        this.language = 'bs-BA';
        this.voiceType = 'neural';
        this.cache = new Map();
    }

    async generateBosnianTTS(text) {
        // Check cache first
        if (this.cache.has(text)) {
            return this.cache.get(text);
        }

        try {
            // In production, this would call Google Cloud TTS API
            // For now, we'll create a data URL representation
            const audioData = await this.synthesize(text);
            this.cache.set(text, audioData);
            return audioData;
        } catch (error) {
            console.error('TTS Generation failed:', error);
            // Failsafe: return text if TTS fails
            return { text, type: 'fallback' };
        }
    }

    async synthesize(text) {
        // Google Cloud TTS simulation
        // In production: const client = new textToSpeech.TextToSpeechClient();

        const request = {
            input: { text: text },
            voice: {
                languageCode: 'bs-BA',
                name: 'bs-BA-Neural-A',
                ssmlGender: 'NEUTRAL'
            },
            audioConfig: {
                audioEncoding: 'MP3',
                speakingRate: 1.0,
                pitch: 0,
                volumeGainDb: 0
            }
        };

        // Simulate audio URL (in production, this would be actual audio)
        return {
            url: `/audio/tts/${Buffer.from(text).toString('base64')}.mp3`,
            text: text,
            language: 'bs-BA',
            duration: this.estimateDuration(text),
            cached: false
        };
    }

    estimateDuration(text) {
        // Approximate: 150 words per minute in Bosnian
        const words = text.split(/\s+/).length;
        return (words / 150) * 60; // seconds
    }

    // Pre-generate common phrases
    async preloadCommonPhrases() {
        const phrases = [
            'Odličan rad!',
            'Pokušaj ponovo!',
            'Vrijeme ističe!',
            'Novo rekord!',
            'Bravo!',
            'Fantastično!',
            'Odlično!',
            'Pažljivo!',
            'Brže!',
            'Fokusiraj se!',
            'Perfektno!',
            'Nevjerovatno!',
            'Nastavi tako!',
            'Sjajno!',
            'Izvrsno!'
        ];

        for (const phrase of phrases) {
            await this.generateBosnianTTS(phrase);
        }
    }

    // Generate motivational messages
    getMotivationalMessage(score, difficulty) {
        if (score > 80) {
            return 'Nevjerovatno! Ti si pravi mozgoljubac!';
        } else if (score > 60) {
            return 'Odličan rezultat! Nastavi ovim tempom.';
        } else if (score > 40) {
            return 'Dobar pokušaj! Vježbanje čini majstora.';
        } else {
            return 'Ne odustaj! Svaki pokušaj te čini boljim.';
        }
    }

    // Generate AI advice after game
    getAIAdvice(gameCategory, performance) {
        const advice = {
            memory: [
                'Pokušaj koristiti mnemotehničke metode za bolje pamćenje.',
                'Vizualizacija ti može pomoći da zapamtiš više informacija.',
                'Ponavljanje je ključ za jaku memoriju.'
            ],
            logic: [
                'Analiziraj obrazac korak po korak.',
                'Potroši vrijeme na razumijevanje pravila prije nego počneš.',
                'Logičko razmišljanje se poboljšava sa praksom.'
            ],
            speed: [
                'Fokusiraj se na brzinu reakcije, ne samo preciznost.',
                'Treniraj reflekse svaki dan.',
                'Predviđaj sljedeći korak!'
            ],
            math: [
                'Mentalna matematika postaje lakša sa vježbanjem.',
                'Pokušaj pronaći brže načine računanja.',
                'Svakodnevna praksa čini razliku.'
            ],
            attention: [
                'Eliminiši distrakcije oko sebe.',
                'Fokusiraj se na jedan detalj u vremenu.',
                'Vježbaj mindfulness za bolju koncentraciju.'
            ],
            language: [
                'Čitaj više da proširiti vokabular.',
                'Igraj se sa riječima svaki dan.',
                'Jezik se uči kroz upotrebu.'
            ]
        };

        const categoryAdvice = advice[gameCategory] || advice.memory;
        return categoryAdvice[Math.floor(Math.random() * categoryAdvice.length)];
    }

    // Generate weekly progress summary
    getWeeklySummary(stats) {
        const { gamesPlayed, avgScore, improvement } = stats;

        let message = `Ove sedmice si igrao ${gamesPlayed} igara. `;

        if (improvement > 0) {
            message += `Tvoj rezultat se poboljšao za ${improvement}%! `;
            message += 'Nastavi ovim putem i dosegni nove visine!';
        } else {
            message += 'Nastavi vježbati i rezultati će doći!';
        }

        return message;
    }

    clearCache() {
        this.cache.clear();
    }
}

module.exports = new TTSEngine();
