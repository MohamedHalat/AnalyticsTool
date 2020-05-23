<?php
$con = mysqli_connect("host:port", "user", "password") or die("<script language='javascript'>alert('Unable to connect to database')</script>");
mysqli_select_db($con, "schema");

if (isset($_GET['func']) && isset($_GET['id'])) {
    switch ($_GET['func']) {
        case "JSON":
            switch ($_GET['table']) {
                case "dates":
                    dates($con, $_GET['id']);
                    exit();
                case "all":
                    echo "{";
                    intentsJSON($con, $_GET['id']);
                    echo ",";
                    sessionsJSON($con, $_GET['id']);
                    echo ",";
                    usersJSON($con, $_GET['id']);
                    echo "}";
                    exit();
                case "intents":
                    echo "{";
                    intentsJSON($con, $_GET['id']);
                    echo "}";
                    exit();
                case "sessions":
                    echo "{";
                    sessionsJSON($con, $_GET['id']);
                    echo "}";
                    exit();
                case "users":
                    echo "{";
                    usersJSON($con, $_GET['id']);
                    echo "}";
                    exit();
                default:
                    echo "Incorrect or insufficient parameters\n";
                    exit();
            }
        default:
            echo "Incorrect or insufficient parameters\n";
            exit();
    }
} else {
    echo "Incorrect or insufficient parameters\n";
    exit(1);
}

function dates($con, $id)
{
    if ($id == "all") {
        $sql = "SELECT date(datetime),  count(*) FROM smassistantintent GROUP BY date(datetime) ORDER BY date(datetime), COUNT(*)DESC";
    } else {
        $sql = "SELECT date(datetime),  count(*) FROM smassistantintent where user_id = $id GROUP BY date(datetime) ORDER BY date(datetime), COUNT(*)DESC";
    }

    $result = mysqli_query($con, $sql);
    $total = mysqli_num_rows($result);
    echo '{"dates" : { "values":[';
    $num_rows = 0;

    while ($row = mysqli_fetch_assoc($result)) {
        $num_rows++;
        $date = $row["date(datetime)"];
        $num = $row["count(*)"];
        echo "[\"$date\", $num]";
        if ($num_rows < $total) {
            echo ",";
        }
    }
    echo "],\"length\":$total}}";
}

function intentsJSON($con, $id)
{
    //Intent Query
    if ($id == "all") {
        $sql = "SELECT id,user_id, assistant_user, session_id, display_name, session_step, datetime FROM smassistantintent;";
    } else {
        $sql = "SELECT id,user_id, assistant_user, session_id, display_name, session_step, datetime FROM smassistantintent where user_id = $id;";
    }

    $result = mysqli_query($con, $sql);
    echo '"intents" : {"values":[';
    // Building head
    $num_rows = 0;
    $total = mysqli_num_rows($result);
    // Building table body
    while ($row = mysqli_fetch_assoc($result)) {
        $num_rows++;
        $id = $row["id"];
        $user_id = $row["user_id"];
        $assistant_user = $row["assistant_user"];
        $session_id = $row["session_id"];
        $display_name = $row["display_name"];
        $session_step = $row["session_step"];
        $datetime = $row["datetime"];
        // echo "$num_rows:";
        echo "{\"id\":$id, \"user_id\":$user_id, \"assistant_user\":$assistant_user, \"session_id\":$session_id, \"display_name\":\"$display_name\",\"session_step\":$session_step,\"datetime\":\"$datetime\"}";
        if ($num_rows < $total) {
            echo ",";
        }

    }
    echo "],\"length\":$num_rows}";
}

function usersJSON($con, $id)
{
    //users Query
    // if ($id == "all") {
        $sql = "SELECT id, user_id, locale, verified, last_login, registration_date, appname, lastupdatedatetime, createddatetime FROM smassistantuser;";
    // } else {
    //     $sql = "SELECT id, user_id, locale, verified, last_login, registration_date, appname, lastupdatedatetime, createddatetime FROM smassistantuser where user_id = $id;";
    // }

    // echo $id;
    $result = mysqli_query($con, $sql);
    // Building head
    echo '"users" : {"values":[';
    $num_rows = 0;
    $total = mysqli_num_rows($result);
    // Building table body
    while ($row = mysqli_fetch_assoc($result)) {
        $num_rows++;
        $id = $row["id"];
        $user_id = $row["user_id"];
        $locale = $row["locale"];
        $verified = $row["verified"];
        $last_login = $row["last_login"];
        $lastupdatedatetime = $row["lastupdatedatetime"];
        $createddatetime = $row["createddatetime"];
        $appname = $row["appname"];
        echo "{\"id\":$id, \"user_id\":$user_id, \"locale\":\"$locale\", \"verified\":$verified, \"appname\":\"$appname\",\"createddatetime\":\"$createddatetime\",\"last_login\":\"$last_login\"}";
        if ($num_rows < $total) {
            echo ",";
        }

    }
    echo "],\"length\":$num_rows}";
}

function sessionsJSON($con, $id)
{
    //Sessions Query
    if ($id == "all") {
        $sql = "SELECT id, user_id, assistant_user, action, version, end_of_session, datetime, start_datetime, device_type, is_sandbox, error, conversation_id, steps FROM smassistantsession";
    } else {
        $sql = "SELECT id, user_id, assistant_user, action, version, end_of_session, datetime, start_datetime, device_type, is_sandbox, error, conversation_id, steps FROM smassistantsession where user_id = $id;";
    }

    // echo $id;
    $result = mysqli_query($con, $sql);
    // Building head
    echo '"sessions" : {"values":[';
    $num_rows = 0;
    $total = mysqli_num_rows($result);
    // Building table body
    while ($row = mysqli_fetch_assoc($result)) {
        $num_rows++;
        $user_id = $row["user_id"];
        $assistant_user = $row["assistant_user"];
        $session_id = $row["id"];
        $action = $row["action"];
        $session_step = $row["steps"];
        $datetime = $row["datetime"];
        $start_datetime = $row["start_datetime"];
        $end_of_session = $row["end_of_session"];
        $is_sandbox = $row["is_sandbox"];
        echo "{\"id\":$session_id, \"user_id\":$user_id, \"assistant_user\":$assistant_user, \"action\":\"$action\", \"steps\":\"$session_step\",\"datetime\":\"$datetime\",\"start_datetime\":\"$start_datetime\",\"is_sandbox\":\"$is_sandbox\",\"end_of_session\":\"$end_of_session\"}";
        if ($num_rows < $total) {
            echo ",";
        }

    }
    echo "],\"length\":$num_rows}";
}