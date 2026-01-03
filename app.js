// IQPlay Brain Games - Main Application
// Autonomous AI-Powered Game System with Bosnian TTS

class IQPlayApp {
    constructor() {
        this.currentScreen = 'home';
        this.currentGame = null;

        // Load user data from localStorage or create defaults
        this.loadUserData();

        this.games = [];
        this.audioEnabled = true;
        this.currentAudio = null;

        this.init();
    }

    // Load user data from localStorage
    loadUserData() {
        const savedData = localStorage.getItem('iqplay_userdata');

        if (savedData) {
            const data = JSON.parse(savedData);
            this.userName = data.userName || 'Igrač';
            this.userProfile = data.userProfile || {
                memory: 0,
                logic: 0,
                speed: 0,
                fatigue_level: 0
            };
            this.stats = data.stats || {
                gamesPlayed: 0,
                totalPoints: 0,
                winRate: 0,
                streak: 0
            };
        } else {
            // First time - show name input
            this.userName = this.promptUserName();
            this.userProfile = {
                memory: 0,
                logic: 0,
                speed: 0,
                fatigue_level: 0
            };
            this.stats = {
                gamesPlayed: 0,
                totalPoints: 0,
                winRate: 0,
                streak: 0
            };
            this.saveUserData();
        }
    }

    // Save user data to localStorage
    saveUserData() {
        const data = {
            userName: this.userName,
            userProfile: this.userProfile,
            stats: this.stats
        };
        localStorage.setItem('iqplay_userdata', JSON.stringify(data));
        this.updateUI();
    }

    // Reset all data
    resetUserData() {
        if (confirm('Da li ste sigurni da želite resetovati sve podatke? Ova akcija se ne može poništiti.')) {
            this.stats = {
                gamesPlayed: 0,
                totalPoints: 0,
                winRate: 0,
                streak: 0
            };
            this.userProfile = {
                memory: 0,
                logic: 0,
                speed: 0,
                fatigue_level: 0
            };
            this.saveUserData();
            alert('Svi podaci su resetovani!');
        }
    }

    // Prompt for user name
    promptUserName() {
        let name = prompt('Unesite vaše ime:', 'Igrač');
        return name && name.trim() ? name.trim() : 'Igrač';
    }

    // Change user name
    changeUserName() {
        const newName = prompt('Unesite novo ime:', this.userName);
        if (newName && newName.trim()) {
            this.userName = newName.trim();
            this.saveUserData();
        }
    }

    // Update UI with current user data
    updateUI() {
        // Update user name displays
        const nameElements = document.querySelectorAll('.user-name, .profile-name');
        nameElements.forEach(el => el.textContent = this.userName);

        // Update stats displays
        document.getElementById('games-played').textContent = this.stats.gamesPlayed;
        document.getElementById('total-points').textContent = this.stats.totalPoints.toLocaleString();
        document.getElementById('win-rate').textContent = this.stats.winRate + '%';
        document.getElementById('streak').textContent = this.stats.streak;

        // Update skill bars
        const memoryPercent = Math.round(this.userProfile.memory * 100);
        const logicPercent = Math.round(this.userProfile.logic * 100);
        const speedPercent = Math.round(this.userProfile.speed * 100);

        // Update profile screen skills if elements exist
        const skillBars = document.querySelectorAll('.skill-item');
        if (skillBars.length >= 3) {
            skillBars[0].querySelector('.skill-header span:last-child').textContent = memoryPercent + '%';
            skillBars[0].querySelector('.skill-fill').style.width = memoryPercent + '%';

            skillBars[1].querySelector('.skill-header span:last-child').textContent = logicPercent + '%';
            skillBars[1].querySelector('.skill-fill').style.width = logicPercent + '%';

            skillBars[2].querySelector('.skill-header span:last-child').textContent = speedPercent + '%';
            skillBars[2].querySelector('.skill-fill').style.width = speedPercent + '%';
        }
    }

    async init() {
        console.log('🎮 IQPlay initializing...');

        // Show loading screen
        this.showLoading();

        // Load games from backend
        await this.loadGames();

        // Preload audio
        await this.preloadAudio();

        // Update UI with saved data
        setTimeout(() => {
            this.updateUI();
        }, 100);

        // Hide loading screen
        setTimeout(() => {
            this.hideLoading();
        }, 2000);

        // Setup event listeners
        this.setupEventListeners();

        console.log('✅ IQPlay ready!');
    }

    showLoading() {
        document.getElementById('loading-screen').classList.add('active');
    }

    hideLoading() {
        document.getElementById('loading-screen').classList.remove('active');
    }

    async loadGames() {
        try {
            const response = await fetch('/api/games');
            this.games = await response.json();
            console.log(`📚 Loaded ${this.games.length} games`);
        } catch (error) {
            console.error('Failed to load games:', error);
            // Fallback: use mock data
            this.games = this.generateMockGames();
        }
    }

