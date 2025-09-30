<?php
// Set headers for CORS and content type
header("Access-Control-Allow-Origin: *"); 
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Access-Control-Allow-Credentials: true");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

// --- DATABASE CONFIGURATION ---
$db_host = 'sql200.infinityfree.com';
$db_user = 'if0_39774568';
$db_pass = 'rlXbBqNbby7f';
$db_name = 'if0_39774568_placementdrivedetails';
$db_port = '3306';

// Create connection
$conn = new mysqli($db_host, $db_user, $db_pass, $db_name, $db_port);

// Check connection
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(['error' => 'Database Connection Failed: ' . $conn->connect_error]);
    exit();
}

// *** THE DEFINITIVE FIX: Set the connection's timezone to Indian Standard Time (IST). ***
// This ensures all timestamps (`current_timestamp()`) are stored and retrieved in IST.
$conn->query("SET time_zone = '+05:30'");

// Start session
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}