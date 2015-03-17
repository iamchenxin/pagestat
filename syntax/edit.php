<?php
/**
 * Date: 2015/3/14
 * Time: 8:14
 *
 */

if(!defined('DOKU_INC')) define('DOKU_INC',realpath(dirname(__FILE__).'/../../').'/');
if(!defined('DOKU_PLUGIN')) define('DOKU_PLUGIN',DOKU_INC.'lib/plugins/');
require_once(DOKU_PLUGIN . 'syntax.php');

class syntax_plugin_pagestat_edit extends DokuWiki_Syntax_Plugin {
    private $pg_count=0;
    function getType(){ return 'substition';}
    function getPType(){ return 'block';}
    public function getSort() { return 321; }

    public function connectTo($mode) { $this->Lexer->addSpecialPattern('<PT.*?>',$mode,'plugin_pagestat_edit');}

/*
    public function connectTo($mode) { $this->Lexer->addEntryPattern($this->entry_pattern,$mode,'plugin_pagestat_'.$this->getPluginComponent());}
    public function connectTo($mode) { $this->Lexer->addSpecialPattern('<PT.*?>',$mode,'plugin_now');}
   function connectTo($mode) { $this->Lexer->addEntryPattern('\+\+\+\+.*?\|(?=.*\+\+\+\+)',$mode,'plugin_folded_div'); }
*/
    public function handle($match, $state, $pos, Doku_Handler $handler){
        /*
        switch ($state) {
            case DOKU_LEXER_SPECIAL :
                $match = trim(substr($match,3,-1));
                $pg_count=$pg_count+1;
                return array($state, $match,$pg_count-1);

            case DOKU_LEXER_UNMATCHED :  return array($state, $match);
        }
        return array();
        */
        $match = trim(substr($match,3,-1));
        $arg_list = explode(" ",$match);
        $this->pg_count=$this->pg_count+1;
        return array($state, $arg_list,$this->pg_count-1);
    }

    public function render($mode, Doku_Renderer $renderer, $data) {
        // $data is what the function handle() return'ed.
        if($mode == 'xhtml'){
            /** @var Doku_Renderer_xhtml $renderer */
            list($state,$arg_list,$count) = $data;
            $length = count($arg_list);
            if($length<1){
                return true;
            }
            $match=$arg_list[0];
            $arg_count=1;
//            $str =  '<div class="xxpg xxpg_'.$match.'" id="xxpg_'.$match+$count.'"></div>';
            $str2 = '<div class="xxpg xxpg_'.$match.'" id="xxpg_'.$match.$count.'" ';
            for(;$arg_count<$length;$arg_count++){
                $str2.='arg'.$arg_count.'="'.$arg_list[$arg_count].'" ';
            }
            $str2.='></div>';
           $renderer->doc .= $str2;
 //           $renderer->doc .='<div class="xxpg"></div> ';
            return true;
        }
        return false;
    }

}
