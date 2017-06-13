<?php
    if (isset($_POST['task'])) {
        
        if ($_POST['task']==='clear') {
            $array = '';
            $fp = fopen('file.txt', 'w');
            fwrite($fp, $array);
            fclose($fp);
            echo 'CLEAR BLACKBOARD!';
        }
        else if ($_POST['task'] === 'add') {
            $array = $_POST['array'];
            $array .= ',';
            $fp = fopen('file.txt', 'a');
            //$json_array = json_encode($array);
            fwrite($fp, $array);
            fclose($fp);
            //echo 'OK! Array length:'.count($array);
            print $array;
        }
        else if ($_POST['task'] === 'get') {
            $array = file_get_contents('file.txt');
            echo $array;
        }
        else {
            echo 'Ooops something went wrong, mister...';
        }
    }
    else {
        echo 'ERROR!';
    }
?>