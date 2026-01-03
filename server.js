const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// AI Game Generator Engine
const gameGenerator = require('./engine/game-generator');
const ttsEngine = require('./engine/tts-engine');
const audioEngine = require('./engine/audio-engine');

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'healthy', service: 'IQPlay Brain Games', version: '1.0.0' });
});

// Get all games
app.get('/api/games', async (req, res) => {
    try {
        const games = await gameGenerator.getAllGames();
        res.json(games);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Generate new AI game
app.post('/api/games/generate', async (req, res) => {
    try {
        const { userProfile } = req.body;
        const newGame = await gameGenerator.generateGame(userProfile);

        if (newGame.fun_score < 0.7) {
            return res.status(400).json({ error: 'Game rejected: fun_score too low', score: newGame.fun_score });
        }

        res.json(newGame);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Generate Bosnian TTS
app.post('/api/tts/generate', async (req, res) => {
    try {
        const { text } = req.body;
        const audioUrl = await ttsEngine.generateBosnianTTS(text);
        res.json({ audioUrl, text, language: 'bs-BA' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get audio for game
app.get('/api/audio/game/:gameId', (req, res) => {
    try {
        const { gameId } = req.params;
        const audio = audioEngine.getGameAudio(gameId);
        res.json(audio);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Submit game score
app.post('/api/score', async (req, res) => {
    try {
        const { userId, gameId, score, difficulty, time } = req.body;
        // Here you would save to Supabase
        res.json({ success: true, score });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Serve main app
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`🎮 IQPlay Brain Games running on port ${PORT}`);
    console.log(`🚀 AI Game Generator: ACTIVE`);
    console.log(`🎤 Bosnian TTS Engine: READY`);
    console.log(`🎵 Audio System: LOADED`);
});
