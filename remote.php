<?php
/**
 * Created by PhpStorm.
 * User: z97
 * Date: 15-6-3
 * Time: 下午9:14
 */
if(!defined('DOKU_INC')) define('DOKU_INC',dirname(__FILE__).'/../../');
require_once(DOKU_INC.'inc/init.php');
require_once(DOKU_INC."inc/RemoteAPICore.php");
require_once(DOKU_INC."inc/remote.php");
require_once(DOKU_INC."inc/remoteAPI_l.php");
require_once (DOKU_INC . 'inc/parserutils.php');

class remote_plugin_pagestat extends DokuWiki_Remote_Plugin {
    protected $helper;
    protected $remoteapi;
    function __construct(){
        $this->helper=new helper_plugin_pagestat();
        $this->remoteapi=new remoteAPI_l();
    }

    public function _getMethods() {
        return array(
            'test' => array(
                'args' => array('string'),
                'return' => 'string'
            ),
            'getUser' => array(
                'args' => array(),
                'return' => 'string'
            ),
        );
    }

    function test($msg){
        return "i am pagestat!! ($msg) .";
    }

    public function getUser(){
        global $INPUT;
        return $INPUT->server->str('REMOTE_USER') ;
    }

    function rawPage($id,$rev=''){
        $id = $this->resolvePageId($id);
        if(auth_quickaclcheck($id) < AUTH_READ){
            throw new RemoteAccessDeniedException('You are not allowed to read this file', 111);
        }
        $text = rawWiki($id,$rev);
        if(!$text) {
            $text='';
        }
        return $text;
    }

    private function resolvePageId($id)
    {
        $id = cleanID($id);
        if (empty($id)) {
            global $conf;
            $id = cleanID($conf['start']);
        }
        return $id;
    }

    public function get_wordlist($fullid){
        $txtstr=$this->rawPage($fullid);
        if(strlen($txtstr)<20){
            return '';
        }
        $outlist="";
        $rt = preg_match("@<WORDLIST\b(.*?)>(.*?)</WORDLIST>@",$txtstr,$match);
        if($rt){
            $outlist=$match[2];
        }
        return $outlist;
    }

    function make_sql_artxt($arr){
        $sql_w_arr=array();
        foreach($arr as $wd){
            $sql_w_arr[]="'$wd'";
        }
        return implode(",",$sql_w_arr);
    }


    //because i am jsonrpc ,so its allready array
    function check_word($words_arr,$return_inf="WORD"){ //$return_inf = 'WORD' or 'MORE' or 'FULL'
        $sql_hw_col="word";
        $sql_rw_col="word,headword";
        switch($return_inf){
            case "MORE":
                $sql_hw_col="word,rank,rankRange";
                $sql_rw_col="word,headword,headwordId";
                break;
            case "FULL":
                $sql_hw_col="word,rank,rankRange,relatedWords";
                $sql_rw_col="word,headword,headwordId";
                break;
        }

        $sqli = new mysqli("localhost", "www-data", "135790", "wordlist");

        $headwords=array();

        $sql_s=$this->make_sql_artxt($words_arr);

        $sql_h_sel=<<<HSEL
SELECT $sql_hw_col FROM headwords WHERE word IN ($sql_s)
HSEL;

        $rt=$sqli->query($sql_h_sel);
        while($row=$rt->fetch_assoc()){
            $headwords[]=$row['word'];
            $headwords_fm[]=$row;
        }

        $remain_arr = array_diff($words_arr,$headwords);
        if(count($remain_arr)>0) {
            $sql_s = $this->make_sql_artxt($remain_arr);

            $sql_rr_sel = <<<HSEL
SELECT $sql_rw_col FROM rwords WHERE word IN ($sql_s)
HSEL;
            $rt = $sqli->query($sql_rr_sel);
            $rwords = $rt->fetch_all();


            $rel_arr = array();
            foreach ($rwords as $dt) {
                $rel_arr[] = $dt[0];
            }
            $n_arr = array_diff($remain_arr, $rel_arr);
            sort($n_arr);

        }

        if($return_inf=="WORD") {
            $out_ob = array("headwords" => $headwords,
                "rwords" => $rwords,
                "unwords" => $n_arr
            );

        }else{
            if($n_arr) {
                $sql_ext = $this->make_sql_artxt($n_arr);

                $sql_ext_sel = <<<EXTSEL
SELECT word FROM extwords WHERE word IN ($sql_ext)
EXTSEL;
                $rt = $sqli->query($sql_ext_sel);
                while ($row = $rt->fetch_assoc()) {
                    $extwords[] = $row['word'];
                }


                $un_arr = array_diff($n_arr, $extwords);

                sort($un_arr);
            }

            $out_ob = array("headwords" => $headwords_fm,
                "rwords" => $rwords,
                "extwords" => $extwords,
                "unwords" => $un_arr
            );
        }

        $sqli->close();
        return $out_ob;
    }

