<?php
// api/auth.php

function get_current_user_from_session() {
    return isset($_SESSION['user']) ? $_SESSION['user'] : null;
}

function authorize($allowed_roles) {
    $user = get_current_user_from_session();
    if (!$user || !in_array($user['role'], $allowed_roles)) {
        send_json(['error' => 'Unauthorized'], 403);
    }
    return $user;
}

function handle_login($conn, $input) {
    $username = $input['username'] ?? '';
    $password = $input['password'] ?? '';
    $stmt = $conn->prepare("SELECT id, name, username, password, role, subscriptionTier FROM users WHERE username = ?");
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($user = $result->fetch_assoc()) {
        if (password_verify($password, $user['password'])) {
            unset($user['password']);
            $_SESSION['user'] = $user;
            send_json($user);
        }
    }
    send_json(['error' => 'Invalid username or password'], 401);
}

function handle_logout() {
    session_destroy();
    send_json(['message' => 'Logged out successfully']);
}

function handle_session() {
    send_json(get_current_user_from_session());
}

function handle_register($conn, $input) {
    $name = $input['name'] ?? 'New User';
    $username = $input['username'] ?? '';
    $password = $input['password'] ?? '';

    if (empty($username) || empty($password)) send_json(['error' => 'Username and password required'], 400);

    $stmt = $conn->prepare("SELECT id FROM users WHERE username = ?");
    $stmt->bind_param("s", $username);
    $stmt->execute();
    if ($stmt->get_result()->num_rows > 0) send_json(['error' => 'Username already exists'], 409);
    
    $hashed_password = password_hash($password, PASSWORD_DEFAULT);
    $stmt = $conn->prepare("INSERT INTO users (name, username, password) VALUES (?, ?, ?)");
    $stmt->bind_param("sss", $username, $username, $hashed_password);
    
    if ($stmt->execute()) {
        $new_id = $stmt->insert_id;
        $user = ['id' => $new_id, 'name' => $username, 'username' => $username, 'role' => 'STUDENT', 'subscriptionTier' => 'FREE'];
        $_SESSION['user'] = $user;
        send_json($user, 201);
    } else {
        send_json(['error' => 'Registration failed'], 500);
    }
}
?>