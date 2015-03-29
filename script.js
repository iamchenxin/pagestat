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
        outstr+=anal_list[x].trim()+",";
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
//    alert("input words="+word_list.length+",out words="+out_list.length+"repeat words="+re_list.join(", "));
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

//--------------UI---------------------

var ptw_list=new Object();
function tsshow(event){
    event.data.fuc.call(event.data.obj);
}

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
    var divstr='<div class="pt_window {0}" id="{0}{1}" winid="{1}" ><div class="pt_clientwin"></div> <div style="clear: both"></div>\
        <input name="close" class="button ptclose" type="button" value="close"> </div> '.format(this.ptsubclass,winid);
    this.jqwin=jQuery(divstr);
    jQuery('body').append(this.jqwin);
    this.jqwin.children("input[name='close']").click(function(){
        jQuery(this).parent().slideUp(500);
    });
    ptw_list[winid]=this;
    return this.jqwin;
};
PTwindow.prototype.getwin=function(){return this.jqwin;};
PTwindow.prototype.getwinid=function(){return this.jqwin.attr("winid");};
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
PTwindow.prototype.clickby= function(trigger){
    jQuery(trigger).click({"obj":this,"fuc":this.show},tsshow);
};


function make_list( book_list,backns,ptwinid ){
    var ckname="ck_"+ptwinid;
    var mystr="";
    mystr+='<ul><li><span class="back_ns show_booklist" ns="{0}" winid="{1}">Back</span></li>'.format(backns,ptwinid);

    if(book_list['ns']){
        for(var ns in book_list['ns']){
            var ckid="ckn_"+ns.replace(/:/g,"_");
            mystr+='<li class="bl_fold"><input type="checkbox" name="{1}" value="{2}" id="{3}" />\
            <label  class="lb_ns" for="{3}">{4}</label><span class="sp_fold show_booklist" ns="{2}" winid="{0}"> </span></li>'.format(ptwinid,ckname,ns,ckid,ns);
        }
    }
    mystr+='<div style="clear: both"></div>';
    if(book_list['files']){
        for(var i=0;i<book_list['files'].length;i++){
            var filename = book_list['files'][i];
            var ckid="ckf_"+filename.replace(/:/g,"_");
            mystr+='<li><input id="{2}" type="checkbox" name="{0}" value="{1}" /><label for="{2}">{3}</label></li>'.format(ckname,filename,ckid,filename);
        }
    }
    mystr+="</ul>";
    mystr+='<div style="clear: both"></div>';
    return mystr;
}

function show_booklist(arg_ns){
    var nowns=jQuery(this).attr("ns");
    if(nowns==null){
        nowns=arg_ns;
    }
    var nslist= nowns.substr(0,nowns.length-1).split(":");
    var winid = jQuery(this).attr("winid");
    var ptwin =ptw_list[winid];
    var book_list = ptwin.book_list;
    var cur_ns = nslist[0]+":";
    for(var i=1;i<nslist.length;i++){
        cur_ns+=nslist[i]+":";
        book_list=book_list["ns"][cur_ns];
    }
    var outwin = ptwin.getclientwin().children(".booklist");

    var ptwinid = winid;
    var backns="";
    for(var b=0;b<nslist.length-1;b++){
        backns+=nslist[b]+":";
    }

    var mystr = make_list(book_list,backns,ptwinid);

    outwin.html(mystr);
    outwin.find(".show_booklist").click(show_booklist);
}


function handle_list(mdata){
    var book_txt =mdata.content;
    var book_list =JSON.parse(book_txt);
    var ptwin =ptw_list[mdata.reflect];

    ptwin.book_list = book_list;
    var outwin = ptwin.getclientwin().children(".booklist");
    var ptwinid = mdata.reflect;

    var mystr = make_list(book_list,"book:",ptwinid);
    outwin.html(mystr);
    outwin.find(".show_booklist").click(show_booklist);
}

function Listwindow(ptsubclass,pttop,ptleft,ptwidth,ptheight){
    PTwindow.call(this,ptsubclass,pttop,ptleft,ptwidth,ptheight);
}
Listwindow.prototype=new PTwindow();

