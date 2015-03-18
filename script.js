/**
 * Created by iamchenxin on 2015/3/14.
 */
/*
 http://stackoverflow.com/questions/1038746/equivalent-of-string-format-in-jquery
 */
String.prototype.format = function () {
    var args = arguments;
    return this.replace(/\{(\d+)\}/g, function (m, n) { return args[n]; });
};

function xxeditpsbt_add(){

    var $sizect = jQuery('#size__ctl');
    var sizect=$sizect[0];
    if(!sizect)return;

    var mdiv =jQuery("<div id='pagestat_div'></div>");

    var btanal=jQuery("<input name='anal' class='button' type='button' value='Analyze'>");
    btanal.click(ajax_get_words);
    mdiv.append(btanal);

    var btword=jQuery("<input name='bword' class='button' type='button' value='Merge'>");
    btword.click(sort_wordlist);
    mdiv.append(btword);
    jQuery("#wiki__editbar").after(mdiv);


    var rtdiv = jQuery('<div id="pagestat_rt"><div id="pagestat_txtout"></div><textarea id="pagestat_edit" name="statedit" class="edit"></textarea> <div style="clear: both"></div>\
     <input id="pagestat_ok" name="ok" class="button" type="button" value="ok"><input id="pagestat_cancel" class="button" type="button" value="cancel"> </div> ');

    jQuery("body").append(rtdiv);
    jQuery("#pagestat_cancel").click(function(){
        jQuery("#pagestat_rt").slideUp(1000);
        jQuery("#pagestat_edit").slideUp(500);
//        jQuery("#pagestat_rt").css("display","none");
    });
    jQuery("#pagestat_ok").click(insert_words_todk);

}

function ajax_get_words(){
//    alert("ajax_get_words");
    var mdata={};
    mdata['pageid']="user:admin:wordlist";
    mdata['call']="ajaxpeon";
    mdata['target']="rawpage";
    var url = DOKU_BASE + 'lib/exe/ajax.php';
    jQuery.ajax({url:url,data:mdata,success:words_analyze,dataType:"jsonp",crossDomain:true});
    jQuery("#pagestat_rt").slideDown(1000);
    jQuery("#pagestat_txtout").html("get filter list~~~");

}

var words_out_list=[];

function words_analyze(data){
//    alert("words_analyze");
    jQuery("#pagestat_txtout").html("begin to analyze words~~~");
    var wordlisttxt = data.content;
    /*
    var cc=0;
    for(;cc<wordlisttxt.length;cc++){
        if(wordlisttxt[cc]=='['){
            break;
        }
    }
    */
    var wd_filter = wordlisttxt.split(",");


    jQuery("#pagestat_txtout").html(outstr);

    var texttmp = jQuery("#wiki__text").val();
    var text = texttmp.toLocaleLowerCase();
    var txlist= text.split(/[^\w\-_]+/);
    var outstr = "This page has " +txlist.length +" words.";
    txlist.sort();


    var i=1;
    var count=1;
    var tx_countset={};
    var unique_words=0;
    var regx =new RegExp("[^a-z]");
    // order and count every word
    for(;i<txlist.length;i++){
        if(regx.test(txlist[i])!=true) {  //ignore number and symbol
            if (txlist[i] != txlist[i - 1]) {
                tx_countset[txlist[i - 1]] = count;
                unique_words+=1;
                count = 1;
            } else {
                count += 1;
            }
        }
    }
    outstr+="and "+unique_words+" unique words.The words statistics:<br/>";
   outstr += JSON.stringify(tx_countset,null,"\t")+"<br/><br/><br/>";
    jQuery("#pagestat_txtout").html(outstr);
    var k=0;
    i=0;
    var samelist={};
    for(;k<wd_filter.length;k++){
        if(tx_countset[wd_filter[k]] != null ){
            samelist[wd_filter[k]]=tx_countset[wd_filter[k]];
            delete tx_countset[wd_filter[k]];
        }
    }

    var words_out_list=[];
    for (x in tx_countset){
        words_out_list[words_out_list.length]=x;
    }

    outstr+= "Un match words = " +words_out_list.length+",Your filter conut="+wd_filter.length+"<br/>" ;
//    rtstr += JSON.stringify(words_out_list,null,"\t")+"<br/>";
    var rtstr=words_out_list.join(",    ");
    jQuery("#pagestat_edit").val(rtstr);
    jQuery("#pagestat_edit").slideDown(500);

    jQuery("#pagestat_txtout").html(outstr);
    /*
    outstr+="<br/>";
    var xx;
    for(xx in JSINFO){
        outstr+=",key = "+xx;
        outstr+=",value= "+JSINFO[xx];
    }
    */
}

