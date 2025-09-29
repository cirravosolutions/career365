<?php
// Set headers for CORS and content type
header("Access-Control-Allow-Origin: *"); // For production, you might want to restrict this to your domain
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Access-Control-Allow-Credentials: true");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// --- SESSION & ERROR HANDLING ---
// Use secure session settings
ini_set('session.cookie_httponly', 1);
ini_set('session.use_only_cookies', 1);
// Uncomment the next line if you are using HTTPS
// ini_set('session.cookie_secure', 1); 
session_start();

// Include the database connection class
include_once './Database.php';

// --- INITIALIZATION ---
$database = new Database();
$db = $database->connect();

$action = $_GET['action'] ?? '';
// Handle JSON body for POST requests, and also check $_POST for form data
$data = json_decode(file_get_contents("php://input"));

// --- HELPER FUNCTIONS ---
function send_json($data, $statusCode = 200) {
    http_response_code($statusCode);
    echo json_encode($data);
    exit;
}

function generate_uuid($prefix = '') {
    // Generates a more unique ID than uniqid() alone
    return $prefix . uniqid() . bin2hex(random_bytes(4));
}

function ensure_auth($roles = []) {
    if (!isset($_SESSION['user'])) {
        send_json(['error' => 'Authentication required. Please log in.'], 401);
    }
    if (!empty($roles) && !in_array($_SESSION['user']['role'], $roles)) {
        send_json(['error' => 'Forbidden. You do not have permission to perform this action.'], 403);
    }
}