    generateMockGames() {
        const categories = ['memory', 'logic', 'math', 'attention', 'speed', 'language'];
        const games = [];

        categories.forEach((category, catIndex) => {
            for (let i = 1; i <= 8; i++) {
                games.push({
                    id: `${category}_${i}`,
                    category: category,
                    name: `${this.getCategoryNameBS(category)} ${i}`,
                    difficulty_levels: 10,
                    time_limit_sec: 45,
                    fun_score: 0.7 + Math.random() * 0.3,
                    tts: {
                        intro: `Dobrodošli u igru ${category}!`,
                        outro: 'Odličan rad!'
                    }
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
            math: 'Matematika',
            attention: 'Pažnja',
            language: 'Jezik'
        };
        return names[category] || category;
    }

    setupEventListeners() {
        // Navigation handled by global functions
    }

    async preloadAudio() {
        console.log('🎵 Preloading audio...');
        // In production, this would load actual audio files
    }

    // Generate AI Game
    async generateAIGame() {
        console.log('✨ AI generating custom game...');

        try {
            const response = await fetch('/api/games/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userProfile: this.userProfile })
            });

            const aiGame = await response.json();

            if (aiGame.fun_score < 0.7) {
                console.warn('Game rejected: fun_score too low');
                return this.generateAIGame(); // Retry
            }

            // Play TTS introduction
            await this.playTTS(aiGame.tts.intro);

            // Start the AI-generated game
            this.startGame(aiGame);

        } catch (error) {
            console.error('AI game generation failed:', error);
            // Fallback: pick a random game
            const randomGame = this.games[Math.floor(Math.random() * this.games.length)];
            this.startGame(randomGame);
        }
    }

    // Play Bosnian TTS
    async playTTS(text) {
        if (!this.audioEnabled) return;

        try {
            const response = await fetch('/api/tts/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text })
            });

            const { audioUrl } = await response.json();

            // Duck music volume
            this.duckMusic();

            // Play TTS (in production, would use actual audio)
            console.log(`🔊 TTS: ${text}`);

            // Show text fallback
            this.showToast(text);

            // Restore music after estimated duration
            setTimeout(() => {
                this.restoreMusic();
            }, text.length * 50); // Rough estimate

        } catch (error) {
            console.error('TTS failed:', error);
            // Fallback: show text
            this.showToast(text);
        }
    }

    showToast(message) {
        // Create toast notification
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            bottom: 100px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.9);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 12px;
            z-index: 10000;
            animation: fadeIn 0.3s ease;
        `;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.remove();
        }, 3000);
    }

    duckMusic() {
        // Lower music volume when voice speaks
        if (this.currentAudio) {
            this.currentAudio.volume = 0.25;
        }
    }

    restoreMusic() {
        // Restore music volume after voice
        if (this.currentAudio) {
            this.currentAudio.volume = 1.0;
        }
    }

    // Start a game
    startGame(game) {
        this.currentGame = game;
        this.currentGameState = {
            score: 0,
            timeRemaining: game.time_limit_sec,
            startTime: Date.now(),
            correct: 0,
            total: 0
        };

        // Play intro TTS
        this.playTTS(game.tts.intro);

        // Show gameplay screen
        this.showScreen('gameplay');

        // Load game content
        this.loadGameContent(game);

        // Start timer
        this.startGameTimer();

        // Play game music
        this.playGameMusic(game);
    }

    loadGameContent(game) {
        const gameContent = document.getElementById('game-content');

        // Generate demo game based on category
        if (game.category === 'memory') {
            gameContent.innerHTML = this.generateMemoryGame();
        } else if (game.category === 'math') {
            gameContent.innerHTML = this.generateMathGame();
        } else if (game.category === 'logic') {
            gameContent.innerHTML = this.generateLogicGame();
        } else if (game.category === 'speed') {
            gameContent.innerHTML = this.generateSpeedGame();
        } else {
            gameContent.innerHTML = this.generateGenericGame();
        }
    }

    generateMemoryGame() {
        const colors = ['#6C5CE7', '#00B894', '#FDCB6E', '#E17055', '#0984E3', '#FD79A8'];
        const gridSize = 4;
        let html = '<div class="memory-grid" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; padding: 1rem;">';

        for (let i = 0; i < gridSize * gridSize; i++) {
            const color = colors[Math.floor(i / 2) % colors.length];
            html += `
                <div class="memory-card" onclick="app.flipCard(${i})" style="
                    aspect-ratio: 1;
                    background: linear-gradient(135deg, ${color} 0%, ${color}dd 100%);
                    border-radius: 16px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 2rem;
                    cursor: pointer;
                    transition: transform 0.3s;
                " data-index="${i}" data-color="${color}">
                    <span class="card-icon" style="opacity: 0;">🎯</span>
                </div>
            `;
        }

        html += '</div>';
        return html;
    }

    generateMathGame() {
        const num1 = Math.floor(Math.random() * 20) + 1;
        const num2 = Math.floor(Math.random() * 20) + 1;
        const operations = ['+', '-', '*'];
        const op = operations[Math.floor(Math.random() * operations.length)];

        let answer;
        switch (op) {
            case '+': answer = num1 + num2; break;
            case '-': answer = num1 - num2; break;
            case '*': answer = num1 * num2; break;
        }

        const wrong1 = answer + Math.floor(Math.random() * 10) + 1;
        const wrong2 = answer - Math.floor(Math.random() * 10) - 1;
        const options = [answer, wrong1, wrong2].sort(() => Math.random() - 0.5);

        return `
            <div class="math-game" style="padding: 2rem; text-align: center;">
                <h2 style="font-size: 3rem; margin-bottom: 2rem;">${num1} ${op} ${num2} = ?</h2>
                <div class="answer-buttons" style="display: grid; gap: 1rem;">
                    ${options.map(opt => `
                        <button onclick="app.checkAnswer(${opt}, ${answer})" class="btn-primary" style="font-size: 1.5rem; padding: 1.5rem;">
                            ${opt}
                        </button>
                    `).join('')}
                </div>
            </div>
        `;
    }

    generateLogicGame() {
        const sequence = [2, 4, 6, 8];
        const nextNumber = 10;
        const options = [nextNumber, 9, 12, 11].sort(() => Math.random() - 0.5);

        return `
            <div class="logic-game" style="padding: 2rem; text-align: center;">
                <h3 style="margin-bottom: 2rem;">Pronađi sljedeći broj u nizu:</h3>
                <h2 style="font-size: 2rem; margin-bottom: 2rem;">${sequence.join(', ')}, ?</h2>
                <div class="answer-buttons" style="display: grid; gap: 1rem;">
                    ${options.map(opt => `
                        <button onclick="app.checkAnswer(${opt}, ${nextNumber})" class="btn-primary" style="font-size: 1.5rem; padding: 1.5rem;">
                            ${opt}
                        </button>
                    `).join('')}
                </div>
            </div>
        `;
    }

    generateSpeedGame() {
        return `
            <div class="speed-game" style="padding: 2rem; text-align: center;">
                <h3 style="margin-bottom: 2rem;">Klikni što brže!</h3>
                <button onclick="app.speedClick()" class="btn-primary" style="
                    width: 200px;
                    height: 200px;
                    border-radius: 50%;
                    font-size: 3rem;
                    margin: 2rem auto;
                ">
                    🎯
                </button>
                <p id="click-count" style="font-size: 2rem; margin-top: 1rem;">Klikova: 0</p>
            </div>
        `;
    }

    generateGenericGame() {
        return `
            <div class="generic-game" style="padding: 2rem; text-align: center;">
                <h2 style="margin-bottom: 2rem;">Demo Igra</h2>
                <button onclick="app.completeDemo()" class="btn-primary">Završi Demo</button>
            </div>
        `;
    }

    flipCard(index) {
        const card = document.querySelector(`[data-index="${index}"]`);
        const icon = card.querySelector('.card-icon');
        icon.style.opacity = icon.style.opacity === '1' ? '0' : '1';

        // Check for matches (simplified)
        setTimeout(() => {
            this.currentGameState.correct++;
            this.updateScore(10);
        }, 500);
    }

    checkAnswer(selected, correct) {
        if (selected === correct) {
            this.updateScore(20);
            this.playTTS('Tačno!');
            this.loadGameContent(this.currentGame); // Load next question
        } else {
            this.playTTS('Pokušaj ponovo!');
        }
        this.currentGameState.total++;
    }

    speedClick() {
        this.currentGameState.correct++;
        this.updateScore(5);
        document.getElementById('click-count').textContent = `Klikova: ${this.currentGameState.correct}`;
    }

    completeDemo() {
        this.updateScore(50);
        this.endGame();
    }

    updateScore(points) {
        this.currentGameState.score += points;
        document.getElementById('current-score').textContent = this.currentGameState.score;
    }

    startGameTimer() {
        this.gameTimer = setInterval(() => {
            this.currentGameState.timeRemaining--;

            const mins = Math.floor(this.currentGameState.timeRemaining / 60);
            const secs = this.currentGameState.timeRemaining % 60;
            document.getElementById('game-timer').textContent =
                `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

            if (this.currentGameState.timeRemaining <= 10) {
                // Play warning sound
                console.log('⏰ Time warning!');
            }

            if (this.currentGameState.timeRemaining <= 0) {
                this.endGame();
            }
        }, 1000);
    }

    endGame() {
        clearInterval(this.gameTimer);

        // Calculate final stats
        const timeSpent = this.currentGame.time_limit_sec - this.currentGameState.timeRemaining;
        const accuracy = this.currentGameState.total > 0
            ? Math.round((this.currentGameState.correct / this.currentGameState.total) * 100)
            : 0;

        // Update stats
        this.stats.gamesPlayed++;
        this.stats.totalPoints += this.currentGameState.score;

        // Update win rate
        if (accuracy >= 60) {
            this.stats.streak++;
        } else {
            this.stats.streak = 0;
        }

        // Calculate overall win rate
        this.stats.winRate = Math.round(
            (this.stats.winRate * (this.stats.gamesPlayed - 1) + accuracy) / this.stats.gamesPlayed
        );

        // Update skill based on game category
        const skillIncrease = accuracy / 1000; // Small incremental improvement
        if (this.currentGame.category === 'memory') {
            this.userProfile.memory = Math.min(1, this.userProfile.memory + skillIncrease);
        } else if (this.currentGame.category === 'logic') {
            this.userProfile.logic = Math.min(1, this.userProfile.logic + skillIncrease);
        } else if (this.currentGame.category === 'speed') {
            this.userProfile.speed = Math.min(1, this.userProfile.speed + skillIncrease);
        }

        // Save to localStorage
        this.saveUserData();

        // Show results
        this.showResults({
            score: this.currentGameState.score,
            time: timeSpent,
            accuracy: accuracy,
            points: this.currentGameState.score
        });

        // Play outro TTS
        this.playTTS(this.currentGame.tts.outro);
    }

    showResults(results) {
        this.showScreen('results');

        // Animate score
        document.getElementById('final-score').textContent = results.score;
        document.getElementById('result-time').textContent = `${results.time}s`;
        document.getElementById('result-accuracy').textContent = `${results.accuracy}%`;
        document.getElementById('result-points').textContent = `+${results.points}`;

        // AI Feedback
        const feedback = this.generateAIFeedback(results);
        document.getElementById('ai-feedback-text').textContent = feedback;

        // Animate progress circle
        const circle = document.getElementById('score-circle');
        const circumference = 2 * Math.PI * 80;
        const progress = (results.score / 100) * circumference;
        circle.style.strokeDasharray = `${progress} ${circumference}`;
    }

    generateAIFeedback(results) {
        if (results.accuracy > 80) {
            return 'Fantastično! Tvoja tačnost je izvanredna. Mozak ti radi sve brže!';
        } else if (results.accuracy > 60) {
            return 'Odličan napredak! Nastavi vježbati i dosegni savršenstvo.';
        } else {
            return 'Dobar pokušaj! Svaka igra te čini boljim. Ne odustaj!';
        }
    }

    playGameMusic(game) {
        // In production, load actual music based on game category
        console.log(`🎵 Playing music for ${game.category}`);
    }

    showScreen(screenName) {
        // Hide all screens
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });

        // Show target screen
        document.getElementById(`${screenName}-screen`).classList.add('active');

        // Update navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });

        this.currentScreen = screenName;
    }
}

