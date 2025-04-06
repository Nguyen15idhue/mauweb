<?php
require_once 'config.php';
require_once 'functions.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (isset($input['player_score']) && isset($input['computer_score']) && isset($input['winner'])) {
        saveScore($input['player_score'], $input['computer_score'], $input['winner']);
        
        echo json_encode(['status' => 'success']);
        exit;
    }
}

echo json_encode(['status' => 'error']);
?>