function insert_words_todk(){

    var anal_txt= jQuery("#pagestat_edit").val();
    var anal_list=anal_txt.split(",");
    anal_list.sort();
    var outstr="<WORDLIST>";
    for (var x in anal_list){
        outstr+=anal_list[x].trim()+", ";
    }
    outstr+="</WORDLIST>"+anal_list.length+"\n\n";
    var edit_txt = jQuery("#wiki__text").val();
    jQuery("#wiki__text").val(outstr+edit_txt);
    jQuery("#pagestat_edit").slideUp(500);
    jQuery("#pagestat_rt").slideUp(1000);
}

function sort_wordlist(){
    var edit_txt = jQuery("#wiki__text").val();
    var word_list =edit_txt.split(",");
    for(var jj=0;jj<word_list.length;jj++){
        word_list[jj]=word_list[jj].trim();
    }
    word_list.sort();

    var i=1;
    var count=1;
    var tx_countset={};
    var re_list=[];
    // order and count every word
    for(;i<word_list.length;i++){
        if (word_list[i] != word_list[i - 1]) {
            if(count>1){
                re_list[re_list.length]=word_list[i-1];
            }
            tx_countset[word_list[i - 1]] = count;
            count = 1;
        } else {
            count += 1;

        }
    }
    var out_list=[];
    for (var xx in tx_countset){
        out_list[out_list.length]=xx;
    }

    var rt_txt = out_list.join(",");
    alert("input words="+word_list.length+",out words="+out_list.length+"repeat words="+re_list.join(", "));
    jQuery("#wiki__text").val(rt_txt);
}
//----------------------




//Complement (set theory) ,conjuction
function wComplement_w(main_sortlist,sortlisttwo){

    var main_map=make_map_w(main_sortlist);
    var filt_sortlist=make_unique_list(sortlisttwo);

    var i=0;
    for(;i<filt_sortlist.length;i++){
        if(main_map[filt_sortlist[i]]!=null){ // exist both
            delete main_map[filt_sortlist[i]]; //subtract the both in main_map
        }
    }

    var words_out_list=[];
    for (x in main_map){
        words_out_list[words_out_list.length]=x;
    }

    return words_out_list; //the remaining is complement
}

function wIntersection_w(sortlistone,sortlisttwo){

    var main_map = make_map_w(sortlistone);
    var filt_sortlist=make_unique_list(sortlisttwo);

    var intersect_list=[];
    var i=0;
    for(;i<filt_sortlist.length;i++){
        if(main_map[filt_sortlist[i]]!=null){ // exist both
            intersect_list[intersect_list.length]=filt_sortlist[i]; //store the same word
        }
    }
    return intersect_list;
}

function wUnion_w(listone,listtwo){
    var list_all =listone.concat(listtwo);
    list_all.sort();
    var out_list=make_unique_list(list_all);
    return out_list;
}

function make_unique_list(ordered_list){
    var i=1;
    var count=1;
    var unique_list=[];
    var regx =new RegExp("[^a-zA-Z]");
    //  count every word
    for(;i<ordered_list.length;i++){
        if(regx.test(ordered_list[i])!=true) {  //ignore number and symbol
            if (ordered_list[i] != ordered_list[i - 1]) {
                unique_list[unique_list.length]= ordered_list[i - 1] ;
                count = 1;
            } else {
                count += 1;
            }
        }
    }
    return unique_list;
}
// this function
function make_map_w(ordered_list){
    var i=1;
    var count=1;
    var tx_countset={};
    var regx =new RegExp("[^a-zA-Z]");
    // count every word
    for(;i<ordered_list.length;i++){
        if(regx.test(ordered_list[i])!=true) {  //ignore number and symbol
            if (ordered_list[i] != ordered_list[i - 1]) {
                tx_countset[ordered_list[i - 1]] = count;
                count = 1;
            } else {
                count += 1;
            }
        }
    }
    return tx_countset;
}

//
function get_booklist(){

}
//--------------UI---------------------
var ptw_list=new Object();

