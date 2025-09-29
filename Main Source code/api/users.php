<?php
// api/users.php

function handle_fetch_users($conn) {
    authorize(['ADMIN', 'SUPER_ADMIN']);
    $result = $conn->query("SELECT id, name, username, role, subscriptionTier FROM users ORDER BY name");
    $users = $result->fetch_all(MYSQLI_ASSOC);
    send_json($users);
}

function handle_create_user_by_admin($conn, $data) {
    authorize(['ADMIN', 'SUPER_ADMIN']);
    $hashed_password = password_hash($data['password'], PASSWORD_DEFAULT);
    $stmt = $conn->prepare("INSERT INTO users (name, username, password, role, subscriptionTier) VALUES (?, ?, ?, 'STUDENT', ?)");
    $stmt->bind_param("ssss", $data['name'], $data['username'], $hashed_password, $data['subscriptionTier']);
    
    if ($stmt->execute()) send_json(['id' => $stmt->insert_id], 201);
    else send_json(['error' => 'Username may already exist.'], 409);
}

function handle_create_admin($conn, $data) {
    authorize(['SUPER_ADMIN']);
    $hashed_password = password_hash($data['password'], PASSWORD_DEFAULT);
    $stmt = $conn->prepare("INSERT INTO users (name, username, password, role, subscriptionTier) VALUES (?, ?, ?, 'ADMIN', 'PREMIUM')");
    $stmt->bind_param("sss", $data['name'], $data['username'], $hashed_password);
    
    if ($stmt->execute()) send_json(['id' => $stmt->insert_id], 201);
    else send_json(['error' => 'Username may already exist.'], 409);
}

function handle_delete_user($conn, $input) {
    authorize(['ADMIN', 'SUPER_ADMIN']);
    $userIdToDelete = $input['userIdToDelete'];
    $stmt = $conn->prepare("DELETE FROM users WHERE id = ?");
    $stmt->bind_param("i", $userIdToDelete);
    
    if ($stmt->execute()) send_json(['message' => 'User deleted']);
    else send_json(['error' => 'Failed to delete user.'], 500);
}
?>