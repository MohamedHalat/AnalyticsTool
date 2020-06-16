<?php
    ob_start();
    include 'connectionName';
    $url = file_get_contents('connectionName');

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    $body = curl_exec($ch);
    curl_close($ch);
    ob_end_clean();
    echo $body;
?>