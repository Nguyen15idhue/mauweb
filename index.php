<?php
// Include any necessary PHP files
require_once 'functions.php';

// You could add dynamic content like user info, saved scores, etc.
$current_user = isset($_SESSION['username']) ? $_SESSION['username'] : $config['created_by'];
$date = date('Y-m-d H:i:s');

// Include the header
include 'includes/header.php';
?>

<div class="game-container">
    <div class="game-border"></div>
    <div class="center-line"></div>
    <div class="paddle" id="leftPaddle"></div>
    <div class="paddle" id="rightPaddle"></div>
    <div class="ball"></div>
    <div class="score" id="playerScore">0</div>
    <div class="score" id="computerScore">0</div>
    
    <div class="game-over">
        <h2 id="winnerText">Player Wins!</h2>
        <button id="restartButton">Play Again</button>
    </div>
</div>

<div class="controls">
    <button id="startButton">Start Game</button>
    <button id="pauseButton">Pause</button>
    <a href="high_scores.php"><button type="button">High Scores</button></a>
</div>

<?php if ($config['enable_sound']): ?>
<audio id="paddleSound" src="assets/audio/paddle.wav"></audio>
<audio id="wallSound" src="assets/audio/wall.wav"></audio>
<audio id="scoreSound" src="assets/audio/score.wav"></audio>
<?php endif; ?>

<?php
// Display user information if needed
if ($current_user !== 'Guest'): 
?>
<div class="user-info">
    <p>Welcome, <?php echo htmlspecialchars($current_user); ?></p>
    <p>Current time: <?php echo $date; ?></p>
</div>
<?php 
endif;

// Include the footer
include 'includes/footer.php';
?>