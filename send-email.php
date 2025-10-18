<?php
// Set headers to allow CORS (if needed)
header('Content-Type: application/json');

// Configuration
$to_email = "mrted.dev@gmail.com";
$from_email = "noreply@fishandloops.com"; // This should be a valid email from your domain

// Check if form was submitted via POST
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    
    // Sanitize and validate input
    $name = strip_tags(trim($_POST["name"]));
    $email = filter_var(trim($_POST["email"]), FILTER_SANITIZE_EMAIL);
    $message = strip_tags(trim($_POST["message"]));
    
    // Initialize response array
    $response = array();
    
    // Validate inputs
    if (empty($name) || empty($message) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $response['success'] = false;
        $response['message'] = 'Please fill in all fields correctly.';
        echo json_encode($response);
        exit;
    }
    
    // Email subject
    $subject = "New Contact Form Submission from $name";
    
    // Email body
    $email_body = "You have received a new message from the Fish & Loops contact form.\n\n";
    $email_body .= "Name: $name\n";
    $email_body .= "Email: $email\n\n";
    $email_body .= "Message:\n$message\n";
    
    // Email headers
    $headers = "From: $from_email\r\n";
    $headers .= "Reply-To: $email\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion();
    
    // Send email
    if (mail($to_email, $subject, $email_body, $headers)) {
        $response['success'] = true;
        $response['message'] = 'Thank you! Your message has been sent successfully.';
    } else {
        $response['success'] = false;
        $response['message'] = 'Oops! Something went wrong. Please try again later.';
    }
    
    echo json_encode($response);
    
} else {
    // Not a POST request
    $response['success'] = false;
    $response['message'] = 'Invalid request method.';
    echo json_encode($response);
}
?>