// Initialize app
let app;

window.addEventListener('DOMContentLoaded', () => {
    app = new IQPlayApp();
});

// Global functions for UI interaction
function showScreen(screen) {
    if (app) app.showScreen(screen);
}

function selectCategory(category) {
    console.log(`Selected category: ${category}`);
    const categoryGames = app.games.filter(g => g.category === category);

    // Show games screen with filtered games
    showScreen('games');
    document.getElementById('category-title').textContent = app.getCategoryNameBS(category);

    // Load games into grid
    const gamesList = document.getElementById('games-list');
    gamesList.innerHTML = categoryGames.map(game => `
        <div class="game-card" onclick="app.startGame(app.games.find(g => g.id === '${game.id}'))">
            <h3 style="font-size: 1.25rem; margin-bottom: 0.5rem;">${game.name}</h3>
            <p style="color: var(--text-secondary); font-size: 0.875rem;">Težina: ${game.difficulty_levels} nivoa</p>
            <p style="color: var(--text-secondary); font-size: 0.875rem;">Vrijeme: ${game.time_limit_sec}s</p>
        </div>
    `).join('');
}

function generateAIGame() {
    if (app) app.generateAIGame();
}

function playVoiceHint() {
    if (app) app.playTTS(document.getElementById('ai-message').textContent);
}

function playFeedbackVoice() {
    if (app) app.playTTS(document.getElementById('ai-feedback-text').textContent);
}

function quitGame() {
    if (confirm('Da li želite napustiti igru?')) {
        clearInterval(app.gameTimer);
        showScreen('home');
    }
}

function playAgain() {
    if (app && app.currentGame) {
        app.startGame(app.currentGame);
    }
}
