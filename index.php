<?php
    $url = "https://us-central1-mohamed-halat.cloudfunctions.net/Covid-BigQuery";

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    $body = curl_exec($ch);
    curl_close($ch);

    // $json = json_decode($body);
    echo $body;
?>