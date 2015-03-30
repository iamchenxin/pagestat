<?php
/**
 * Date: 2015/3/14
 * Time: 8:14
 *
 */

if(!defined('DOKU_INC')) define('DOKU_INC',realpath(dirname(__FILE__).'/../../').'/');
if(!defined('DOKU_PLUGIN')) define('DOKU_PLUGIN',DOKU_INC.'lib/plugins/');
require_once(DOKU_PLUGIN . 'syntax.php');

/**
 * All DokuWiki plugins to extend the parser/rendering mechanism
 * need to inherit from this class
 */
class syntax_plugin_pagestat_word extends DokuWiki_Syntax_Plugin {



    public function getType(){ return 'formatting'; }
    public function getAllowedTypes() { return array('formatting', 'substition', 'disabled'); }
    public function getSort(){ return 409; }
    public function connectTo($mode) { $this->Lexer->addEntryPattern('<WORDLIST.*?>(?=.*?</WORDLIST>)',$mode,'plugin_pagestat_word'); }
    public function postConnect() { $this->Lexer->addExitPattern('</WORDLIST>','plugin_pagestat_word'); }


    /**
     * Handle the match
     */
    public function handle($match, $state, $pos, Doku_Handler $handler){
        switch ($state) {
            case DOKU_LEXER_ENTER :
                $match = trim(substr($match,9,-1));
                return array($state, $match);

            case DOKU_LEXER_UNMATCHED :  return array($state, $match);
            case DOKU_LEXER_EXIT :       return array($state, '');
        }
        return array();
    }

    /**
     * Create output
     */
    public function render($mode, Doku_Renderer $renderer, $data) {
        // $data is what the function handle() return'ed.
        if($mode == 'xhtml'){
            /** @var Doku_Renderer_xhtml $renderer */
            list($state,$match) = $data;
            switch ($state) {
                case DOKU_LEXER_ENTER :
                    $renderer->doc .= '<span class="pg_show_wl">Wordlist:</span><div class="wordlist" id="wordlist_'.$match.'">';
                    break;

                case DOKU_LEXER_UNMATCHED :
                    $renderer->doc .= $renderer->_xmlEntities($match);
                    break;
                case DOKU_LEXER_EXIT :
                    $renderer->doc .= "<input class='button' type='button' value='Filt Words'id='pg_filt_wl'></div>";
                    break;
            }
            return true;
        }
        return false;
    }

}