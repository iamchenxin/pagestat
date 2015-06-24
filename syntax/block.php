<?php
/**
 * Created by PhpStorm.
 * User: z97
 * Date: 15-6-9
 * Time: 下午2:28
 */
if(!defined('DOKU_INC')) define('DOKU_INC',realpath(dirname(__FILE__).'/../../').'/');
if(!defined('DOKU_PLUGIN')) define('DOKU_PLUGIN',DOKU_INC.'lib/plugins/');
require_once(DOKU_PLUGIN . 'syntax.php');

class syntax_plugin_pagestat_block extends DokuWiki_Syntax_Plugin {
    private $pg_count=0;
    protected $entry_pattern = '<BK.*?>(?=.*?</BK>)';
    protected $exit_pattern  = '</BK>';
    function getType(){ return 'substition';}
    function getPType(){ return 'block';}
    public function getSort() { return 322; }
    public function getAllowedTypes() { return array('formatting', 'substition', 'disabled'); }
    public function connectTo($mode) { $this->Lexer->addEntryPattern($this->entry_pattern,$mode,'plugin_pagestat_block'); }
    public function postConnect() { $this->Lexer->addExitPattern($this->exit_pattern,'plugin_pagestat_block'); }



    /*
        public function connectTo($mode) { $this->Lexer->addEntryPattern($this->entry_pattern,$mode,'plugin_pagestat_'.$this->getPluginComponent());}
        public function connectTo($mode) { $this->Lexer->addSpecialPattern('<PT.*?>',$mode,'plugin_now');}
       function connectTo($mode) { $this->Lexer->addEntryPattern('\+\+\+\+.*?\|(?=.*\+\+\+\+)',$mode,'plugin_folded_div'); }
    */
    public function handle($match, $state, $pos, Doku_Handler $handler){
        switch ($state) {
            case DOKU_LEXER_ENTER :
                $match = trim(substr($match,3,-1));
                $arg_list = explode(" ",$match);
                $this->pg_count=$this->pg_count+1;
                return array($state, $arg_list,$this->pg_count-1);

            case DOKU_LEXER_UNMATCHED :  return array($state, $match);
            case DOKU_LEXER_EXIT :       return array($state, '');
        }
        return array();
    }

    public function render($mode, Doku_Renderer $renderer, $data) {
        // $data is what the function handle() return'ed.
        if($mode == 'xhtml'){
            /** @var Doku_Renderer_xhtml $renderer */
            list($state,$match,$count) = $data;
            switch ($state) {
                case DOKU_LEXER_ENTER :
                    $arg_list = $match;
                    $length = count($arg_list);
                    if($length<1){
                        break;
                    }
                    $subname=$arg_list[0];
                    $arg_count=1;
//            $str =  '<div class="xxpg xxpg_'.$match.'" id="xxpg_'.$match+$count.'"></div>';

                    $str2 =<<<STRRR
<div class="xxbk xxbk_$subname" id="xxbk_$subname$count" init="n"
STRRR;
                    for(;$arg_count<$length;$arg_count++){
                        $str2.='arg'.$arg_count.'="'.$arg_list[$arg_count].'" ';
                    }
                    $renderer->doc .= $str2.' >';
                    break;

                case DOKU_LEXER_UNMATCHED :
                    $renderer->doc .= $renderer->_xmlEntities($match);
                    break;
                case DOKU_LEXER_EXIT :
                    $renderer->doc .= "</div>";
                    break;
            }
            return true;
        }
        return false;
    }


}