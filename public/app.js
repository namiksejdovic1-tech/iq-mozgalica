// IQPlay Brain Games - Complete Production App
// Version 2.0 - Full Implementation

class IQPlayApp {
    constructor() {
        this.currentScreen = 'home';
        this.currentGame = null;
        this.loadUserData();
        this.games = [];
        this.init();
    }

    loadUserData() {
        const saved = localStorage.getItem('iqplay_user');
        if (saved) {
            const data = JSON.parse(saved);
            this.userName = data.userName || 'Igrač';
            this.userProfile = data.userProfile || { memory: 0, logic: 0, speed: 0, math: 0, attention: 0, language: 0 };
            this.stats = data.stats || { gamesPlayed: 0, totalPoints: 0, winRate: 0, streak: 0 };
        } else {
            this.userName = 'Igrač';
            this.userProfile = { memory: 0, logic: 0, speed: 0, math: 0, attention: 0, language: 0 };
            this.stats = { gamesPlayed: 0, totalPoints: 0, winRate: 0, streak: 0 };
            this.saveUserData();
        }
    }

    saveUserData() {
        localStorage.setItem('iqplay_user', JSON.stringify({
            userName: this.userName,
            userProfile: this.userProfile,
            stats: this.stats
        }));
        this.updateUI();
    }

    updateUI() {
        document.querySelectorAll('.user-name, .profile-name').forEach(el => el.textContent = this.userName);
        document.getElementById('games-played').textContent = this.stats.gamesPlayed;
        document.getElementById('total-points').textContent = this.stats.totalPoints.toLocaleString();
        document.getElementById('win-rate').textContent = this.stats.winRate + '%';
        document.getElementById('streak').textContent = this.stats.streak;

        // Update skill bars
        const skills = ['memory', 'logic', 'speed'];
        skills.forEach((skill, idx) => {
            const percent = Math.round(this.userProfile[skill] * 100);
            const skillItems = document.querySelectorAll('.skill-item');
            if (skillItems[idx]) {
                skillItems[idx].querySelector('.skill-header span:last-child').textContent = percent + '%';
                skillItems[idx].querySelector('.skill-fill').style.width = percent + '%';
            }
        });
    }

    async init() {
        console.log('🎮 IQPlay v2.0 initializing...');
        this.showLoading();
        await this.loadGames();

        if (window.audioManager) {
            window.audioManager.triggerNeuromaster('WELCOME');
        }

        setTimeout(() => this.updateUI(), 100);
        setTimeout(() => this.hideLoading(), 2000);
        console.log('✅ IQPlay ready!');
    }

    showLoading() { document.getElementById('loading-screen').classList.add('active'); }
    hideLoading() {
        document.getElementById('loading-screen').classList.remove('active');
        document.getElementById('main-app').classList.remove('hidden');
    }

    async loadGames() {
        try {
            const response = await fetch('/api/games');
            if (response.ok) {
                const serverGames = await response.json();
                this.games = this.normalizeGames(serverGames);
                console.log(`✅ Loaded ${this.games.length} games from server`);
            } else {
                console.warn('⚠️ API unavailable, using mock data');
                this.games = this.generateMockGames();
            }
        } catch (error) {
            console.warn('⚠️ Failed to load games from API:', error.message);
            this.games = this.generateMockGames();
        }
    }

    normalizeGames(serverGames) {
        // Ensure games from server match expected format
        return serverGames.map((game, idx) => ({
            id: game.id || `game_${idx}`,
            name: game.name || `Igra ${idx + 1}`,
            category: game.category || 'logic',
            difficulty_levels: game.difficulty_levels || 10,
            time_limit_sec: game.time_limit_sec || 60,
            fun_score: game.fun_score || 0.8,
            tts: game.tts || { intro: 'Dobrodošli!', outro: 'Bravo!' }
        }));
    }

