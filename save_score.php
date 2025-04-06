<?php
// Include database connection
require_once 'config.php';

// Get JSON data from request
$data = json_decode(file_get_contents('php://input'), true);

// Validate data
if (!isset($data['player_score']) || !isset($data['computer_score']) || !isset($data['winner'])) {
    echo json_encode(['status' => 'error', 'message' => 'Missing required data']);
    exit;
}

// Log scores to a file since we don't have a database connection
$logFile = 'scores.log';
$scoreData = date('Y-m-d H:i:s') . ' - Player: ' . $data['player_score'] . 
            ', Computer: ' . $data['computer_score'] . 
            ', Winner: ' . $data['winner'] . 
            ', User: ' . $config['created_by'] . "\n";

file_put_contents($logFile, $scoreData, FILE_APPEND);

// For now, just return success
echo json_encode([
    'status' => 'success',
    'message' => 'Score saved successfully',
    'timestamp' => date('Y-m-d H:i:s'),
    'user' => $config['created_by']
]);
?>