<?php
/**
 * Date: 2015/3/14
 * Time: 8:14
 *
 */

if(!defined('DOKU_INC')) define('DOKU_INC',realpath(dirname(__FILE__).'/../../').'/');
if(!defined('DOKU_PLUGIN')) define('DOKU_PLUGIN',DOKU_INC.'lib/plugins/');
require_once(DOKU_PLUGIN . 'syntax.php');

class syntax_plugin_pagestat_editpt extends DokuWiki_Syntax_Plugin {
    private $pg_count=0;
    function getType(){ return 'formatting';}
    function getAllowedTypes() { return array('formatting', 'substition', 'disabled'); }
    function getPType(){ return 'normal';}
    public function getSort() { return 323; }

    public function connectTo($mode) { $this->Lexer->addEntryPattern('<pt.*?>(?=.*?</pt>)',$mode,'plugin_pagestat_editpt'); }
    public function postConnect() { $this->Lexer->addExitPattern('</pt>','plugin_pagestat_editpt'); }



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

                    $pt_arg=implode(";",array_slice($arg_list,1));
                    $str2 =<<<MYSTR2
<span class="xxpg xxpg_$subname" id="xxpg_$subname$count" pt_arg="$pt_arg" pt_arg_count="$length" >
MYSTR2;
                    $renderer->doc .= $str2;


                    break;

                case DOKU_LEXER_UNMATCHED :
                    $renderer->doc .= $renderer->_xmlEntities($match);
                    break;
                case DOKU_LEXER_EXIT :
                    $renderer->doc .= "</span>";
                    break;
            }
            return true;
        }
        return false;
    }


}
