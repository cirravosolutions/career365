<?php
// api/index.php

require_once 'config.php';

// --- Basic Setup & CORS ---
header("Access-Control-Allow-Origin: *"); // For production, lock this to your domain
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Access-Control-Allow-Credentials: true");

// --- Session Management ---
session_start([
    'cookie_lifetime' => 86400, // 1 day
    'cookie_secure' => false,   // Set to true if using HTTPS
    'cookie_httponly' => true,
    'cookie_samesite' => 'Lax'
]);

// --- Database Connection ---
$conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
if ($conn->connect_error) {
    send_json(['error' => "Database connection failed."], 500);
}

// --- Include Route Handlers ---
require_once 'auth.php';
require_once 'drives.php';
require_once 'users.php';
require_once 'interests.php';

// --- Routing ---
$method = $_SERVER['REQUEST_METHOD'];
$path = isset($_GET['path']) ? explode('/', rtrim($_GET['path'], '/')) : [];
$action = $path[0] ?? null;
$id = $path[1] ?? null;
$input = json_decode(file_get_contents('php://input'), true);

switch ($action) {
    // Auth Routes
    case 'login': handle_login($conn, $input); break;
    case 'logout': handle_logout(); break;
    case 'session': handle_session(); break;
    case 'register': handle_register($conn, $input); break;
    
    // Drive Routes
    case 'drives': handle_drives($conn, $method, $input); break;
    case 'update-drive': handle_update_drive($conn, $input); break;
    case 'delete-drive': handle_delete_drive($conn, $input); break;

    // User Management Routes
    case 'users': handle_fetch_users($conn); break;
    case 'create-user-by-admin': handle_create_user_by_admin($conn, $input); break;
    case 'create-admin': handle_create_admin($conn, $input); break;
    case 'delete-user': handle_delete_user($conn, $input); break;

    // Interest Routes
    case 'register-interest': handle_register_interest($conn, $input); break;
    case 'user-interests': handle_user_interests($conn); break;
    case 'drive-attendees': handle_drive_attendees($conn, $id); break;

    default:
        send_json(['error' => 'Not Found: Invalid API endpoint.'], 404);
        break;
}

$conn->close();
?>