Listwindow.prototype.createwin=function(winid){

    PTwindow.prototype.createwin.call(this,winid);
    var booklist=jQuery( '<div class="booklist"> </div>');

//    var bookdir = jQuery('<input type="text" name="bookdir">');
    var btckall = jQuery('<input name="ckall" class="button" type="button" value="ClickAll">');
    var btunckall = jQuery('<input name="unckall" class="button" type="button" value="UnClickAll">');

    btckall.click(function(){
        jQuery(this).parent().find('input[type="checkbox"]').prop("checked",true);
    });
    btunckall.click(function(){
        jQuery(this).parent().find('input[type="checkbox"]').prop("checked",false);
    });
//    var user_filter_sel = jQuery('<select name="user_filter_sel"><option value="user_wordlist">uwords</option></select>');

    this.getclientwin().append(booklist);
//    this.getclientwin().append(bookdir);
    this.getclientwin().append(btckall);
    this.getclientwin().append(btunckall);
//    this.getclientwin().append(user_filter_sel);

    var mdata=new Object();
    mdata['call']="ajaxpeon";
    var url = DOKU_BASE + 'lib/exe/ajax.php';
    mdata['target']="booklist";
    mdata['reflect']=winid;
    jQuery.ajax({url:url,data:mdata,success:handle_list,dataType:"jsonp",crossDomain:true});
};

var WORDLIST_NAME = "user:admin:wordlist";

function addfilter_aj(mdata){
    var ptwin =ptw_list[mdata.reflect];
    var word_list_txt =mdata.content;
    var filter_sel = jQuery('<select name="filter_sel"><option value="none">none</option></select>');
    if(word_list_txt.length>5){
        var filter = word_list_txt.split(",");
        ptwin.filter = filter;
        var filter_sel = jQuery('<select name="filter_sel"><option value="{0}">wordlist</option></select>'.format(WORDLIST_NAME) );
    }
    ptwin.getclientwin().append(filter_sel);
}

Listwindow.prototype.addfilter=function(){

    var mdata=new Object();
    mdata['pageid']=WORDLIST_NAME;
    mdata['call']="ajaxpeon";
    var url = DOKU_BASE + 'lib/exe/ajax.php';
    mdata['target']="rawpage";
    mdata['reflect']=this.getwinid();
    jQuery.ajax({url:url,data:mdata,success:addfilter_aj,dataType:"jsonp",crossDomain:true});
};

var USER_WORDLIST_NAME = "user:iamchenxin:wordlist";

function add_userfilter_aj(mdata){
    var ptwin =ptw_list[mdata.reflect];
    var user_list_txt =mdata.content;
    var user_filter_sel = jQuery('<select name="user_filter_sel"><option value="none">none</option></select>');
    if(user_list_txt.length>5){
        ptwin.user_filter=user_list_txt.split(",");
        user_filter_sel = jQuery('<select name="user_filter_sel"><option value="{0}">user_wordlist</option></select>'.format(USER_WORDLIST_NAME) );
    }
    ptwin.getclientwin().append(user_filter_sel);
}

Listwindow.prototype.adduser_filter=function(){
    var mdata=new Object();
    mdata['pageid']=USER_WORDLIST_NAME;
    mdata['call']="ajaxpeon";
    var url = DOKU_BASE + 'lib/exe/ajax.php';
    mdata['target']="rawpage";
    mdata['reflect']=this.getwinid();
    jQuery.ajax({url:url,data:mdata,success:add_userfilter_aj,dataType:"jsonp",crossDomain:true});
};


Listwindow.prototype.getSubbooklist =function(subbooklist,out_arr){
    if(subbooklist["ns"] ){
        for(var subns in subbooklist['ns']){
            this.getAllSubbooklist(subbooklist['ns'][subns],out_arr);
        }
    }
    if(subbooklist["files"]){
        for(var i=0;i<subbooklist['files'].length;i++) {
            out_arr.push(subbooklist['files'][i]);
        }
    }
};

Listwindow.prototype.getsubNsbooklist =function(ns,out_arr){

    var nslist= ns.substr(0,ns.length-1).split(":");
    var book_list = this.book_list;
    var cur_ns = nslist[0]+":";
    for(var i=1;i<nslist.length;i++){
        cur_ns+=nslist[i]+":";
        book_list=book_list["ns"][cur_ns];
    }
    this.getSubbooklist(book_list,out_arr);
};