function PTwindow(ptsubclass,pttop,ptleft,ptwidth,ptheight){
    if(pttop==null){
        pttop="2%";
    }else{

        if(pttop.charAt(pttop.length-1)!="%" ){
            pttop=pttop+"px";
        }

    }
    if(ptleft==null){
        ptleft="2%";
    }else{
        if(ptleft.charAt(ptleft.length-1)!="%" ){
            ptleft=ptleft+"px";
        }
    }
    if(ptwidth==null){
        ptwidth="auto";
    }else{
        if(ptwidth.charAt(ptwidth.length-1)!="%" ){
            ptwidth=ptwidth+"px";
        }
    }
    if(ptheight==null){
        ptheight="auto";
    }else{
        if(ptheight.charAt(ptheight.length-1)!="%" ){
            ptheight=ptheight+"px";
        }
    }
    this.pttop=pttop;
    this.ptleft=ptleft;
    this.ptwidth=ptwidth;
    this.ptheight=ptheight;
    this.ptsubclass=ptsubclass;
}
PTwindow.prototype.createwin=function(winid){
    var divstr='<div class="pt_window {0}" id="{0}{1}"><div class="pt_clientwin"></div> <div style="clear: both"></div>\
     <input name="ok" class="button" type="button" value="ok">\
        <input name="cancel" class="button" type="button" value="cancel"> </div> '.format(this.ptsubclass,winid);
    this.jqwin=jQuery(divstr);
    jQuery('body').append(this.jqwin);
    this.jqwin.children("input[name='cancel']").click(function(){
        jQuery(this).parent().slideUp(500);
    });
    return this.jqwin;
};
PTwindow.prototype.getwin=function(){return this.jqwin;};
PTwindow.prototype.getclientwin=function(){return this.jqwin.children(".pt_clientwin");};
PTwindow.prototype.show=function(){
    if(jQuery("html").hasClass("phone")){
        this.jqwin.css("width","90%");
        this.jqwin.css("height",this.ptheight);
        this.jqwin.css("top",this.pttop);
        this.jqwin.css("left","2%");
    }else{
        this.jqwin.css("width",this.ptwidth);
        this.jqwin.css("height",this.ptheight);
        this.jqwin.css("top",this.pttop);
        this.jqwin.css("left",this.ptleft);
    }
    this.jqwin.slideDown(500);
};


var open_page_height=null;
var open_page_width=null;
function close_window(){

}

function open_page_worker(data){
    var buttonid = data.reflect;
    var ptwin =ptw_list[buttonid];

    ptwin.show();
    if (data.content.length<3){ptwin.getclientwin().html("Missing word . . .");
    }else{
        ptwin.getclientwin().html(data.content);
    }
}

function open_page_win(){

//    var pageid = jQuery(this).attr("pageid");
    var pageid = jQuery(this).attr("arg1");
    if(pageid==null){
        return;
    }


    var buttonid= jQuery(this).attr("id");
    if(ptw_list[buttonid]==null){
        var top = jQuery(this).attr("arg2");
        var left = jQuery(this).attr("arg3");
        var width = jQuery(this).attr("arg4");
        var height = jQuery(this).attr("arg5");

        var swin =new PTwindow("ptopen",top,left,width,height);
        ptw_list[buttonid]=swin;
        swin.createwin(buttonid);
    }


    var mdata=new Object();
    mdata['pageid']=pageid;
    mdata['call']="ajaxpeon";
    var url = DOKU_BASE + 'lib/exe/ajax.php';
    mdata['target']="page";
    mdata['reflect']=buttonid;
    jQuery.ajax({url:url,data:mdata,success:open_page_worker,dataType:"jsonp",crossDomain:true});
}

var parse_book_list=null;
var pb_count=0;
var pb_pre_wordss;
var parse_book_fuc=null;
var parse_output=null;
var parse_str="";
var parse_logstr="";
function parse_book_aj(mdata){
    var pg_wordlist = mdata.content.toLowerCase().split(/[^\w\-_]+/);
    pg_wordlist.sort();
    if(pb_count<2){
        pb_pre_wordss=pg_wordlist;
    }else{
        var tmplist=parse_book_fuc(pb_pre_wordss,pg_wordlist);
        parse_logstr+="{0}({1},{2})->".format(tmplist.length,pb_pre_wordss.length,pg_wordlist.length);
        parse_str =tmplist.join(" ,  ")+"<br/><br/>" +parse_str;
        parse_output.html(parse_logstr+"<br/><br/>"+parse_str );
        pb_pre_wordss =tmplist;
    }

    if(pb_count<parse_book_list.length){
        var mdata=new Object();
        mdata['pageid']=parse_book_list[pb_count];
        mdata['call']="ajaxpeon";
        var url = DOKU_BASE + 'lib/exe/ajax.php';
        mdata['target']="rawpage";
        jQuery.ajax({url:url,data:mdata,success:parse_book_aj,dataType:"jsonp",crossDomain:true});
    }
    pb_count+=1;
}

