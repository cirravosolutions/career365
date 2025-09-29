<?php
class Database {
    // !!! IMPORTANT: UPDATE THESE WITH YOUR DATABASE DETAILS !!!
    private $host = 'sql200.infinityfree.com';
    private $db_name = 'if0_39774568_placementdrivedetails';
    private $username = 'if0_39774568';
    private $password = 'rlXbBqNbby7f';
    private $conn;

    public function connect() {
        $this->conn = null;
        try {
            $this->conn = new PDO('mysql:host=' . $this->host . ';dbname=' . $this->db_name . ';charset=utf8mb4', $this->username, $this->password);
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $this->conn->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
        } catch(PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Database Connection Error. Please check your credentials in Database.php']);
            exit();
        }
        return $this->conn;
    }
}
?>