<?php
/**
 * Date: 2015/3/11
 * Time: 4:39
 */
if (!defined('DOKU_INC')) die();
if (!defined('DOKU_PLUGIN')) define('DOKU_PLUGIN', DOKU_INC . 'lib/plugins/');

require_once (DOKU_PLUGIN . 'action.php');
require_once (DOKU_INC.'inc/template.php');

class  action_plugin_pagestat extends DokuWiki_Action_Plugin
{
    function register(&$controller)
    {
        $controller->register_hook('DOKUWIKI_STARTED', 'AFTER', $this, 'set_data', array());
        $controller->register_hook('RPC_CALL_ADD', 'AFTER',  $this, 'add_rpc_all');
        $controller->register_hook('TEMPLATE_PAGETOOLS_DISPLAY', 'BEFORE', $this, 'addbutton', array());
    }

    function set_data(){
        global $JSINFO;
//        global $conf;
//        $myste = $conf["metadir"];
        $JSINFO['user'] = $_SERVER['REMOTE_USER'];
        $JSINFO['g_wordlists']=$this->getConf('g_wordlists');
        $JSINFO['user_wordlists']=$this->getConf('user_wordlists');
        $JSINFO['subtitle_dst']=$this->getConf('subtitle_dst');
        $JSINFO['stable_dst']=$this->getConf('stable_dst');
        $JSINFO['def_dst']=$this->getConf('def_dst');
        $JSINFO['wordlist_dst']=$this->getConf('wordlist_dst');
    }

    function add_rpc_all(&$event, $param){
        $my_rpc_call=array(
            'ps.get_wordlist' => array('pagestat', 'get_wordlist'),
            'ps.check_word'=>array('pagestat', 'check_word'),
            'ps.getUser' => array('pagestat', 'getUser'),
            'ps.get_defs'=>array('pagestat','get_defs'),
            'ps.cp_subtitle'=>array('pagestat','Cp_subtitle'),
            'ps.cp_defs'=>array('pagestat','Cp_deflist'),
            'ps.cp_wordlist'=>array('pagestat','Cp_wordlist')
        );
        $event->data=array_merge($event->data,$my_rpc_call);
    }

    function addbutton(Doku_Event &$event){
        global $ID, $REV,$GLOBALS;
        if($event->data['view'] == 'main'){
            $params = array();

            $mybt=<<<TESTEST
<li>
<a href="#" class="action pt_pagetools %s" rel="nofollow" title="i am test">
<span>%s</span>
</a>
<div class="rawedges pt_pa_sub">
TESTEST;
            if($GLOBALS['ACT']=="edit"){
                $tool_page= tpl_include_page("user:admin:etools:edit", false, false);
                $mybt=sprintf($mybt,"ptools_edit"," in edit");
            }else{
                $tool_page= tpl_include_page("user:admin:etools:view", false, false);
                $mybt=sprintf($mybt,"ptools_main"," main edit");
            }
            if($REV){
                $params['rev']=$REV;
            }
            $event->data['items'] = array_slice($event->data['items'], 0, -1, true) +
                array('test_bt' =>$mybt.$tool_page."</div></li>") +
                array_slice($event->data['items'], -1, 1, true);
        }
    }
}