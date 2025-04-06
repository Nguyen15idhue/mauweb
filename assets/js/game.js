// Game elements
document.addEventListener('DOMContentLoaded', function() {
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
    
    let ballSpeedX = 5;
    let ballSpeedY = 5;
    let computerSpeed = 4;
    
    let playerScore = 0;
    let computerScore = 0;
    
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
        
        // Keep paddle within game boundaries
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
    
    // Start game function
    function startGame() {
        if (gameRunning) return;
        
        gameRunning = true;
        gamePaused = false;
        startButton.textContent = 'Restart';
        
        // Reset scores if game was over
        if (playerScore > 0 || computerScore > 0) {
            playerScore = 0;
            computerScore = 0;
            playerScoreDisplay.textContent = '0';
            computerScoreDisplay.textContent = '0';
        }
        
        // Hide game over screen if visible
        gameOverScreen.classList.remove('show');
        
        // Reset ball position
        resetBall();
        
        // Start game loop
        gameLoop();
    }
    
    // Toggle pause function
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
    
    // Reset game function
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
        resetBall();
    }
    
    // Reset ball position
    function resetBall() {
        ballX = gameWidth / 2 - ballSize / 2;
        ballY = gameHeight / 2 - ballSize / 2;
        
        // Randomize initial direction
        ballSpeedX = Math.random() > 0.5 ? 5 : -5;
        ballSpeedY = (Math.random() * 4 - 2); // Random angle between -2 and 2
        
        // Update ball position
        ball.style.left = ballX + 'px';
        ball.style.top = ballY + 'px';
    }
    
    // Create particles for visual effect
    function createParticles(x, y, color) {
        for (let i = 0; i < 10; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = x + 'px';
            particle.style.top = y + 'px';
            particle.style.background = color;
            
            // Random velocity
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 3 + 1;
            const vx = Math.cos(angle) * speed;
            const vy = Math.sin(angle) * speed;
            
            gameContainer.appendChild(particle);
            
            // Animate particle
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
    
    // Main game loop
    function gameLoop() {
        if (gamePaused) return;
        
        // Update ball position
        ballX += ballSpeedX;
        ballY += ballSpeedY;
        
        // Ball collision with top and bottom walls
        if (ballY <= 0 || ballY >= gameHeight - ballSize) {
            ballSpeedY = -ballSpeedY;
            if (wallSound) wallSound.play();
            createParticles(ballX, ballY <= 0 ? 0 : gameHeight - ballSize, '#ffffff');
            
            // Add slight randomness to bounce
            ballSpeedX *= 1.02;
            ballSpeedY *= 1.02;
        }
        
        // Ball collision with paddles
        // Left paddle
        if (ballX <= paddleWidth + 30 && 
            ballY + ballSize >= leftPaddleY && 
            ballY <= leftPaddleY + paddleHeight) {
            
            // Calculate bounce angle based on where ball hits paddle
            const hitPosition = (ballY - leftPaddleY) / paddleHeight;
            const bounceAngle = (hitPosition - 0.5) * Math.PI / 2;
            
            // Calculate new speed based on angle
            const speed = Math.sqrt(ballSpeedX * ballSpeedX + ballSpeedY * ballSpeedY) * 1.05;
            ballSpeedX = Math.cos(bounceAngle) * speed;
            ballSpeedY = Math.sin(bounceAngle) * speed;
            
            if (paddleSound) paddleSound.play();
            createParticles(ballX, ballY, '#00ff9d');
            
            // Add pulse effect to paddle
            leftPaddle.classList.add('pulse');
            setTimeout(() => leftPaddle.classList.remove('pulse'), 500);
        }
        
        // Right paddle (computer)
        if (ballX >= gameWidth - paddleWidth - 30 - ballSize && 
            ballY + ballSize >= rightPaddleY && 
            ballY <= rightPaddleY + paddleHeight) {
            
            // Calculate bounce angle based on where ball hits paddle
            const hitPosition = (ballY - rightPaddleY) / paddleHeight;
            const bounceAngle = Math.PI - (hitPosition - 0.5) * Math.PI / 2;
            
            // Calculate new speed based on angle
            const speed = Math.sqrt(ballSpeedX * ballSpeedX + ballSpeedY * ballSpeedY) * 1.05;
            ballSpeedX = Math.cos(bounceAngle) * speed;
            ballSpeedY = Math.sin(bounceAngle) * speed;
            
            if (paddleSound) paddleSound.play();
            createParticles(ballX, ballY, '#ff00aa');
            
            // Add pulse effect to paddle
            rightPaddle.classList.add('pulse');
            setTimeout(() => rightPaddle.classList.remove('pulse'), 500);
        }
        
        // Ball out of bounds - scoring
        if (ballX < 0) {
            // Computer scores
            computerScore++;
            computerScoreDisplay.textContent = computerScore;
            if (scoreSound) scoreSound.play();
            
            if (computerScore >= 5) {
                gameOver(false);
            } else {
                resetBall();
            }
        } else if (ballX > gameWidth - ballSize) {
            // Player scores
            playerScore++;
            playerScoreDisplay.textContent = playerScore;
            if (scoreSound) scoreSound.play();
            
            if (playerScore >= 5) {
                gameOver(true);
            } else {
                resetBall();
            }
        }
        
        // Computer AI - simple follow the ball with some delay
        if (gameRunning && !gamePaused) {
            const paddleCenter = rightPaddleY + paddleHeight / 2;
            const ballCenter = ballY + ballSize / 2;
            
            // Only move if ball is coming towards computer
            if (ballSpeedX > 0) {
                if (paddleCenter < ballCenter - 10) {
                    rightPaddleY += computerSpeed;
                } else if (paddleCenter > ballCenter + 10) {
                    rightPaddleY -= computerSpeed;
                }
            }
            
            // Keep computer paddle within bounds
            rightPaddleY = Math.max(0, Math.min(gameHeight - paddleHeight, rightPaddleY));
            rightPaddle.style.top = rightPaddleY + 'px';
        }
        
        // Update ball position on screen
        ball.style.left = ballX + 'px';
        ball.style.top = ballY + 'px';
        
        // Continue game loop
        animationFrameId = requestAnimationFrame(gameLoop);
    }
    
    // Game over function
    function gameOver(playerWon) {
        gameRunning = false;
        cancelAnimationFrame(animationFrameId);
        
        winnerText.textContent = playerWon ? 'Player Wins!' : 'Computer Wins!';
        winnerText.style.color = playerWon ? '#00ff9d' : '#ff00aa';
        
        // Create celebration particles
        for (let i = 0; i < 50; i++) {
            const x = Math.random() * gameWidth;
            const y = Math.random() * gameHeight;
            createParticles(x, y, playerWon ? '#00ff9d' : '#ff00aa');
        }
        
        gameOverScreen.classList.add('show');
        
        // Optional: Save score to server via AJAX
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
        .then(data => {
            console.log('Score saved:', data);
        })
        .catch((error) => {
            console.error('Error saving score:', error);
        });
    }
    
    // Handle window resize
    window.addEventListener('resize', () => {
        gameWidth = gameContainer.offsetWidth;
        gameHeight = gameContainer.offsetHeight;
        
        // Keep paddles and ball in bounds
        leftPaddleY = Math.max(0, Math.min(gameHeight - paddleHeight, leftPaddleY));
        rightPaddleY = Math.max(0, Math.min(gameHeight - paddleHeight, rightPaddleY));
        ballY = Math.max(0, Math.min(gameHeight - ballSize, ballY));
        
        // Update positions
        leftPaddle.style.top = leftPaddleY + 'px';
        rightPaddle.style.top = rightPaddleY + 'px';
        ball.style.top = ballY + 'px';
    });
});