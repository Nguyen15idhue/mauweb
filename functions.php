<?php
// Any PHP functions related to the game
function isLocalhost() {
    return in_array($_SERVER['REMOTE_ADDR'], ['127.0.0.1', '::1']);
}

// Additional functions could include:
// - saveScore($player, $score)
// - getHighScores()
// - checkUserAuthentication()
// etc.
?>