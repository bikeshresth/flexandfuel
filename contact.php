<?php

$to = 'bikesh07stha@gmail.com';
$subject = 'New Contact Message - Flex & Fuel';

// Accept POST requests only
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit('failed');
}

// Collect form data
$name  = trim($_POST['name'] ?? '');
$email = trim($_POST['email'] ?? '');
$phone = trim($_POST['phone'] ?? '');
$msg   = trim($_POST['message'] ?? '');

// Validate required fields
if ($name === '' || $email === '' || $phone === '' || $msg === '') {
    http_response_code(400);
    exit('failed');
}

// Validate email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    exit('failed');
}

// Limit input lengths
if (
    strlen($name) > 200 ||
    strlen($email) > 254 ||
    strlen($phone) > 50 ||
    strlen($msg) > 10000
) {
    http_response_code(400);
    exit('failed');
}

// Escape form data for HTML email
$safeName  = htmlspecialchars($name, ENT_QUOTES, 'UTF-8');
$safeEmail = htmlspecialchars($email, ENT_QUOTES, 'UTF-8');
$safePhone = htmlspecialchars($phone, ENT_QUOTES, 'UTF-8');
$safeMsg   = nl2br(htmlspecialchars($msg, ENT_QUOTES, 'UTF-8'));

// Build email
$message = "
<html>
<body>
    <h2>New Contact Message - Flex & Fuel</h2>
    <p><strong>Name:</strong> {$safeName}</p>
    <p><strong>Email:</strong> {$safeEmail}</p>
    <p><strong>Phone:</strong> {$safePhone}</p>
    <p><strong>Message:</strong><br>{$safeMsg}</p>
</body>
</html>
";

// Email headers
$headers  = "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/html; charset=UTF-8\r\n";
$headers .= "From: Flex & Fuel <info@flexandfuel.com.au>\r\n";
$headers .= "Reply-To: {$email}\r\n";

// Send email
if (mail($to, $subject, $message, $headers)) {
    echo 'sent';
} else {
    http_response_code(500);
    echo 'failed';
}
?>