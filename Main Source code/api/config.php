<?php
// api/config.php

// --- Database Configuration ---
define('DB_HOST', 'sqlXXX.infinityfree.com'); // Your DB Host
define('DB_USER', 'if0_XXXXXXXX');          // Your DB Username
define('DB_PASS', 'XXXXXXXXXX');            // Your DB Password
define('DB_NAME', 'if0_XXXXXXXX_placement_hub'); // Your DB Name

// --- Error Reporting ---
ini_set('display_errors', 0); // Set to 0 for production, 1 for debugging
error_reporting(E_ALL);

// --- Global Helpers ---
function send_json($data, $statusCode = 200) {
    http_response_code($statusCode);
    header('Content-Type: application/json');
    echo json_encode($data, JSON_NUMERIC_CHECK);
    exit();
}
?>