    function get_defs($words_arr,$return_inf="SIMPLE"){//$return_inf = 'WORD' or 'SIMPLE'
        if(is_array( $words_arr)!=true||count($words_arr)<1){
            throw new \xx_jsonrpc\E_Invalid_params("params error. invalid words array. ");
        }
        $sqli = new mysqli("localhost", "www-data", "135790", "gldic");
        $sql_arr_txt = $this->make_sql_artxt($words_arr);

        switch($return_inf){
            case "MORE":
                $sql_defs_sel=<<<DEFSMORE
SELECT word,pron,defsimp,defen FROM more WHERE word IN ($sql_arr_txt)
DEFSMORE;
                break;
            case "SIMPLE":
                $sql_defs_sel=<<<DEFSSIMP
SELECT word,pron,defsimp FROM simple WHERE word IN ($sql_arr_txt)
DEFSSIMP;
                break;
            default:
                throw new \xx_jsonrpc\E_Internal_error("get_defs wrong return_inf=$return_inf");
        }
        $rt=$sqli->query($sql_defs_sel);

        $defs=$rt->fetch_all();
        $sqli->close();
        return $defs;

    }

    public function Format_def_more($word_def){
        $word = $word_def[0];
        $pron = $word_def[1];
        $defsimp = $word_def[2];
        $defen_txt = $word_def[3];
        $out_txt="";
        $out_txt.="===== $word =====\n";
        $out_txt.="  * <wrap vo>$word</wrap> ($pron) \\\\ **$defsimp**\n";
        if($defen_txt){
            $defen=json_decode($defen_txt,TRUE);

            foreach($defen as $pos=>$subdefs){
                $out_txt.="    - $pos\n";
                foreach($subdefs as $index=>$subd){
                    $out_txt.="      - ''{$subd['mean']}''\\\\ {$subd['sen']}\n";
                }
            }
        }
        return $out_txt;
    }

    public function Build_defmore_list($word_list){
        $word_def_list=$this->get_defs($word_list,"MORE");
        $def_map=array();
        foreach($word_def_list as $index=>$word_def){
            $def_map[$word_def[0]]=$word_def;
        }

        $out_txt="";
        foreach($word_list as $i=>$word){

            if(isset($def_map[$word])){
                $def = $def_map[$word];

                $out_txt.=$this->Format_def_more($def);
            }else{
                $out_txt.="===== $word !!! =====\n";
                $out_txt.= "  - $word : !!!!!NO DEF!!!!!\n";
            }
        }
        return $out_txt;

    }


    public function Cp_subtitle($pageid,$subtitle_txt){


        $filename=end(explode(":",$pageid));

        $subid="$pageid:{$this->getConf('subtitle_dst')}";
        $save_txt=<<<SAVETXT
<code - $filename.srt>
$subtitle_txt
</code>
SAVETXT;

        $rt=$this->remoteapi->putPage($subid,$save_txt,["sum"=>"generate by Cp_subtitle"]);
        return $pageid;
    }

    public function Cp_deflist($pageid,$word_list){

        $def_txt=$this->Build_defmore_list($word_list);
        $defid="$pageid:{$this->getConf('def_dst')}";
        $rt=$this->remoteapi->putPage($defid,$def_txt,["sum"=>"generate by Cp_deflist"]);
        return $pageid;
    }

    public function Cp_wordlist($pageid,$txt){
        $wordlistid="$pageid:{$this->getConf('wordlist_dst')}";
        $rt=$this->remoteapi->putPage($wordlistid,$txt,["sum"=>"generate by Cp_wordlist"]);
        return $pageid;
    }

    public function Cp_stable($pageid){

    }



}