    generateMockGames() {
        const categories = ['memory', 'logic', 'math', 'attention', 'speed', 'language'];
        const games = [];
        categories.forEach((category) => {
            const count = category === 'memory' || category === 'logic' ? 10 : category === 'math' || category === 'attention' ? 8 : 7;
            for (let i = 1; i <= count; i++) {
                games.push({
                    id: `${category}_${i}`,
                    category: category,
                    name: `${this.getCategoryNameBS(category)} ${i}`,
                    difficulty_levels: 10,
                    time_limit_sec: 60,
                    fun_score: 0.8,
                    tts: { intro: `Dobrodošli u igru ${category}!`, outro: 'Odličan rad!' }
                });
            }
        });
        return games;
    }

    getCategoryNameBS(category) {
        const names = {
            memory: 'Memorija',
            logic: 'Logika',
            speed: 'Brzina',
            math: 'Kalkulacije',
            attention: 'Pažnja',
            language: 'Jezik'
        };
        return names[category] || category;
    }

    showScreen(name) {
        this.currentScreen = name;
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        document.getElementById(`${name}-screen`).classList.add('active');
        document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

        const navMap = { 'home': 0, 'games': 1, 'leaderboard': 2, 'profile': 3 };
        const navs = document.querySelectorAll('.nav-item');
        if (navs[navMap[name]]) navs[navMap[name]].classList.add('active');

        // Auto-render all games when showing games screen
        if (name === 'games' && this.games.length > 0) {
            this.renderAllGames();
        }
    }

    renderAllGames() {
        const gamesList = document.getElementById('games-list');
        document.getElementById('category-title').textContent = 'Sve Igre';

        gamesList.innerHTML = this.games.map(g => `
            <div class="glass-card p-5 mb-4 cursor-pointer hover:border-electric transition-colors" onclick="app.startGame(app.games.find(x => x.id === '${g.id}'))">
                <div class="flex items-center justify-between mb-2">
                    <h3 class="text-xl font-bold text-white">${g.name}</h3>
                    <span class="text-2xl">${this.getCategoryIcon(g.category)}</span>
                </div>
                <div class="flex gap-4 text-xs text-white/50 uppercase tracking-widest">
                    <span>⚡ ${g.difficulty_levels} Lvl</span>
                    <span>⏱️ ${g.time_limit_sec}s</span>
                    <span>🎯 ${this.getCategoryNameBS(g.category)}</span>
                </div>
            </div>
        `).join('');
    }

    getCategoryIcon(category) {
        const icons = {
            memory: '🧩',
            logic: '🎯',
            math: '🔢',
            speed: '⚡',
            attention: '👁️',
            language: '📚'
        };
        return icons[category] || '🎮';
    }

    startGame(game) {
        if (!game) return;

        this.currentGame = game;
        this.currentGameState = {
            score: 0,
            timeRemaining: game.time_limit_sec,
            startTime: Date.now(),
            correct: 0,
            total: 0
        };

        if (window.audioManager) window.audioManager.startMusic();

        this.showScreen('gameplay');
        this.loadGameContent(game);
        this.startGameTimer();
    }

    loadGameContent(game) {
        const gameContent = document.getElementById('game-content');
        if (game.category === 'memory') gameContent.innerHTML = this.generateMemoryGame();
        else if (game.category === 'math') gameContent.innerHTML = this.generateMathGame();
        else if (game.category === 'logic') gameContent.innerHTML = this.generateLogicGame();
        else if (game.category === 'speed') gameContent.innerHTML = this.generateSpeedGame();
        else gameContent.innerHTML = this.generateGenericGame();
    }

    generateMemoryGame() {
        const colors = ['#6C5CE7', '#00B894', '#FDCB6E', '#E17055', '#0984E3', '#FD79A8'];
        const gridSize = 4;
        let html = '<div class="grid grid-cols-4 gap-4 w-full">';
        for (let i = 0; i < gridSize * gridSize; i++) {
            const color = colors[Math.floor(i / 2) % colors.length];
            html += `
                <div class="aspect-square rounded-2xl flex items-center justify-center text-4xl cursor-pointer transition-all hover:scale-105 active:scale-95 shadow-lg bg-white/10 backdrop-blur-md border border-white/5" 
                     onclick="app.flipCard(${i})" 
                     style="background: linear-gradient(135deg, ${color}20 0%, ${color}40 100%)"
                     data-index="${i}" data-color="${color}">
                    <span class="card-icon opacity-0 transition-opacity duration-300">🎯</span>
                </div>`;
        }
        html += '</div>';
        return html;
    }

