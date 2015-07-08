<?php
/**
 * Created by PhpStorm.
 * User: z97
 * Date: 15-7-2
 * Time: 上午11:04
 */
require_once ('remote.php');
require_once(DOKU_INC."inc/remoteAPI_l.php");
class helper_plugin_pagestat extends DokuWiki_Plugin{

    protected $remoteapi;
    function __construct(){

        $this->remoteapi=new remoteAPI_l();
    }


}