// --- API ROUTER ---
try {
    switch ($action) {
        // --- AUTHENTICATION ---
        case 'login':
            $stmt = $db->prepare("SELECT * FROM users WHERE username = ?");
            $stmt->execute([$data->username]);
            $user = $stmt->fetch();
            if ($user && password_verify($data->password, $user['password'])) {
                unset($user['password']); // Never send the hash back
                $_SESSION['user'] = $user;
                send_json($user);
            } else {
                send_json(['error' => 'Invalid username or password'], 401);
            }
            break;
        case 'logout':
            session_destroy();
            send_json(['success' => true]);
            break;
        case 'checkSession':
            send_json($_SESSION['user'] ?? null);
            break;
        case 'register':
            $stmt = $db->prepare("SELECT id FROM users WHERE username = ?");
            $stmt->execute([$data->username]);
            if ($stmt->fetch()) { send_json(['error' => 'Username already exists'], 409); }
            
            $userId = generate_uuid('user_');
            $hashedPassword = password_hash($data->password, PASSWORD_BCRYPT);
            $query = "INSERT INTO users (id, username, name, password, role) VALUES (?, ?, ?, ?, 'STUDENT')";
            $stmt = $db->prepare($query);
            $stmt->execute([$userId, $data->username, $data->username, $hashedPassword]);
            
            $newUser = ['id' => $userId, 'username' => $data->username, 'name' => $data->username, 'role' => 'STUDENT', 'subscriptionTier' => 'FREE'];
            $_SESSION['user'] = $newUser;
            send_json($newUser);
            break;

        // --- DRIVES ---
        case 'fetchDrives':
            $query = "SELECT * FROM drives";
            if(isset($_GET['visibility']) && $_GET['visibility'] === 'free') { $query .= " WHERE isFree = 1"; }
            $query .= " ORDER BY postedAt DESC";
            $stmt = $db->query($query);
            $drives = $stmt->fetchAll(PDO::FETCH_ASSOC);
            foreach ($drives as &$drive) {
                $drive['eligibility'] = json_decode($drive['eligibility']);
                $drive['isFree'] = (bool)$drive['isFree'];
            }
            send_json($drives);
            break;
        case 'createDrive':
            ensure_auth(['ADMIN', 'SUPER_ADMIN']);
            $drive = $data->driveData;
            $driveId = generate_uuid('drive_');
            $query = "INSERT INTO drives (id, companyName, role, description, eligibility, location, salary, applyDeadline, postedBy, postedById, applyLink, packageLevel, isFree) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            $stmt = $db->prepare($query);
            $stmt->execute([$driveId, $drive->companyName, $drive->role, $drive->description, json_encode($drive->eligibility), $drive->location, $drive->salary, $drive->applyDeadline, $_SESSION['user']['name'], $_SESSION['user']['id'], $drive->applyLink, $drive->packageLevel, $drive->isFree]);
            send_json(['success' => true, 'id' => $driveId]);
            break;
        case 'updateDrive':
            ensure_auth(['ADMIN', 'SUPER_ADMIN']);
            $drive = $data->driveData;
            $query = "UPDATE drives SET companyName=?, role=?, description=?, eligibility=?, location=?, salary=?, applyDeadline=?, applyLink=?, packageLevel=?, isFree=? WHERE id=?";
            $stmt = $db->prepare($query);
            $stmt->execute([$drive->companyName, $drive->role, $drive->description, json_encode($drive->eligibility), $drive->location, $drive->salary, $drive->applyDeadline, $drive->applyLink, $drive->packageLevel, $drive->isFree, $drive->id]);
            send_json($drive);
            break;
        case 'deleteDrive':
            ensure_auth(['ADMIN', 'SUPER_ADMIN']);
            $stmt = $db->prepare("DELETE FROM drives WHERE id = ?");
            $stmt->execute([$data->driveId]);
            send_json(['success' => true]);
            break;
            
        // --- ANNOUNCEMENTS ---
        case 'fetchAnnouncements':
            $query = "SELECT * FROM announcements";
            $params = [];
            if (isset($_GET['visibility'])) {
                 if ($_GET['visibility'] === 'public') { $query .= " WHERE isPublic = 1"; } 
                 elseif ($_GET['visibility'] === 'student') { ensure_auth(); $query .= " WHERE isPublic = 0"; }
            }
            $query .= " ORDER BY postedAt DESC";
            $stmt = $db->prepare($query);
            $stmt->execute($params);
            $announcements = $stmt->fetchAll(PDO::FETCH_ASSOC);
            foreach ($announcements as &$announcement) { $announcement['isPublic'] = (bool)$announcement['isPublic']; }
            send_json($announcements);
            break;
        case 'createAnnouncement':
             ensure_auth(['ADMIN', 'SUPER_ADMIN']);
             $anno = $data->announcementData;
             $annoId = generate_uuid('anno_');
             $query = "INSERT INTO announcements (id, title, content, postedBy, postedById, isPublic) VALUES (?, ?, ?, ?, ?, ?)";
             $stmt = $db->prepare($query);
             $stmt->execute([$annoId, $anno->title, $anno->content, $_SESSION['user']['name'], $_SESSION['user']['id'], $anno->isPublic]);
             send_json(['success' => true, 'id' => $annoId]);
             break;
        case 'updateAnnouncement':
            ensure_auth(['ADMIN', 'SUPER_ADMIN']);
            $anno = $data->announcementData;
            $query = "UPDATE announcements SET title=?, content=?, isPublic=? WHERE id=?";
            $stmt = $db->prepare($query);
            $stmt->execute([$anno->title, $anno->content, $anno->isPublic, $anno->id]);
            send_json($anno);
            break;
        case 'deleteAnnouncement':
            ensure_auth(['ADMIN', 'SUPER_ADMIN']);
            $stmt = $db->prepare("DELETE FROM announcements WHERE id = ?");
            $stmt->execute([$data->announcementId]);
            send_json(['success' => true]);
            break;

        // --- INTERESTS ---
        case 'getUserInterests':
            ensure_auth(['STUDENT']);
            $stmt = $db->prepare("SELECT * FROM drive_interests WHERE userId = ?");
            $stmt->execute([$_SESSION['user']['id']]);
            send_json($stmt->fetchAll(PDO::FETCH_ASSOC));
            break;
        case 'registerInterest':
            ensure_auth(['STUDENT']);
            $passId = generate_uuid('pass_');
            $query = "INSERT INTO drive_interests (passId, userId, driveId, userName, studentId) VALUES (?, ?, ?, ?, ?)";
            $stmt = $db->prepare($query);
            $stmt->execute([$passId, $_SESSION['user']['id'], $data->driveId, $_SESSION['user']['name'], $_SESSION['user']['username']]);
            send_json(['passId' => $passId, 'userId' => $_SESSION['user']['id'], 'driveId' => $data->driveId, 'userName' => $_SESSION['user']['name'], 'studentId' => $_SESSION['user']['username']]);
            break;
        case 'getInterestDetailsForDrive':
            ensure_auth(['ADMIN', 'SUPER_ADMIN']);
            $stmt = $db->prepare("SELECT * FROM drive_interests WHERE driveId = ?");
            $stmt->execute([$_GET['driveId']]);
            send_json($stmt->fetchAll(PDO::FETCH_ASSOC));
            break;
        case 'getDriveInterestCounts':
            ensure_auth(['ADMIN', 'SUPER_ADMIN']);
            $stmt = $db->query("SELECT driveId, COUNT(*) as count FROM drive_interests GROUP BY driveId");
            $counts = [];
            foreach ($stmt->fetchAll(PDO::FETCH_ASSOC) as $row) { $counts[$row['driveId']] = (int)$row['count']; }
            send_json($counts);
            break;
            
        // --- ALUMNI (WITH FILE UPLOADS) ---
        case 'fetchAlumni':
            $stmt = $db->query("SELECT * FROM alumni ORDER BY postedAt DESC");
            $alumniList = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            // *** THE FIX IS HERE ***
            // Prepend the base path to the photoUrl so the frontend can resolve it
            $basePath = 'api/';
            foreach ($alumniList as &$alumnus) {
                if ($alumnus['photoUrl'] && strpos($alumnus['photoUrl'], 'http') !== 0) {
                    $alumnus['photoUrl'] = $basePath . $alumnus['photoUrl'];
                }
            }
            send_json($alumniList);
            break;
            
        case 'createAlumni':
        case 'updateAlumni':
            ensure_auth(['ADMIN', 'SUPER_ADMIN']);
            $isUpdate = ($action === 'updateAlumni');
            $uploadDir = 'uploads/';
            
            $alumniId = $isUpdate ? $_POST['id'] : generate_uuid('alum_');
            if ($isUpdate && !$alumniId) { send_json(['error' => 'Missing ID for update'], 400); }

            $photoUrl = null;
            if (isset($_FILES['photo'])) {
                $file = $_FILES['photo'];
                if ($file['error'] !== UPLOAD_ERR_OK) { send_json(['error' => 'File upload error.'], 500); }
                $fileName = generate_uuid('img_') . basename($file['name']);
                $targetPath = $uploadDir . $fileName;
                if (!move_uploaded_file($file['tmp_name'], $targetPath)) { send_json(['error' => 'Failed to save uploaded file.'], 500); }
                $photoUrl = $targetPath; // The path saved to DB is still relative: 'uploads/image.jpg'
            }

            if ($isUpdate) {
                if ($photoUrl) { // New photo uploaded, replace old one
                    $stmt = $db->prepare("SELECT photoUrl FROM alumni WHERE id = ?");
                    $stmt->execute([$alumniId]);
                    if ($old = $stmt->fetch()) { if ($old['photoUrl'] && file_exists($old['photoUrl'])) unlink($old['photoUrl']); }
                    $query = "UPDATE alumni SET name=?, companyName=?, placementDate=?, package=?, photoUrl=? WHERE id=?";
                    $stmt = $db->prepare($query);
                    $stmt->execute([$_POST['name'], $_POST['companyName'], $_POST['placementDate'], $_POST['package'], $photoUrl, $alumniId]);
                } else { // No new photo, just update text fields
                    $query = "UPDATE alumni SET name=?, companyName=?, placementDate=?, package=? WHERE id=?";
                    $stmt = $db->prepare($query);
                    $stmt->execute([$_POST['name'], $_POST['companyName'], $_POST['placementDate'], $_POST['package'], $alumniId]);
                }
            } else { // Create new record
                if (!$photoUrl) { send_json(['error' => 'Photo is required for new alumni.'], 400); }
                $query = "INSERT INTO alumni (id, name, companyName, placementDate, package, photoUrl, postedBy, postedById) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
                $stmt = $db->prepare($query);
                $stmt->execute([$alumniId, $_POST['name'], $_POST['companyName'], $_POST['placementDate'], $_POST['package'], $photoUrl, $_SESSION['user']['name'], $_SESSION['user']['id']]);
            }
            
            // Construct the full response object to send back
            $stmt = $db->prepare("SELECT * FROM alumni WHERE id = ?");
            $stmt->execute([$alumniId]);
            $newOrUpdatedAlumni = $stmt->fetch();
            if ($newOrUpdatedAlumni['photoUrl'] && strpos($newOrUpdatedAlumni['photoUrl'], 'http') !== 0) {
                 $newOrUpdatedAlumni['photoUrl'] = 'api/' . $newOrUpdatedAlumni['photoUrl'];
            }
            send_json($newOrUpdatedAlumni);

            break;
        case 'deleteAlumni':
            ensure_auth(['ADMIN', 'SUPER_ADMIN']);
            $stmt = $db->prepare("SELECT photoUrl FROM alumni WHERE id = ?");
            $stmt->execute([$data->alumniId]);
            if ($alumni = $stmt->fetch()) { if ($alumni['photoUrl'] && file_exists($alumni['photoUrl'])) unlink($alumni['photoUrl']); }
            $stmt = $db->prepare("DELETE FROM alumni WHERE id = ?");
            $stmt->execute([$data->alumniId]);
            send_json(['success' => true]);
            break;
        
        // --- USER MANAGEMENT (ADMINS) ---
        case 'fetchUsers':
            ensure_auth(['ADMIN', 'SUPER_ADMIN']);
            $stmt = $db->query("SELECT id, username, name, role, subscriptionTier FROM users");
            send_json($stmt->fetchAll(PDO::FETCH_ASSOC));
            break;
        case 'createUserByAdmin':
            ensure_auth(['ADMIN', 'SUPER_ADMIN']);
            $userId = generate_uuid('user_');
            $hashedPassword = password_hash($data->password, PASSWORD_BCRYPT);
            $query = "INSERT INTO users (id, username, name, password, role, subscriptionTier) VALUES (?, ?, ?, ?, 'STUDENT', ?)";
            $stmt = $db->prepare($query);
            $stmt->execute([$userId, $data->username, $data->name, $hashedPassword, $data->subscriptionTier]);
            send_json(['success' => true, 'id' => $userId]);
            break;
        case 'createAdmin':
            ensure_auth(['SUPER_ADMIN']);
            $adminId = generate_uuid('admin_');
            $hashedPassword = password_hash($data->password, PASSWORD_BCRYPT);
            $query = "INSERT INTO users (id, username, name, password, role) VALUES (?, ?, ?, ?, 'ADMIN')";
            $stmt = $db->prepare($query);
            $stmt->execute([$adminId, $data->username, $data->name, $hashedPassword]);
            send_json(['success' => true, 'id' => $adminId]);
            break;
        case 'deleteUser':
            ensure_auth(['ADMIN', 'SUPER_ADMIN']);
            // Safety check: Super admins cannot be deleted via this endpoint
            $stmt = $db->prepare("DELETE FROM users WHERE id = ? AND role != 'SUPER_ADMIN'");
            $stmt->execute([$data->userIdToDelete]);
            send_json(['success' => true]);
            break;

        // --- DEFAULT ---
        default:
            send_json(['error' => "Action '{$action}' not found."], 404);
            break;
    }
} catch (PDOException $e) {
    send_json(['error' => 'A database error occurred.', 'details' => $e->getMessage()], 500);
} catch (Exception $e) {
    send_json(['error' => 'An unexpected server error occurred.', 'details' => $e->getMessage()], 500);
}
?>