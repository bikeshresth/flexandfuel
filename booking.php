<?php

$to = "contact@designesia.com";
$subject = "New Table Reservation";

// Collect form data
$name    = trim($_POST['name'] ?? '');
$email   = trim($_POST['email'] ?? '');
$phone   = trim($_POST['phone'] ?? '');
$guests  = trim($_POST['guests'] ?? '');
$date    = trim($_POST['date'] ?? '');
$time    = trim($_POST['time'] ?? '');
$message = trim($_POST['message'] ?? '');

// Validate required fields
if (
    empty($name) ||
    empty($email) ||
    empty($phone) ||
    empty($guests) ||
    empty($date) ||
    empty($time)
) {
    echo "failed";
    exit;
}

$email_body = '
<html>
<head>
<meta charset="UTF-8">
<title>New Table Reservation</title>
</head>
<body>

<h2>New Table Reservation</h2>

<table border="1" cellpadding="8" cellspacing="0" style="border-collapse:collapse;">

<tr>
<th align="left">Name</th>
<td>'.htmlspecialchars($name).'</td>
</tr>

<tr>
<th align="left">Email</th>
<td>'.htmlspecialchars($email).'</td>
</tr>

<tr>
<th align="left">Phone</th>
<td>'.htmlspecialchars($phone).'</td>
</tr>

<tr>
<th align="left">Number of Guests</th>
<td>'.htmlspecialchars($guests).'</td>
</tr>

<tr>
<th align="left">Reservation Date</th>
<td>'.htmlspecialchars($date).'</td>
</tr>

<tr>
<th align="left">Reservation Time</th>
<td>'.htmlspecialchars($time).'</td>
</tr>

<tr>
<th align="left">Special Requests</th>
<td>'.nl2br(htmlspecialchars($message)).'</td>
</tr>

</table>

</body>
</html>';

$headers  = "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/html; charset=UTF-8\r\n";
$headers .= "From: Website <contact@designesia.com>\r\n";
$headers .= "Reply-To: ".$name." <".$email.">\r\n";

if (mail($to, $subject, $email_body, $headers)) {
    echo "sent";
} else {
    echo "failed";
}

?>