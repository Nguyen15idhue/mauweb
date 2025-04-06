document.addEventListener('DOMContentLoaded', function() {
    // Game elements
    const gameContainer = document.querySelector('.game-container');
    const leftPaddle = document.getElementById('leftPaddle');
    const rightPaddle = document.getElementById('rightPaddle');
    const ball = document.querySelector('.ball');
    const playerScoreDisplay = document.getElementById('playerScore');
    const computerScoreDisplay = document.getElementById('computerScore');
    const gameOverScreen = document.querySelector('.game-over');
    const winnerText = document.getElementById('winnerText');
    const startButton = document.getElementById('startButton');
    const pauseButton = document.getElementById('pauseButton');
    const restartButton = document.getElementById('restartButton');
    
    // Sound effects
    const paddleSound = document.getElementById('paddleSound');
    const wallSound = document.getElementById('wallSound');
    const scoreSound = document.getElementById('scoreSound');
    
    // Game constants
    const MAX_SPEED = 15;
    const SCORE_COOLDOWN = 1000;
    const INITIAL_BALL_SPEED = 5;
    
    // Game variables
    let gameWidth = gameContainer.offsetWidth;
    let gameHeight = gameContainer.offsetHeight;
    let paddleHeight = 100;
    let paddleWidth = 15;
    let ballSize = 20;
    
    let leftPaddleY = gameHeight / 2 - paddleHeight / 2;
    let rightPaddleY = gameHeight / 2 - paddleHeight / 2;
    let ballX = gameWidth / 2 - ballSize / 2;
    let ballY = gameHeight / 2 - ballSize / 2;
    
    let ballSpeedX = INITIAL_BALL_SPEED;
    let ballSpeedY = INITIAL_BALL_SPEED;
    let computerSpeed = 4;
    
    let playerScore = 0;
    let computerScore = 0;
    let canScore = true;
    
    let gameRunning = false;
    let gamePaused = false;
    let animationFrameId;
    
    // Event listeners
    startButton.addEventListener('click', startGame);
    pauseButton.addEventListener('click', togglePause);
    restartButton.addEventListener('click', resetGame);
    
    // Mouse movement for player paddle
    gameContainer.addEventListener('mousemove', (e) => {
        if (!gameRunning || gamePaused) return;
        
        const rect = gameContainer.getBoundingClientRect();
        const mouseY = e.clientY - rect.top - paddleHeight / 2;
        leftPaddleY = Math.max(0, Math.min(gameHeight - paddleHeight, mouseY));
        leftPaddle.style.top = leftPaddleY + 'px';
    });
    
    // Touch movement for mobile
    gameContainer.addEventListener('touchmove', (e) => {
        if (!gameRunning || gamePaused) return;
        e.preventDefault();
        
        const rect = gameContainer.getBoundingClientRect();
        const touchY = e.touches[0].clientY - rect.top - paddleHeight / 2;
        leftPaddleY = Math.max(0, Math.min(gameHeight - paddleHeight, touchY));
        leftPaddle.style.top = leftPaddleY + 'px';
    });
    
    function startGame() {
        if (gameRunning) return;
        
        gameRunning = true;
        gamePaused = false;
        startButton.textContent = 'Restart';
        
        if (playerScore > 0 || computerScore > 0) {
            resetGame();
        }
        
        gameOverScreen.classList.remove('show');
        resetBall();
        gameLoop();
    }
    
    function togglePause() {
        if (!gameRunning) return;
        
        gamePaused = !gamePaused;
        pauseButton.textContent = gamePaused ? 'Resume' : 'Pause';
        
        if (gamePaused) {
            cancelAnimationFrame(animationFrameId);
        } else {
            gameLoop();
        }
    }
    
    function resetGame() {
        gameRunning = false;
        gamePaused = false;
        playerScore = 0;
        computerScore = 0;
        playerScoreDisplay.textContent = '0';
        computerScoreDisplay.textContent = '0';
        gameOverScreen.classList.remove('show');
        startButton.textContent = 'Start Game';
        pauseButton.textContent = 'Pause';
        canScore = true;
        resetBall();
    }
    
    function resetBall() {
        ballX = gameWidth / 2 - ballSize / 2;
        ballY = gameHeight / 2 - ballSize / 2;
        
        ballSpeedX = Math.random() > 0.5 ? INITIAL_BALL_SPEED : -INITIAL_BALL_SPEED;
        ballSpeedY = (Math.random() * 2 - 1) * INITIAL_BALL_SPEED;
        
        ball.style.left = ballX + 'px';
        ball.style.top = ballY + 'px';
    }
    
    function createParticles(x, y, color) {
        for (let i = 0; i < 10; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = x + 'px';
            particle.style.top = y + 'px';
            particle.style.background = color;
            
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 3 + 1;
            const vx = Math.cos(angle) * speed;
            const vy = Math.sin(angle) * speed;
            
            gameContainer.appendChild(particle);
            
            let life = 0;
            const particleInterval = setInterval(() => {
                life++;
                x += vx;
                y += vy;
                particle.style.left = x + 'px';
                particle.style.top = y + 'px';
                particle.style.opacity = 1 - life / 30;
                
                if (life >= 30) {
                    clearInterval(particleInterval);
                    particle.remove();
                }
            }, 16);
        }
    }
    
    function gameLoop() {
        if (gamePaused) return;
        
        ballX += ballSpeedX;
        ballY += ballSpeedY;
        
        // Wall collisions
        if (ballY <= 0 || ballY >= gameHeight - ballSize) {
            ballSpeedY = -ballSpeedY;
            if (wallSound) wallSound.play();
            createParticles(ballX, ballY <= 0 ? 0 : gameHeight - ballSize, '#ffffff');
            
            // Add speed limiter
            ballSpeedX = Math.min(Math.max(-MAX_SPEED, ballSpeedX * 1.02), MAX_SPEED);
            ballSpeedY = Math.min(Math.max(-MAX_SPEED, ballSpeedY * 1.02), MAX_SPEED);
        }
        
        // Paddle collisions
        // Left paddle
        if (ballX <= paddleWidth + 15 && 
            ballY + ballSize >= leftPaddleY && 
            ballY <= leftPaddleY + paddleHeight &&
            ballSpeedX < 0) {
            
            const hitPosition = (ballY - leftPaddleY) / paddleHeight;
            const bounceAngle = (hitPosition - 0.5) * Math.PI / 3;
            
            const speed = Math.min(
                Math.sqrt(ballSpeedX * ballSpeedX + ballSpeedY * ballSpeedY) * 1.05,
                MAX_SPEED
            );
            
            ballSpeedX = Math.abs(Math.cos(bounceAngle) * speed);
            ballSpeedY = Math.sin(bounceAngle) * speed;
            
            if (paddleSound) paddleSound.play();
            createParticles(ballX, ballY, '#00ff9d');
            
            leftPaddle.classList.add('pulse');
            setTimeout(() => leftPaddle.classList.remove('pulse'), 500);
        }
        
        // Right paddle
        if (ballX >= gameWidth - paddleWidth - 15 - ballSize && 
            ballY + ballSize >= rightPaddleY && 
            ballY <= rightPaddleY + paddleHeight &&
            ballSpeedX > 0) {
            
            const hitPosition = (ballY - rightPaddleY) / paddleHeight;
            const bounceAngle = Math.PI - (hitPosition - 0.5) * Math.PI / 3;
            
            const speed = Math.min(
                Math.sqrt(ballSpeedX * ballSpeedX + ballSpeedY * ballSpeedY) * 1.05,
                MAX_SPEED
            );
            
            ballSpeedX = -Math.abs(Math.cos(bounceAngle) * speed);
            ballSpeedY = Math.sin(bounceAngle) * speed;
            
            if (paddleSound) paddleSound.play();
            createParticles(ballX, ballY, '#ff00aa');
            
            rightPaddle.classList.add('pulse');
            setTimeout(() => rightPaddle.classList.remove('pulse'), 500);
        }
        
        // Scoring
        if (ballX < 0 && canScore) {
            computerScore++;
            computerScoreDisplay.textContent = computerScore;
            if (scoreSound) scoreSound.play();
            canScore = false;
            
            setTimeout(() => {
                canScore = true;
            }, SCORE_COOLDOWN);
            
            if (computerScore >= 5) {
                gameOver(false);
            } else {
                resetBall();
            }
        } else if (ballX > gameWidth - ballSize && canScore) {
            playerScore++;
            playerScoreDisplay.textContent = playerScore;
            if (scoreSound) scoreSound.play();
            canScore = false;
            
            setTimeout(() => {
                canScore = true;
            }, SCORE_COOLDOWN);
            
            if (playerScore >= 5) {
                gameOver(true);
            } else {
                resetBall();
            }
        }
        
        // Computer AI
        if (gameRunning && !gamePaused) {
            const difficulty = Math.min(1 + (playerScore * 0.1), 2);
            const aiSpeed = computerSpeed * difficulty;
            
            if (ballSpeedX > 0) {
                const predictedY = ballY + (ballSpeedY * ((gameWidth - paddleWidth - ballX) / ballSpeedX));
                const targetY = Math.max(0, Math.min(gameHeight - paddleHeight, predictedY - paddleHeight / 2));
                
                const difference = targetY - rightPaddleY;
                rightPaddleY += Math.sign(difference) * Math.min(Math.abs(difference), aiSpeed);
            }
            
            rightPaddle.style.top = rightPaddleY + 'px';
        }
        
        ball.style.left = ballX + 'px';
        ball.style.top = ballY + 'px';
        
        animationFrameId = requestAnimationFrame(gameLoop);
    }
    
    function gameOver(playerWon) {
        gameRunning = false;
        cancelAnimationFrame(animationFrameId);
        
        winnerText.textContent = playerWon ? 'Player Wins!' : 'Computer Wins!';
        winnerText.style.color = playerWon ? '#00ff9d' : '#ff00aa';
        
        for (let i = 0; i < 50; i++) {
            const x = Math.random() * gameWidth;
            const y = Math.random() * gameHeight;
            createParticles(x, y, playerWon ? '#00ff9d' : '#ff00aa');
        }
        
        gameOverScreen.classList.add('show');
        
        // Save score
        fetch('save_score.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                player_score: playerScore,
                computer_score: computerScore,
                winner: playerWon ? 'player' : 'computer'
            }),
        })
        .then(response => response.json())
        .then(data => console.log('Score saved:', data))
        .catch(error => console.error('Error saving score:', error));
    }
    
    // Handle window resize
    window.addEventListener('resize', () => {
        gameWidth = gameContainer.offsetWidth;
        gameHeight = gameContainer.offsetHeight;
        
        leftPaddleY = Math.max(0, Math.min(gameHeight - paddleHeight, leftPaddleY));
        rightPaddleY = Math.max(0, Math.min(gameHeight - paddleHeight, rightPaddleY));
        ballY = Math.max(0, Math.min(gameHeight - ballSize, ballY));
        
        leftPaddle.style.top = leftPaddleY + 'px';
        rightPaddle.style.top = rightPaddleY + 'px';
        ball.style.top = ballY + 'px';
    });
});