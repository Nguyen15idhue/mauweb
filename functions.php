<?php
function isLocalhost() {
    return in_array($_SERVER['REMOTE_ADDR'], ['127.0.0.1', '::1']);
}

function saveScore($playerScore, $computerScore, $winner) {
    $date = date('Y-m-d H:i:s');
    $user = 'Nguyen15idhue';
    $logEntry = sprintf(
        "%s - Player: %d, Computer: %d, Winner: %s, User: %s\n",
        $date,
        $playerScore,
        $computerScore,
        $winner,
        $user
    );
    
    file_put_contents('scores.log', $logEntry, FILE_APPEND);
}

function getHighScores($limit = 10) {
    if (!file_exists('scores.log')) {
        return [];
    }
    
    $scores = array_filter(file('scores.log'));
    $scores = array_map(function($line) {
        if (preg_match('/(.+) - Player: (\d+), Computer: (\d+), Winner: (.+), User: (.+)/', $line, $matches)) {
            return [
                'date' => $matches[1],
                'player_score' => (int)$matches[2],
                'computer_score' => (int)$matches[3],
                'winner' => $matches[4],
                'user' => trim($matches[5])
            ];
        }
        return null;
    }, $scores);
    
    $scores = array_filter($scores);
    rsort($scores);
    return array_slice($scores, 0, $limit);
}
?>