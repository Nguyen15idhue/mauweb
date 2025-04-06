<?php
require_once 'config.php';
require_once 'functions.php';

if (!isset($config)) {
    $config = [
        'game_title' => 'Neon Ping Pong',
        'winning_score' => 5,
        'enable_sound' => true,
        'last_updated' => '2025-04-06 17:52:12',
        'created_by' => 'Nguyen15idhue'
    ];
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title><?php echo htmlspecialchars($config['game_title']); ?></title>
    <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="assets/css/style.css">
</head>
<body>
    <h1><?php echo htmlspecialchars($config['game_title']); ?></h1>

    <div class="game-container">
        <div class="game-border"></div>
        <div class="center-line"></div>
        <div id="leftPaddle" class="paddle"></div>
        <div id="rightPaddle" class="paddle"></div>
        <div class="ball"></div>
        <div class="score" id="playerScore">0</div>
        <div class="score" id="computerScore">0</div>
        
        <div class="game-over">
            <h2 id="winnerText">Game Over!</h2>
            <div class="controls">
                <button id="restartButton">Play Again</button>
            </div>
        </div>
    </div>

    <div class="controls">
        <button id="startButton">Start Game</button>
        <button id="pauseButton">Pause</button>
        <a href="high_scores.php"><button>High Scores</button></a>
    </div>

    <!-- Sound effects -->
    <audio id="paddleSound" src="assets/sounds/paddle.wav" preload="auto"></audio>
    <audio id="wallSound" src="assets/sounds/wall.wav" preload="auto"></audio>
    <audio id="scoreSound" src="assets/sounds/score.wav" preload="auto"></audio>

    <div class="user-info">
        Playing as: <?php echo htmlspecialchars($config['created_by']); ?>
    </div>

    <?php include 'includes/footer.php'; ?>
    <script src="assets/js/game.js"></script>
</body>
</html>