Listwindow.prototype.getselect_book = function(){
    var checkboxes = this.getclientwin().children(".booklist").find('input[type="checkbox"]');
    var flat_book_list=new Array();
    var ptwin = this;
    checkboxes.each(function(){
        if(jQuery(this).prop("checked")==true){
            var bookname = jQuery(this).val();
            if(bookname.charAt(bookname.length-1)==":" ){ // ns
                ptwin.getsubNsbooklist(bookname,flat_book_list);
            }else{
                flat_book_list.push(bookname);
            }
        }
    });
    return flat_book_list;
};





function parse_book_aj(mdata){
    var ptwin =ptw_list[mdata.reflect];
    var pg_wordlist = mdata.content.toLowerCase().split(/[^\w\-_]+/);
    pg_wordlist.sort();
    if(ptwin.parse_count<2){
        ptwin.pb_pre_wordss=pg_wordlist;
    }else{
        var tmplist=ptwin.parse_book_fuc(ptwin.pb_pre_wordss,pg_wordlist);
        ptwin.parse_logstr+="{0}({1},{2})->".format(tmplist.length,ptwin.pb_pre_wordss.length,pg_wordlist.length);
        ptwin.parse_str =tmplist.join(" ,  ")+"<br/><br/>" +ptwin.parse_str;
        ptwin.parse_output.html(ptwin.parse_logstr+"<br/><br/>"+ptwin.parse_str );
        ptwin.pb_pre_wordss =tmplist;
    }

    if(ptwin.parse_count<ptwin.parse_book_list.length){
        var mdata=new Object();
        mdata['pageid']=ptwin.parse_book_list[ptwin.parse_count];
        mdata['call']="ajaxpeon";
        var url = DOKU_BASE + 'lib/exe/ajax.php';
        mdata['target']="rawpage";
        mdata['rev']='ori';
        mdata['reflect']=ptwin.getwinid();
        jQuery.ajax({url:url,data:mdata,success:parse_book_aj,dataType:"jsonp",crossDomain:true});
    }
    ptwin.parse_count+=1;
}

function parse_book(event){
    var ptwin = event.data.ptwin;
    var parse_book_list = ptwin.getselect_book();
    var parse_fuc = ptwin.getclientwin().find('select[name="logic_sel"]').val();
    var parse_book_fuc=null;
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
    ptwin.parse_book_fuc = parse_book_fuc;
    ptwin.parse_book_list=parse_book_list;
    ptwin.parse_count =0;
    ptwin.pb_pre_wordss=null;
    ptwin.parse_str="";
    ptwin.parse_logstr="";
    if(parse_book_list.length<2){
        return;
    }else{
        var buttonid= jQuery(this).attr("id");
        if(ptw_list[buttonid]==null){
            var swin =new PTwindow("ptparse","2%","2%","90%","80%");
            ptw_list[buttonid]=swin;
            swin.createwin(buttonid);
            ptwin.parse_output = ptw_list[buttonid].getclientwin();
        }
        ptwin.parse_output.html("receiving book data ...");
        ptw_list[buttonid].show();
        var mdata=new Object();
        mdata['pageid']=parse_book_list[ptwin.parse_count];
        mdata['call']="ajaxpeon";
        var url = DOKU_BASE + 'lib/exe/ajax.php';
        mdata['target']="rawpage";
        mdata['rev']='ori';
        mdata['reflect']=ptwin.getwinid();
        jQuery.ajax({url:url,data:mdata,success:parse_book_aj,dataType:"jsonp",crossDomain:true});
        ptwin.parse_count+=1;
    }
}

function parse_book_win(){
    var winid = jQuery(this).attr("id");
    if(ptw_list[winid]==null){
        var top = jQuery(this).attr("arg1");
        var left = jQuery(this).attr("arg2");
        var width = jQuery(this).attr("arg3");
        var height = jQuery(this).attr("arg4");
        var ptwin =new Listwindow("parse_book",top,left,width,height);
        //    var ptwin = new Listwindow("iamcc1","100","600","300","400");
        ptwin.createwin(winid);
        ptw_list[winid]=ptwin;
        var logic_sel = jQuery('<select name="logic_sel"><option value="wIntersection_w">Intersection</option><option value="wComplement_w">Complement</option>\
    <option value="wUnion_w">Union</option></select>');

        var parse_bt = jQuery('<input name="parse_bt" id="parse_{0}" class="button" type="button" value="Parse">'.format(winid));
        parse_bt.click({"ptwin":ptwin},parse_book);
//        ptwin.addfilter();
//        ptwin.adduser_filter();
        ptwin.getclientwin().append(logic_sel);
        ptwin.getclientwin().append(parse_bt);
    }
    ptw_list[winid].show();
}