function parse_book_word(){
    var parse_catalog = jQuery(this).parent().children(".parse_catalog");
    var ckboxss = parse_catalog.find('input[type="checkbox"]');
    parse_book_list=null;
    parse_book_list=new Array();
    pb_pre_wordss=null;
    parse_str="";
    parse_logstr="";
    ckboxss.each(function(){
        if(jQuery(this).prop("checked")==true){
            parse_book_list.push(jQuery(this).val());
        }
    });
    var parse_fuc = jQuery(this).parent().children('select[name="logic_sel"]').val();
    switch(parse_fuc){
        case "wIntersection_w":
            parse_book_fuc=wIntersection_w;
            break;
        case "wComplement_w":
            parse_book_fuc=wComplement_w;
            break;
        case "wUnion_w":
            parse_book_fuc=wUnion_w;
            break;
    }
    pb_count=0;
    if(parse_book_list.length<1){
        return;
    }else{
        var buttonid= jQuery(this).attr("id");
        if(ptw_list[buttonid]==null){
            var swin =new PTwindow("ptparse","2%","2%","90%","80%");
            ptw_list[buttonid]=swin;
            swin.createwin(buttonid);
            parse_output = ptw_list[buttonid].getclientwin();
        }

        ptw_list[buttonid].show();
        var mdata=new Object();
        mdata['pageid']=parse_book_list[pb_count];
        mdata['call']="ajaxpeon";
        var url = DOKU_BASE + 'lib/exe/ajax.php';
        mdata['target']="rawpage";
        jQuery.ajax({url:url,data:mdata,success:parse_book_aj,dataType:"jsonp",crossDomain:true});
        pb_count+=1;
    }
}

function parse_book_worker(mdata){

    var cat_list =mdata.content;
    var ptwin =ptw_list[mdata.reflect];
    var mystr='';
    var kk=0;
    var baseid = mdata.reflect+"_ck";
    for(;kk<cat_list.length;kk++){
        var id=baseid+kk;
        var bookname = cat_list[kk].substring(5);
        bookname = bookname.replace(/_/g," ");
        mystr+='<input type="checkbox" name="{0}" value="{1}" id="{2}" /><label for="{2}">{3}</label>'.format(baseid,cat_list[kk],id,bookname);
    }
    ptwin.getclientwin().children(".parse_catalog").html(mystr);

    ptwin.show();
}



function parse_book_win(){
//    alert(this.outerHTML);
    var buttonid= jQuery(this).attr("id");
//    alert(buttonid);
//    alert(buttonid);
    if(ptw_list[buttonid]==null){
        var top = jQuery(this).attr("arg1");
        var left = jQuery(this).attr("arg2");
        var width = jQuery(this).attr("arg3");
        var height = jQuery(this).attr("arg4");
        var swin =new PTwindow("ptparse",top,left,width,height);
        ptw_list[buttonid]=swin;
        swin.createwin(buttonid);
        var parse_catalog=jQuery( '<div class="parse_catalog"> </div>');

        var btckall = jQuery('<input name="ckall" class="button" type="button" value="ClickAll">');
        var btunckall = jQuery('<input name="unckall" class="button" type="button" value="UnClickAll">');
        btckall.click(function(){
            jQuery(this).parent().find('input[type="checkbox"]').prop("checked",true);
        });
        btunckall.click(function(){
            jQuery(this).parent().find('input[type="checkbox"]').prop("checked",false);
        });
        var logic_sel = jQuery('<select name="logic_sel"><option value="wIntersection_w">Intersection</option><option value="wComplement_w">Complement</option>\
    <option value="wUnion_w">Union</option></select>');
        var filter_sel = jQuery('<select name="filter_sel"><option value="wordlist">wordlist</option></select>');
        var user_filter_sel = jQuery('<select name="user_filter_sel"><option value="user_wordlist">none</option></select>');
        var parse_bt = jQuery('<input name="parse_bt" id="parse_bt" class="button" type="button" value="Parse">');
        parse_bt.click(parse_book_word);
//    var ckdiv = jQuery(mystr);

        swin.getclientwin().append(parse_catalog);
        swin.getclientwin().append(btckall);
        swin.getclientwin().append(btunckall);
        swin.getclientwin().append(logic_sel);
        swin.getclientwin().append(filter_sel);
        swin.getclientwin().append(user_filter_sel);
        swin.getclientwin().append(parse_bt);


    }
    var mdata=new Object();
    mdata['ns']="book";
    mdata['call']="ajaxpeon";
    var url = DOKU_BASE + 'lib/exe/ajax.php';
    mdata['target']="catalog";
    mdata['reflect']=buttonid;
    jQuery.ajax({url:url,data:mdata,success:parse_book_worker,dataType:"jsonp",crossDomain:true});

}

function search_book_worker(){

}

function search_book_win(){

}

function init_ui(){
    /*
    var divstr='<div id="{0}_rt"><div id="{0}_txtout"></div> <div style="clear: both"></div>\
     <input id="{0}_ok" name="ok" class="button" type="button" value="ok">\
        <input id="{0}_cancel" class="button" type="button" value="cancel"> </div> '.format("openpage");
        */

//    alert(jQuery("html").hasClass("phone"));
    jQuery(".xxpg_parse").click(parse_book_win);
    jQuery(".xxpg_open").click(open_page_win);
}

jQuery(xxeditpsbt_add);
jQuery(init_ui);