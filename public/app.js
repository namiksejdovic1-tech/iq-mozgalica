// IQPlay Brain Games - Main Application
// Autonomous AI-Powered Game System with Bosnian TTS
// Updated for Premium UI/UX & Neuromaster Audio

class IQPlayApp {
        constructor() {
                    this.currentScreen = 'home';
                    this.currentGame = null;
                    this.games = [];
                    this.userData = this.loadUserData();
                    this.init();
        }

    loadUserData() {
                const saved = localStorage.getItem('iqplay_userdata');
                if (saved) return JSON.parse(saved);
                return {
                                userName: 'Gost',
                                stats: { gamesPlayed: 0, totalPoints: 0, level: 1 }
                };
    }

    saveUserData() {
                localStorage.setItem('iqplay_userdata', JSON.stringify(this.userData));
    }

    async init() {
                this.setupEventListeners();
                await this.loadGames();
                this.showScreen('home');
    }

    setupEventListeners() {
                document.querySelectorAll('.nav-btn').forEach(btn => {
                                btn.addEventListener('click', (e) => {
                                                    this.showScreen(e.currentTarget.dataset.screen);
                                });
                });
    }

    async loadGames() {
                try {
                                const response = await fetch('/.netlify/functions/getGames');
                                const data = await response.json();
                                this.games = data.map(game => ({
                                                    id: game.id,
                                                    name: game.title || game.name,
                                                    category: game.category,
                                                    description: game.description,
                                                    difficulty: game.difficulty || 'Normal',
                                                    icon: this.getIcon(game.category)
                                }));
                } catch (error) {
                                console.error('Failed to load games:', error);
                }
    }

    getIcon(cat) {
                const icons = { memory: 'brain', logic: 'puzzle', speed: 'bolt', quiz: 'question' };
                return icons[cat] || 'gamepad';
    }

    showScreen(screenId) {
                this.currentScreen = screenId;
                document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
                const target = document.getElementById(`${screenId}-screen`);
                if (target) {
                                target.classList.add('active');
                                if (screenId === 'games') this.renderGames();
                }
    }

    renderGames(category = 'all') {
                const container = document.getElementById('games-list');
                if (!container) return;
                const filtered = category === 'all' ? this.games : this.games.filter(g => g.category === category);
                container.innerHTML = filtered.map(game => `
                            <div class="game-card" onclick="app.startGame('${game.id}')">
                                            <div class="game-icon">${game.icon}</div>
                                                            <h3>${game.name}</h3>
                                                                            <p>${game.category.toUpperCase()}</p>
                                                                                        </div>
                                                                                                           `).join('');
    }

    startGame(gameId) {
                this.currentGame = this.games.find(g => g.id === gameId);
                this.showScreen('game-play');
    }
}

const app = new IQPlayApp();
