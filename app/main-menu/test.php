<?php 
if($_POST['action'] == 'fc_test'){
    $myfile = fopen("../cookies/data.txt", "r") or die("Unable to open file!");
    echo fread($myfile,filesize("webdictionary.txt"));
    fclose($myfile);
}
?>