function search_book_aj(mdata){
    var ptwin =ptw_list[mdata.reflect];
    var page_wordlists = mdata.content;
    var mystr="";
    var filter = ptwin.user_filter;

    for(var bookname in page_wordlists){
        var wordarray = page_wordlists[bookname].split(",");
        var match_list = wIntersection_w(wordarray,filter);
        var unmatch_list = wComplement_w(wordarray,match_list);
        var match_rate = (match_list.length/wordarray.length)*100;
        var tmphh = match_rate.toString().split(".");
        var match_rate_str = tmphh[0];
        if(tmphh[1]!=null) {
            match_rate_str += "." + tmphh[1].substring(0, 2);
        }
        mystr+='<div class="match_rt" rate="{0}"><a href="{1}" target="_blank">{2}</a><span> , match rate:{0}% ({3}/{4}),</span><span class="match_show_dl">more detail...</span><br/>\
        <span class="mt_more_words">Unmatch list:[ {5} ]</span><br/><span class="mt_more_words">Match list : [ {6}]</span> </div>'.format(match_rate_str,DOKU_BASE+bookname,bookname,match_list.length,wordarray.length,unmatch_list.join(","),match_list.join(","));
    }
    ptwin.output.html(mystr);
    ptwin.output.find(".match_show_dl").click(function(){
        jQuery(this).siblings(".mt_more_words").toggle();
    });
}

function search_book(event){
    var ptwin = event.data.ptwin;
    var sl_book_list = ptwin.getselect_book();
    var parse_fuc = ptwin.getclientwin().find('select[name="logic_sel"]').val();
    if(sl_book_list.length>0){
        var buttonid= jQuery(this).attr("id");
        if(ptw_list[buttonid]==null){
            var swin =new PTwindow("ptsearch","2%","2%","90%","80%");
            ptw_list[buttonid]=swin;
            swin.createwin(buttonid);
            ptwin.output = swin.getclientwin();
        }
        ptwin.output.html("receiving book data ...");
        ptw_list[buttonid].show();

        var mdata=new Object();
        mdata['call']="ajaxpeon";
        var url = DOKU_BASE + 'lib/exe/ajax.php';
        mdata['target']="page_wordlists";
        mdata['pglist']=JSON.stringify(sl_book_list);
        mdata['reflect']=ptwin.getwinid();
        jQuery.ajax({url:url,data:mdata,success:search_book_aj,dataType:"jsonp",crossDomain:true});
    }
}

function search_book_win(){
    var winid = jQuery(this).attr("id");
    if(ptw_list[winid]==null){
        var top = jQuery(this).attr("arg1");
        var left = jQuery(this).attr("arg2");
        var width = jQuery(this).attr("arg3");
        var height = jQuery(this).attr("arg4");
        var ptwin =new Listwindow("search_book",top,left,width,height);
        ptwin.createwin(winid);
        ptw_list[winid]=ptwin;

        var search_bt = jQuery('<input name="search_bt" id="search_{0}" class="button" type="button" value="Search">'.format(winid));
        search_bt.click({"ptwin":ptwin},search_book);
//        ptwin.addfilter();
        ptwin.adduser_filter();
        ptwin.getclientwin().append(search_bt);
    }
    ptw_list[winid].show();
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


function pg_show_wordlist(){
    jQuery(".pg_show_wl").click(function(){
        jQuery(this).siblings(".wordlist").toggle();
    });
}


function init_ui(){
    /*
    var divstr='<div id="{0}_rt"><div id="{0}_txtout"></div> <div style="clear: both"></div>\
     <input id="{0}_ok" name="ok" class="button" type="button" value="ok">\
        <input id="{0}_cancel" class="button" type="button" value="cancel"> </div> '.format("openpage");
        */

//    alert(jQuery("html").hasClass("phone"));
    USER_WORDLIST_NAME = JSINFO['userwords_ns']+JSINFO['user']+":wordlist";
    WORDLIST_NAME=JSINFO['wordlist_ns']+"wordlist";

    pg_show_wordlist();
    jQuery(".xxpg_book").click(search_book_win);
    jQuery(".xxpg_parse").click(parse_book_win);
    jQuery(".xxpg_open").click(open_page_win);
}

jQuery(xxeditpsbt_add);
jQuery(init_ui);