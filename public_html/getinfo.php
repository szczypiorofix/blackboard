<?php
    if (isset($_POST['task'])) {
        
        if ($_POST['task']==='clear') {
            echo 'CLEAR BLACKBOARD!';
            $array = [];
            for ($i = 0; $i < (320 * 200); $i++) {
                $array[] = 0;
            }
            $fp = fopen('file.txt', 'w');
            fwrite($fp, print_r($array, false));
            fclose($fp);
            echo json_encode($array);
        }
        else if ($_POST['task'] === 'add') {
            $array = $_POST['array'];
            $fp = fopen('file.txt', 'w');
            fwrite($fp, print_r($array, TRUE));
            fclose($fp);
            echo 'OK! Array length:'.count($array);
        }
        else if ($_POST['task'] === 'get') {
            $array = explode( "\n", file_get_contents('file.txt'));
            echo json_encode($array);
        }
        else {
            echo 'Ooops something went wrong, mister...';
        }

    }
    else {
        echo 'ERROR!';
    }