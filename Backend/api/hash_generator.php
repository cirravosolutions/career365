<?php

// --- PASSWORD HASH GENERATOR ---
// A simple one-time-use script to create secure password hashes.

// --- INSTRUCTIONS ---
// 1. Set the $plain_password variable below to the password you want to hash.
// 2. Upload this file to your server (e.g., inside the /api/ folder).
// 3. Visit this file in your browser (e.g., yourdomain.com/api/hash_generator.php).
// 4. Copy the generated hash.
// 5. Paste the hash into the 'password' column for the desired user in your database.
// 6. !!! VERY IMPORTANT: DELETE THIS FILE FROM YOUR SERVER IMMEDIATELY AFTER USE !!!

// --- STEP 1: Set your desired password here ---
$plain_password = 'yadavGIRI@4153';


// --- DO NOT EDIT BELOW THIS LINE ---

// Check if a password was provided
if ($plain_password === 'your_strong_password_here' || empty($plain_password)) {
    die("<h1>Error: Please edit this file and set a password in the \$plain_password variable.</h1>");
}

// Generate the hash using PHP's secure, built-in function.
// PASSWORD_DEFAULT uses the current best algorithm (currently BCRYPT).
$hashed_password = password_hash($plain_password, PASSWORD_DEFAULT);

// Output the hash in a clean format for easy copying.
header('Content-Type: text/plain');
echo "Password Hashing Utility\n";
echo "========================\n\n";
echo "Plain Password: " . htmlspecialchars($plain_password) . "\n";
echo "Generated Hash (copy this entire line):\n\n";
echo $hashed_password;
echo "\n\n========================\n";
echo "SECURITY WARNING: Remember to delete this file from your server now.";

?>