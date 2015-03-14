<?php
/**
 * Date: 2015/3/11
 * Time: 4:39
 */
if (!defined('DOKU_INC')) die();
if (!defined('DOKU_PLUGIN')) define('DOKU_PLUGIN', DOKU_INC . 'lib/plugins/');
require_once (DOKU_PLUGIN . 'action.php');

class  action_plugin_pagestat extends DokuWiki_Action_Plugin
{
    function register(&$controller)
    {
        $controller->register_hook('DOKUWIKI_STARTED', 'AFTER', $this, 'set_data', array());
    }

    function set_data(){
        global $JSINFO;
        $JSINFO['user'] = $_SERVER['REMOTE_USER'];
        $JSINFO['wordlist_ns']=$this->getConf('wordlist_ns');
        $JSINFO['userwords_ns']=$this->getConf('userwords_ns');
    }

}