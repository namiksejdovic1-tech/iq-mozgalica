// Netlify Serverless Function: AI Game Generator
// Endpoint: /.netlify/functions/generate-game

const gameGenerator = require('../../engine/game-generator');

exports.handler = async (event, context) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Content-Type': 'application/json'
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    if (event.httpMethod === 'POST') {
        try {
            const { userProfile } = JSON.parse(event.body || '{}');
            
            const newGame = await gameGenerator.generateGame(userProfile || {
                skills: { memory: 50, logic: 50, math: 50, speed: 50, attention: 50, language: 50 },
                fatigue: 0.3,
                recentGames: []
            });

            // Validate fun score
            if (newGame.fun_score < 0.7) {
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({ 
                        error: 'Game rejected: fun_score too low', 
                        score: newGame.fun_score 
                    })
                };
            }

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify(newGame)
            };
        } catch (error) {
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({ error: error.message })
            };
        }
    }

    return {
        statusCode: 405,
        headers,
        body: JSON.stringify({ error: 'Method not allowed' })
    };
};
