<?php
require_once 'config.php';
require_once 'functions.php';

// For demo, create sample high scores with the username
$high_scores = [
    ['player' => $config['created_by'], 'player_score' => 5, 'computer_score' => 2, 'date_played' => '2025-04-06 17:33:57'],
    ['player' => 'Player2', 'player_score' => 5, 'computer_score' => 3, 'date_played' => '2025-04-06 16:45:22'],
    ['player' => 'Player3', 'player_score' => 5, 'computer_score' => 4, 'date_played' => '2025-04-05 19:33:10'],
];

// Check if we have a scores log file
if (file_exists('scores.log')) {
    // Read the last few lines of the log file
    $lines = file('scores.log');
    if ($lines) {
        $lines = array_slice($lines, -5); // Get last 5 entries
        foreach ($lines as $line) {
            if (preg_match('/(.+) - Player: (\d+), Computer: (\d+), Winner: (.+), User: (.+)/', $line, $matches)) {
                array_unshift($high_scores, [
                    'player' => $matches[5],
                    'player_score' => $matches[2],
                    'computer_score' => $matches[3],
                    'date_played' => $matches[1]
                ]);
            }
        }
    }
}

// Include header
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
                <td><?php echo htmlspecialchars($score['player']); ?></td>
                <td><?php echo $score['player_score']; ?></td>
                <td><?php echo $score['computer_score']; ?></td>
                <td><?php echo $score['date_played']; ?></td>
            </tr>
            <?php endforeach; ?>
        </tbody>
    </table>
</div>

<div class="controls">
    <a href="index.php"><button>Back to Game</button></a>
</div>

<?php
include 'includes/footer.php';
?>