<?php
require_once 'config.php';
require_once 'functions.php';

$high_scores = getHighScores();

if (empty($high_scores)) {
    $high_scores = [
        [
            'user' => $config['created_by'],
            'player_score' => 5,
            'computer_score' => 2,
            'date' => '2025-04-06 17:52:12'
        ]
    ];
}

include 'includes/header.php';
?>

<h1>High Scores</h1>

<div class="high-scores">
    <table>
        <thead>
            <tr>
                <th>Player</th>
                <th>Player Score</th>
                <th>Computer Score</th>
                <th>Date</th>
            </tr>
        </thead>
        <tbody>
            <?php foreach ($high_scores as $score): ?>
            <tr>
                <td><?php echo htmlspecialchars($score['user']); ?></td>
                <td><?php echo $score['player_score']; ?></td>
                <td><?php echo $score['computer_score']; ?></td>
                <td><?php echo $score['date']; ?></td>
            </tr>
            <?php endforeach; ?>
        </tbody>
    </table>
</div>

<div class="controls">
    <a href="index.php"><button>Back to Game</button></a>
</div>

<?php include 'includes/footer.php'; ?>