    generateMathGame() {
        const num1 = Math.floor(Math.random() * 20) + 1;
        const num2 = Math.floor(Math.random() * 20) + 1;
        const op = ['+', '-', '*'][Math.floor(Math.random() * 3)];
        let answer = eval(`${num1} ${op} ${num2}`);

        const wrong1 = answer + Math.floor(Math.random() * 5) + 1;
        const wrong2 = answer - Math.floor(Math.random() * 5) - 1;
        const options = [answer, wrong1, wrong2].sort(() => Math.random() - 0.5);

        return `
            <div class="text-center w-full max-w-sm">
                <h2 class="text-5xl font-bold text-white mb-8 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">${num1} ${op} ${num2} = ?</h2>
                <div class="grid gap-4">
                    ${options.map(opt => `
                        <button onclick="app.checkAnswer(${opt}, ${answer})" class="btn-primary w-full py-4 text-2xl font-bold rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 transition-all">
                            ${opt}
                        </button>
                    `).join('')}
                </div>
            </div>`;
    }

    generateLogicGame() {
        const seq = [2, 4, 6, 8];
        return `
            <div class="text-center w-full">
                <h3 class="text-white/60 mb-6 uppercase tracking-widest text-sm">Nastavi Niz</h3>
                <h2 class="text-4xl font-bold text-electric mb-8">${seq.join(' → ')} → <span class="text-neon">?</span></h2>
                <div class="grid grid-cols-2 gap-4">
                    ${[10, 9, 12, 11].sort(() => Math.random() - 0.5).map(opt => `
                        <button onclick="app.checkAnswer(${opt}, 10)" class="btn-glass py-4 text-xl font-bold hover:border-electric">
                            ${opt}
                        </button>
                    `).join('')}
                </div>
            </div>`;
    }

    generateSpeedGame() {
        return `
            <div class="text-center">
                <h3 class="text-white/60 mb-8 uppercase tracking-widest">Rapid Fire</h3>
                <button onclick="app.speedClick()" class="w-48 h-48 rounded-full bg-gradient-to-br from-electric to-neon shadow-[0_0_30px_rgba(48,207,208,0.5)] active:scale-95 transition-transform flex items-center justify-center text-6xl mx-auto">
                    🎯
                </button>
                <p id="click-count" class="text-3xl font-bold text-white mt-8">0</p>
            </div>`;
    }

    generateGenericGame() {
        return `<div class="text-center"><button onclick="app.completeDemo()" class="btn-premium">Završi Demo</button></div>`;
    }

    flipCard(index) {
        if (window.audioManager) window.audioManager.playClick();

        const card = document.querySelector(`[data-index="${index}"]`);
        const icon = card.querySelector('.card-icon');
        icon.classList.remove('opacity-0');

        setTimeout(() => {
            if (window.audioManager) window.audioManager.sounds.success.play();
            this.currentGameState.correct++;
            this.updateScore(10);
        }, 500);
    }

    checkAnswer(selected, correct) {
        if (selected === correct) {
            if (window.audioManager) window.audioManager.playSuccess();
            this.updateScore(20);
            this.loadGameContent(this.currentGame);
        } else {
            if (window.audioManager) window.audioManager.playError();
        }
        this.currentGameState.total++;
    }

    speedClick() {
        if (window.audioManager) window.audioManager.sounds.click.play();
        this.currentGameState.correct++;
        this.updateScore(5);
        document.getElementById('click-count').textContent = this.currentGameState.correct;
    }

    updateScore(points) {
        this.currentGameState.score += points;
        document.getElementById('current-score').textContent = this.currentGameState.score;
    }

    startGameTimer() {
        this.gameTimer = setInterval(() => {
            this.currentGameState.timeRemaining--;
            const m = Math.floor(this.currentGameState.timeRemaining / 60);
            const s = this.currentGameState.timeRemaining % 60;
            document.getElementById('game-timer').textContent = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;

            if (this.currentGameState.timeRemaining <= 0) this.endGame();
        }, 1000);
    }

