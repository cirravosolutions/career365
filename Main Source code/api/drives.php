<?php
// api/drives.php

function handle_drives($conn, $method) {
    if ($method !== 'GET') send_json(['error' => 'Invalid request method'], 405);
    
    $visibility = $_GET['visibility'] ?? 'all';
    $sql = "SELECT d.id, d.companyName, d.role, d.description, d.eligibility, d.location, d.salary, d.applyDeadline, d.applyLink, d.packageLevel, d.isFree, d.postedAt, u.name as postedBy, d.postedById FROM drives d JOIN users u ON d.postedById = u.id";
    if ($visibility === 'free') $sql .= " WHERE d.isFree = 1";
    $sql .= " ORDER BY d.postedAt DESC";
    
    $result = $conn->query($sql);
    $drives = [];
    while($row = $result->fetch_assoc()) {
        $row['eligibility'] = json_decode($row['eligibility']);
        $row['isFree'] = (bool)$row['isFree'];
        $drives[] = $row;
    }
    send_json($drives);
}

function handle_update_drive($conn, $data) {
    $user = authorize(['ADMIN', 'SUPER_ADMIN']);
    $eligibilityJson = json_encode($data['eligibility']);
    $isFreeBool = (int)$data['isFree'];
    
    $stmt = $conn->prepare("UPDATE drives SET companyName=?, role=?, description=?, eligibility=?, location=?, salary=?, applyDeadline=?, applyLink=?, packageLevel=?, isFree=? WHERE id=?");
    $stmt->bind_param("sssssssssii", $data['companyName'], $data['role'], $data['description'], $eligibilityJson, $data['location'], $data['salary'], $data['applyDeadline'], $data['applyLink'], $data['packageLevel'], $isFreeBool, $data['id']);
    
    if ($stmt->execute()) send_json(['message' => 'Drive updated']);
    else send_json(['error' => 'Failed to update drive'], 500);
}

function handle_delete_drive($conn, $input) {
    $user = authorize(['ADMIN', 'SUPER_ADMIN']);
    $driveId = $input['driveId'];
    
    $stmt = $conn->prepare("DELETE FROM drives WHERE id = ?");
    $stmt->bind_param("i", $driveId);
    
    if ($stmt->execute()) send_json(['message' => 'Drive deleted']);
    else send_json(['error' => 'Failed to delete drive'], 500);
}
?>