    endGame() {
        clearInterval(this.gameTimer);
        if (window.audioManager) window.audioManager.stopMusic();

        this.stats.gamesPlayed++;
        this.stats.totalPoints += this.currentGameState.score;
        const accuracy = this.currentGameState.total > 0 ? Math.round((this.currentGameState.correct / this.currentGameState.total) * 100) : 0;

        if (accuracy > 60) this.stats.streak++; else this.stats.streak = 0;

        const inc = accuracy / 1000;
        if (this.currentGame.category === 'memory') this.userProfile.memory += inc;
        else if (this.currentGame.category === 'logic') this.userProfile.logic += inc;
        else if (this.currentGame.category === 'speed') this.userProfile.speed += inc;

        this.saveUserData();
        this.showResults({ score: this.currentGameState.score, time: this.currentGame.time_limit_sec - this.currentGameState.timeRemaining, accuracy, points: this.currentGameState.score });

        if (window.audioManager) {
            if (this.currentGameState.score > 200) window.audioManager.triggerNeuromaster('NEW_RECORD');
            else window.audioManager.triggerNeuromaster('LOGIC_MASTER');
        }
    }

    showResults(results) {
        this.showScreen('results');
        document.getElementById('final-score').textContent = results.score;
        document.getElementById('result-accuracy').textContent = results.accuracy + '%';
        document.getElementById('ai-feedback-text').textContent =
            results.accuracy > 80 ? "Fantastična performansa. Tvoji sinaptički putevi su optimizovani." :
                "Dobar pokušaj. Detektujem prostor za poboljšanje fokusa.";

        const circle = document.getElementById('score-circle');
        const offset = 565.48 - (results.score / 500) * 565.48;
        circle.style.strokeDashoffset = Math.max(0, offset);
    }

    async generateAIGame() {
        console.log('🤖 AI generating personalized game...');

        try {
            const response = await fetch('/api/generate-game', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userProfile: {
                        skills: {
                            memory: this.userProfile.memory || 0.5,
                            logic: this.userProfile.logic || 0.5,
                            speed: this.userProfile.speed || 0.5
                        },
                        fatigue: this.userProfile.fatigue_level || 0.3,
                        recentGames: []
                    }
                })
            });

            if (response.ok) {
                const aiGame = await response.json();
                console.log('✨ AI generated game:', aiGame.name);
                this.startGame(aiGame);
            } else {
                console.warn('⚠️ AI generation failed, using fallback');
                this.startGame(this.games[Math.floor(Math.random() * this.games.length)]);
            }
        } catch (error) {
            console.error('❌ AI generation error:', error);
            this.startGame(this.games[Math.floor(Math.random() * this.games.length)]);
        }
    }

    async playTTS(text) { console.log('TTS:', text); }
}

let app;
window.addEventListener('DOMContentLoaded', () => { app = new IQPlayApp(); });

// Global functions
function showScreen(s) { app?.showScreen(s); }
function selectCategory(c) {
    if (!app) return;
    const games = app.games.filter(g => g.category === c);
    app.showScreen('games');
    document.getElementById('category-title').textContent = app.getCategoryNameBS(c);
    document.getElementById('games-list').innerHTML = games.map(g => `
        <div class="glass-card p-5 mb-4 cursor-pointer hover:border-electric transition-colors" onclick="app.startGame(app.games.find(x => x.id === '${g.id}'))">
            <h3 class="text-xl font-bold text-white mb-2">${g.name}</h3>
            <div class="flex gap-4 text-xs text-white/50 uppercase tracking-widest">
                <span>⚡ ${g.difficulty_levels} Lvl</span>
                <span>⏱️ ${g.time_limit_sec}s</span>
            </div>
        </div>
    `).join('');
}
function generateAIGame() { app?.generateAIGame(); }
function playVoiceHint() { window.audioManager?.triggerNeuromaster('WELCOME'); }
function playFeedbackVoice() { window.audioManager?.triggerNeuromaster('LOGIC_MASTER'); }
function quitGame() { if (confirm('Odustati?')) { clearInterval(app.gameTimer); showScreen('home'); window.audioManager?.stopMusic(); } }
function playAgain() { app?.startGame(app.currentGame); }
