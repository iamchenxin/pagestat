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
var WORDLIST_NAME = "user:admin:wordlist";

//----------------------




//Complement (set theory) ,conjuction
function wComplement_w(main_sortlist,filter_words){

    var main_map=make_map_w(main_sortlist);
    var filt_sortlist=make_unique_list(filter_words);

    var i=0;

    for(;i<filt_sortlist.length;i++){
        if(main_map[filt_sortlist[i]]!=null){ // exist both
            delete main_map[filt_sortlist[i]]; //subtract the both in main_map

        }
    }

    var words_out_list=new Array();
    for (var x in main_map){
        words_out_list.push(x);
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
    var regx =new RegExp(/[^a-zA-Z]/);
    //  count every word
    for(;i<ordered_list.length;i++){
        if(regx.test(ordered_list[i-1])!=true) {  //ignore number and symbol
            if (ordered_list[i] != ordered_list[i - 1]) {
                unique_list.push( ordered_list[i - 1] );
                count = 1;
            } else {
                count += 1;
            }
        }
    }
    if(ordered_list[ordered_list.length - 1] != ordered_list[ordered_list.length - 2]){  // push the last def word
        unique_list.push(ordered_list[ordered_list.length - 1]);
    }
    return unique_list;
}
// this function
function make_map_w(ordered_list){  // make set ,and count the same words
    var i=1;
    var count=1;
    var tx_countset={};
    var regx =new RegExp("[^a-zA-Z]");
    // count every word
    for(;i<ordered_list.length;i++){
        if(regx.test(ordered_list[i-1])!=true) {  //ignore number and symbol
            if (ordered_list[i] != ordered_list[i - 1]) {
                tx_countset[ordered_list[i - 1]] = count;
                count = 1;
            } else {
                count += 1;
            }
        }
    }
    if(ordered_list[ordered_list.length - 1] != ordered_list[ordered_list.length - 2]){  // the last def word
        tx_countset[ordered_list[ordered_list.length - 1]]=1;
    }
    return tx_countset;
}
// -----------------math2----------------------------

function make_set(w_list){
    var w_set={};
    for(var i=0;i<w_list.length;i++){
        if(w_set[w_list[i]]){
            w_set[w_list[i]]+=1;
        }else {
            w_set[w_list[i]] = 1;
        }
    }
    return w_set;
}

//--------------UI---------------------


function tsshow(event){
    event.data.fuc.call(event.data.obj);
}





/*
var params={
    top:
    left:
    width:
    height:
    subclass:
    draggable:
};
*/
function PTwindow(param_obj){

    this.top=PTwindow.MakeDimen({value:param_obj.top ,default_v:"2%"});
    this.left=PTwindow.MakeDimen({value:param_obj.left ,default_v:"2%"});
    this.width=PTwindow.MakeDimen({value:param_obj.width ,default_v:"auto"});
    this.height=PTwindow.MakeDimen({value:param_obj.height ,default_v:"auto"});
    this.subclass=param_obj.subclass;
    this.draggable=(param_obj.draggable!=undefined)?param_obj.draggable:true;
    this.winid=param_obj.winid;

    var divstr='<div class="pt_window {0}" id="{0}{1}" winid="{1}" ><div class="pt_clientwin"></div> <div style="clear: both"></div>\
        <input name="close" class="pt_button_r ptclose" type="button" value="close"> </div> '.format(this.subclass,this.winid);
    this.jqwin=jQuery(divstr);
    jQuery('body').append(this.jqwin);
    if(this.draggable){
        this.jqwin.draggable();
    }
    this.jqwin.children("input[name='close']").click(function(){
        jQuery(this).parent().slideUp(500);
    });

    if(jQuery("html").hasClass("phone")){
        this.jqwin.css("width","100%");
        this.jqwin.css("height",this.height);
        this.jqwin.css("top",this.top);
        this.jqwin.css("left","0%");
    }else{
        this.jqwin.css("width",this.width);
        this.jqwin.css("height",this.height);
        this.jqwin.css("top",this.top);
        this.jqwin.css("left",this.left);
    }
}
/*var param_obj_MakeDimen={
 deft:1, //"default data",
 value:0 //""
 };*/
PTwindow.MakeDimen=function(param_obj){

    var deft=(param_obj.default_v!=undefined)?param_obj.default_v:"auto";
    var outv = param_obj.value;
    if(outv==null){
        outv=deft;
    }else{
        if(outv.charAt(outv.length-1)!="%" ){
            outv=outv+"px";
        }
    }
    return outv;
};
PTwindow.Extract_ptparams=function(jwin){

    var arg_txt=jwin.attr("pt_arg");
    var arg_list=arg_txt.split(";");
    var out_params={};
    for(var i=0;i<arg_list.length;i++){
        var sub_arg=arg_list[i].split("=");
        if(sub_arg.length>=2){
            out_params[sub_arg[0].trim()]=sub_arg[1];
        }else{
            out_params["BAD"]=arg_list[i];
        }
    }
    var winid=jwin.attr("id");
    if(winid){
        out_params.winid=winid;
    }else{
        throw "the dom who open ptwindow must has a id!";
    }
    return out_params;
}
PTwindow.ptw_list={};
PTwindow.Factory=function(window_type,params_obj){
    var winid= params_obj.winid;
    if(winid==null){
        throw "winid should not null!";
    }
    if(!PTwindow.GetObj(winid)){
        PTwindow.ptw_list[winid]=new window_type(params_obj);
    }
    return PTwindow.ptw_list[winid];
};
PTwindow.Factory_byElement=function(window_type,element) {
    var factory_win = jQuery(element);
    var winid=factory_win.attr("id");
    if(!PTwindow.GetObj(winid)){
        var params = PTwindow.Extract_ptparams(factory_win);
        PTwindow.Factory(window_type,params);
    }

    return PTwindow.ptw_list[winid];
};

PTwindow.GetObj=function(winid){
    return PTwindow.ptw_list[winid];
};



PTwindow.prototype.get_closebt=function(){return this.jqwin.children(".ptclose");};
PTwindow.prototype.getwin=function(){return this.jqwin;};
PTwindow.prototype.getwinid=function(){return this.jqwin.attr("winid");};
PTwindow.prototype.getclientwin=function(){return this.jqwin.children(".pt_clientwin");};
PTwindow.prototype.show=function(speed){
    if(speed!=true){speed=500;}

    this.jqwin.slideDown(speed);
};
PTwindow.prototype.clickby= function(trigger){
    jQuery(trigger).click({"obj":this,"fuc":this.show},tsshow);
};
PTwindow.prototype.gain_wlistarray=function(wordlists_txt){
    var warr = wordlists_txt.split(",");
    var outarr=[];
    for(var i=0;i<warr.length;i++){
        var wtmp=warr[i].trim();
        if(wtmp){
            outarr.push(wtmp);
        }
    }
    return outarr;
};

PTwindow.prototype.ctwinScrollDown=function(){
    this.getclientwin().scrollTop(this.getclientwin()[0].scrollHeight);
};
PTwindow.prototype.heightlight=function(class_name){
    var thecl=this.getwin().find(class_name);
    if(this.pre_heightlight){
        var cl_list=this.pre_heightlight.attr("class").split(" ");
        var new_list=[];
        for(var i=0;i<cl_list.length;i++){
            if(cl_list[i].trim()!="pt_heightlight"){
                new_list.push(cl_list[i]);
            }
        }

        this.pre_heightlight.attr("class",new_list.join(" "));

    }
    this.pre_heightlight=thecl;

    thecl.attr("class",thecl.attr("class")+" pt_heightlight");

};

// ----------------------------log ---win ----------------
function PTlog(){
    PTwindow.call(this,{winid:"xxxptlog",subclass:"cccptlog",width:"auto",height:"auto"});

    this.getwin().css({
        position:"fixed",
        top:"",
        left:"",
        bottom:"8px",
        right:"8px"
    });
    this.getclientwin().css({
        "overflow-y": "auto"
    });

}
PTlog.prototype=Object.create(PTwindow.prototype);

PTlog.prototype.log=function(txt){
    this.getclientwin().html(txt);
    this.getwin().stop().fadeIn(300).fadeTo(5000,0.5).slideUp(500);
};
PTlog.prototype.loga=function(txt){
    var out_txt =this.getclientwin().html()+txt;
    this.log(out_txt);
};

var ptlog;

// ==============

// ------------- english ---special
function helper_build_opt(prefix,arr){
    var opts="";
    for(var i=0;i<arr.length;i++){
        opts+='<option value="{0}">{1}</option>'.format(arr[i],prefix+arr[i]);
    }
    return opts;
}

function PTwindow_E(param_obj){
    if(param_obj.subclass==null){
        param_obj.subclass="PTwindow_E";
    }
    PTwindow.call(this,param_obj);

    var g_pre="user:admin:";
    this.g_wordlists=this.gain_wlistarray(JSINFO['g_wordlists']);
    this.default_wordlist=g_pre+this.g_wordlists[0];
    this.g_wordlist_select='<select class="g_w_selct" name="g_w_selct">{0}</select>'.format(helper_build_opt(g_pre,this.g_wordlists));

    var u_pre = "user:{0}:".format(JSINFO['user']);
    this.u_wordlists=this.gain_wlistarray(JSINFO['user_wordlists']);
    this.u_wordlist_select='<select class="u_w_selct" name="u_w_selct">{0}\
    </select>'.format('<option value="none">none</option>'+helper_build_opt(u_pre,this.u_wordlists));
}
PTwindow_E.prototype=Object.create( PTwindow.prototype);


function helper_pe_gselect(jq_ob){
    var g_wordlist = jq_ob.find("select.g_w_selct option:selected").html();
    var u_wordlist = jq_ob.find("select.u_w_selct option:selected").html();
    var outob={global:g_wordlist,user:u_wordlist};
    return outob;
}
PTwindow_E.prototype.get_select_wordlist=function(){
    var g_wordlist = this.getwin().find("select.g_w_selct option:selected").html();
    var u_wordlist = this.getwin().find("select.u_w_selct option:selected").html();
    var outob={global:g_wordlist,user:u_wordlist};
    return outob;
};
PTwindow_E.prototype.ajax_get_select_wlist= function (xcallback){
    var jqwin =this.getwin();
    var sel_arr = this.get_select_wordlist();
    var request_arr=[];
    if(sel_arr.global){
        request_arr.push({jsonrpc:"2.0",method:"ps.get_wordlist",params:[sel_arr.global],id: "global"});
    }else{
        return xcallback(null); // global wordlist must be exsit ! or die
    }
    if((sel_arr.user==true)&&(sel_arr.user!="none" )){
        request_arr.push({jsonrpc:"2.0",method:"ps.get_wordlist",params:[sel_arr.user],id: "user"});
    }
    var xcall = xcallback;
    ajax_batchcall(request_arr,function(data){
        var ob_sel={global:null,user:null};
        var re_arr=data;
        for(var i=0;i<re_arr.length;i++){
            switch (re_arr[i].id){
                case "global":
                    ob_sel.global=re_arr[i].result;
                    break;
                case "user":
                    ob_sel.user=re_arr[i].result;
                    break;
            }
        }
        xcall(ob_sel);
    });

};

PTwindow_E.prototype.ajax_get_defs_raw=function(words_arr,status,xcallback){
    if(!status){status="MORE";}
    ajax_xcall("ps.get_defs",[words_arr,status],function(data) {

           var defs=data.result;
           xcallback(defs);


    });
};

function PTE_Olist_sbl(indent){
    var out_txt="";
    for(var i=0;i<indent;i++){
        out_txt+="  ";
    }
    out_txt+="- ";
    return out_txt;
}
function PTE_Ulist_sbl(indent){
    var out_txt="";
    for(var i=0;i<indent;i++){
        out_txt+="  ";
    }
    out_txt+="* ";
    return out_txt;
}
function PTE_make_voice(word){
    return "<wrap vo>{0}</wrap>".format(word);
}

PTwindow_E.prototype.generate_def_more=function(word_def) {
    var indent = 1;
    var out_txt = "";


    var word = word_def[0];
    var pron = word_def[1];
    var defsimp = word_def[2];
    var defen_txt = word_def[3];
    out_txt += "{0}{1} ({2}) \\\\ **{3}**\n".format(PTE_Olist_sbl(indent), PTE_make_voice(word), pron,defsimp);
    indent++;
//    out_txt += "{0}{1}\n".format(PTE_Ulist_sbl(indent), defsimp);
    if (defen_txt) {
        var defen=JSON.parse(defen_txt);
        for (var key in defen) {
            out_txt += "{0}{1}\n".format(PTE_Ulist_sbl(indent), key);
            var subdefs = defen[key];
            indent++;
            for (var i = 0; i < subdefs.length; i++) {
                var sdef = subdefs[i];
                out_txt += "{0}''{1}''\\\\ {2}\n".format(PTE_Olist_sbl(indent), sdef.mean, sdef.sen);
            }
            indent--;
        }
    }
    indent--;
    return out_txt;
};

PTwindow_E.prototype.ajax_get_defs=function(words_arr,status,xcallback){
    if(!status){status="MORE";}
    var call_ob=this;
    this.ajax_get_defs_raw(words_arr,status,function(defs){


           var defs_map={};
           for(var i=0;i<defs.length;i++){
               defs_map[defs[i][0]]=defs[i];
           }

           var out_txt="";

           for(var i=0;i<words_arr.length;i++){
               var word_def=defs_map[words_arr[i]];
               if(word_def) {
                   out_txt += call_ob.generate_def_more(word_def);
               }else{
                   out_txt += "  - {0} : !!!!!NO DEF!!!!!\n".format(words_arr[i]);
               }
           }
           xcallback(out_txt);

    });
};



// <<<<<<<<-------------------------

// ---------------------Editwindow----------------
function Editwindow(param_obj){
    param_obj.subclass=param_obj.subclass?param_obj.subclass:"Editwindow";
    PTwindow.call(this,param_obj);

    var workdiv =jQuery('<div class="pt_edit_static"></div><textarea class="pt_edit_area" name="pt_edit" class="edit"></textarea> <div style="clear: both"></div>');
    this.getclientwin().append(workdiv);
}
Editwindow.prototype=Object.create( PTwindow.prototype);


Editwindow.prototype.get_edit_static=function(){
    return this.getclientwin().children(".pt_edit_static");
};

Editwindow.prototype.get_edit_area=function(){
    return this.getclientwin().children(".pt_edit_area");
};
// <<<<<<<<<<<--------Editwindow-----------------------------


// ---------------------MulEditwindow----------------
/*
 param_obj.rt_win;
* */
function MulEditwindow(param_obj){
    param_obj.subclass=param_obj.subclass?param_obj.subclass:"MulEditwindow";
    PTwindow_E.call(this,param_obj);
    this.edit_array=param_obj.rt_win;

    var edit_array =this.edit_array;
    var outtxt="";
    for(var i=0;i<edit_array.length;i++){
        var medit=edit_array[i];
        var height = medit.height?medit.height:"auto";
        var width = medit.width?medit.width:"auto";
        var mfloat = medit.float?medit.float:"right";
        var display = medit.display?medit.display:"block";

        switch (medit.type){
            case "static":
                outtxt+='<div class="pt_mul_edit pt_edit_static {0}" style="height: {1};width: {2};display: {3}">\
                </div>'.format(medit.nclass,height,width,display);
                break;
            case "area":
                outtxt+='<textarea class="{0} pt_mul_edit pt_edit_area" name="{0}" style="height: {1};width: {2};display: {3}"></textarea>'.format(medit.nclass,height,width,display);
                break;
            case "button":
                outtxt+='<input name="{0}" class="{0} button" type="button" value="{1}" style="float: {2};display: {3}">'.format(medit.nclass,medit.value,mfloat,display);
                break;
            case "wd_select":
                outtxt+='<span>global word list: </span>'+this.g_wordlist_select+
                '<span> your word list: </span>'+this.u_wordlist_select;
                break;
        }
    }

    outtxt+='<div class="pt_mul_edit pt_edit_static pt_edit_log" style="height: auto;width: 98%;display: block">';
    outtxt+='<div style="clear: both"></div>';
    var workdiv =jQuery(outtxt);
    this.getclientwin().append(workdiv);
}
MulEditwindow.prototype=Object.create( PTwindow_E.prototype);


MulEditwindow.prototype.ptlog=function(str){
    var logblock= this.getwin().find(".pt_edit_log");
    logblock.html(logblock.html()+str);
};

MulEditwindow.prototype.check_word=function(words_arr,out_jqwin,mcall_back){
    var call_ob=this;
    var call_back=mcall_back;
    ajax_xcall("ps.check_word",[words_arr],function(data){

        var headwords=data.result["headwords"];
        var rwords=data.result["rwords"];
        var unwords=data.result["unwords"];
        if(headwords) {
            var out_str = "[headwords]:\n" + headwords.join(",  ") + "\n";
        }

        if(rwords) {
            var rstr = [];
            var rw_ob = {};
            for (var i = 0; i < rwords.length; i++) {
                if (rw_ob[rwords[i][1]] != null) {
                    rw_ob[rwords[i][1]] += ", " + rwords[i][0];
                } else {
                    rw_ob[rwords[i][1]] = rwords[i][0];
                }
            }
            for (var key in rw_ob) {
                rstr.push("  {0} ({1})".format(key, rw_ob[key]));
            }
            out_str += "\n[rwords]:\n" + rstr.join(",  ") + "\n";
        }
        if(unwords) {
            out_str += "\n[unwords]:\n" + unwords.join(",  ") + "\n";
        }
        out_jqwin.val(out_str);
        var out_log="headwords = {0} ,related words = {1} ,unwords(like location,name,etc..) = {2} <br/>".format(headwords.length,rstr.length,unwords.length);
        call_ob.ptlog(out_log);
        if(call_back){
            call_back();
        }
    });
};

MulEditwindow.prototype.get_full_wordinf=function(words_arr,out_jqwin){
    var call_ob=this;
    ajax_xcall("ps.check_word",[words_arr,"FULL"],function(data){
        var headwords=data.result["headwords"];
        var rwords=data.result["rwords"];
        var extwords=data.result["extwords"];
        var unwords=data.result["unwords"];

        var headrt=[];
        for (var i=0;i<headwords.length;i++){
            var hw=headwords[i];
            headrt.push(" {0}( {1})".format(hw['word'],hw['relatedWords']));
        }
        out_jqwin.val(headrt.join(",  "));
        var out_log=" headrt ={0}".format(headrt.length);
        call_ob.ptlog(out_log);
    });
};

MulEditwindow.prototype.sortword_inplace=function(inout_jqwin){
    var call_ob=this;
    var txt =inout_jqwin.val();
    var w_list=extract_allwords(txt);
    var w_set={};
    for(var i in w_list){
        if(w_list[i]) {
            w_set[w_list[i]] = i;
        }
    }
    var out_list=[];
    for(var key in w_set){
        out_list.push(key);
    }
    var out_log="words = {0} , unique words ={1}".format(w_list.length,out_list.length);

    call_ob.ptlog(out_log);
    inout_jqwin.val(out_list.join(","));
};

// <<<<<<<<<<<--------MulEditwindow-----------------------------


// ============================UI END --=====================================
// ============================UI END --=====================================
// ============================UI END --=====================================
// ============================UI END --=====================================

function split_and_trim(txt,seprator){
    var sep = seprator?seprator:",";
    var t_list=txt.split(sep);
    var out_list=[];
    for (var x in t_list){
        var tmp = t_list[x].trim();
        if(tmp.length>=1){
            out_list.push(tmp);
        }
    }
    return out_list;
}

function extract_allwords(txt){
    return txt.match(/[\w]+/g);
}

function extract_words_gt2(txt){
    return txt.match(/[\w]{3,}/g);
}

//---------------



function Analyze_Win(){
    var rt_win=[
        {type:"area",nclass:"al_subt_src",height:"60%",width:"100%"},
        {type:"static",nclass:"al_edit_src",height:"auto",width:"100%"},
        {type:"wd_select"},
        {type:"button",nclass:"al_filtword",value:"filt word",float:"right"},
        {type:"area",nclass:"al_edit_words",height:"48%",width:"100%",display:"none"},
        {type:"button",nclass:"al_checkword",value:"check word",float:"right",display:"none"},
        {type:"button",nclass:"al_generate",value:"generate words",float:"right",display:"none"},
        {type:"area",nclass:"al_edit_more",height:"48%",width:"100%",display:"none"},
        {type:"button",nclass:"al_makewords",value:"Make new wordlist",float:"right",display:"none"},
    ];
    var params={
      top: "0%",left:"3%",width:"93%",height:"92%", rt_win:rt_win,subclass:"pt_analyze_win"
    };
    MulEditwindow.call(this,params);

    self.subtitle=jQuery(".al_subt_src").val();

    this.heightlight(".al_filtword");
    var call_ob=this;

    this.getwin().find("input.al_filtword").click(function(){
        jQuery(this).hide();
        call_ob.analyze_word();
    });

    this.getwin().find("input.al_checkword").click(function(){
        jQuery(this).hide();

        var txt_list=split_and_trim( call_ob.getwin().find(".al_edit_words").val());
        txt_list.sort();
        var thewin = call_ob.getwin().find(".al_edit_words");
        call_ob.check_word(txt_list,thewin,function(){
            call_ob.getwin().find("input.al_generate").show();
            call_ob.heightlight(".al_generate");
        });

    });
    this.getwin().find("input.al_generate").click(function(){
        jQuery(this).val("Regenerate words");

        call_ob.generate_words();
    });

    this.getwin().find("input.al_makewords").click(function(){
        var in_jqwin=call_ob.getwin().find(".al_edit_more");
        var out_jqwin=jQuery("#wiki__text");
        call_ob.make_newwords(in_jqwin,out_jqwin);
    });
}
Analyze_Win.prototype=Object.create( MulEditwindow.prototype);




Analyze_Win.prototype.analyze_word=function(){
    var call_ob=this;
    var sel_wordlist =call_ob.get_select_wordlist();

    ajax_xcall("ps.get_wordlist",[sel_wordlist["global"]],function(data){
        jQuery(".al_edit_words").val("begin to analyze wos~~~");


        var wordlisttxt = data.result;

        var wd_filter = wordlisttxt.split(",");

        self.subtitle=jQuery(".al_subt_src").val();
        var texttmp = self.subtitle;
        var text = texttmp.toLocaleLowerCase();
        var txlist= extract_words_gt2(text);

        var work_inf = "This page has " +txlist.length +" words.";
        call_ob.txlist_unsort=txlist.concat();
        txlist.sort();

        var wordls_set =  make_map_w(txlist);
        var word_sort_list=new Array();
        for(var kk in wordls_set){
            word_sort_list.push(kk);
        }
        word_sort_list.sort();


        work_inf+="and "+word_sort_list.length+" unique words.<br/>";
        var src_words = JSON.stringify(wordls_set,null,"\t")+"<br/><br/><br/>";
        jQuery(".al_edit_src").html(src_words);

        var newwords_list = wComplement_w(word_sort_list,wd_filter);
        call_ob.newwords_list=newwords_list;

        work_inf+= "Un match words = " +newwords_list.length+",Your filter conut="+wd_filter.length+"<br/>" ;
        var rtstr=newwords_list.join(",    ");
        jQuery(".al_edit_words").val(rtstr);

        call_ob.ptlog(work_inf);
        call_ob.getwin().find(".al_edit_words").show();
        call_ob.getwin().find(".al_checkword").show();
        call_ob.heightlight(".al_checkword");
        call_ob.ctwinScrollDown();
    });
};



Analyze_Win.prototype.generate_words=function(){
    var call_ob=this;


    var txt_edit_words = call_ob.getwin().find(".al_edit_words").val();
    var txt_list = txt_edit_words.split(/\[[\w]+\]:/);

    var head_tmp=txt_list[1];
    var r_tmp=txt_list[2];
    var un_tmp=txt_list[3];
    var out_arr=[];
    if(txt_list.length>1){ // has headwords
        out_arr=extract_allwords(txt_list[1]);
    }

    if(txt_list.length>3){ // has unwords
        out_arr=out_arr.concat(extract_allwords(txt_list[3]));

    }

    var out_list_set={};
    for(var i=0;i<out_arr.length;i++){
        out_list_set[out_arr[i]]=out_arr[i];
    }


    if(txt_list.length>2){ // has related words
        var r_arr=txt_list[2].match(/[^,\(]+\([^\)]*\)|[\w]+/g);
        var r_length = r_arr?r_arr.length:0;
        for(var i=0;i<r_length;i++){
            var tmp_words=r_arr[i].match(/[\w]+/g);
            if(tmp_words){
                if(tmp_words.length>1){
                    out_list_set[tmp_words[1]]=tmp_words[0];
                }else{
                    out_list_set[tmp_words[0]]=tmp_words[0];
                }
            }
        }

    }


//    console.log(JSON.stringify(txlist_unsort));
    var txlist_unsort = call_ob.txlist_unsort;

    var unsort_out_list = [];
    for(var i=0;i<txlist_unsort.length;i++){
        if(out_list_set[txlist_unsort[i]]){
            unsort_out_list.push(out_list_set[txlist_unsort[i]]);
            delete out_list_set[txlist_unsort[i]];
//            console.log("i={0},word={1}".format(i,txlist_unsort[i]));
        }
    }

    var uns_set = make_set(unsort_out_list);
    var out_list=[];
    for(var i=0;i<unsort_out_list.length;i++){
        if(uns_set[unsort_out_list[i]]){
            out_list.push(unsort_out_list[i]);
            delete uns_set[unsort_out_list[i]];
        }
    }


    var log_inf= "The finally new words (ordered by the order in document) = " +out_list.length+"<br/>" ;
    call_ob.getwin().find(".al_edit_more").val(out_list.join(",    "));


    call_ob.ptlog(log_inf);
    call_ob.getwin().find(".al_edit_more").show();
    call_ob.getwin().find(".al_makewords").show();
    call_ob.heightlight(".al_makewords");
    call_ob.ctwinScrollDown();
};

function get_pagename(){
    if(JSINFO['id']){
        var tmp_arr = JSINFO['id'].split(":");
        var name = tmp_arr[tmp_arr.length-1];
        return name;
    }else{
        return "ERR";
    }
}

Analyze_Win.prototype.make_newwords=function(in_jqwin,out_jqwin){

    var newwords = extract_allwords(in_jqwin.val());
    var subtitle_id=JSINFO['id']+":"+JSINFO['subtitle_dst'];
    var subt_name=get_pagename();
    var wordmean_id=JSINFO['id']+":"+JSINFO['def_dst'];
    var wordlist_id=JSINFO['id']+":"+JSINFO['wordlist_dst'];

    var out_str="====== Movie Inf ======\n";
    out_str+="\nLike genre,stars,director and more,please editor me\n";
    out_str+="====== wordlist ======\n";
    out_str+="The wordlist location [[{0}]]\n".format(wordlist_id);
    out_str+="<BK open page={0}>Show wordlist of this page</BK>\n".format(wordlist_id);
    out_str+="\n===== slice =====\n";
    out_str+="\n====== Notice ======\n";
    out_str+="\n some hard grammar or sentence in movie,please editor me\n";
    out_str+="\n====== Words Meaning ======\n";
    out_str+="The words meaning location [[{0}]]\n".format(wordmean_id);
    out_str+="<BK open page={0}>Show All New Word Meaning</BK>\n".format(wordmean_id);

    out_str+="\n====== Subtitle ======\n";
    out_str+="The srt file location [[{0}]]\\\\ \n".format(subtitle_id);
    out_str+="<BK open page={0}>Show {1}.srt </BK>\n".format(subtitle_id,subt_name);


    out_jqwin.val(out_str);
    console.log(subt_name+"---"+JSINFO['id']);
    ajax_xcall("ps.cp_defs",[JSINFO['id'],newwords],function(data){
        console.dir(data);
    });

    ajax_xcall("ps.cp_subtitle",[JSINFO['id'],self.subtitle],function(data){
        console.dir(data);
    });

    ajax_xcall("ps.cp_wordlist",[JSINFO['id'],newwords.join(",")],function(data){
        console.dir(data);
    });

    this.getwin().slideUp(500);
};



function Init_english_edit_tool(){

    var con_win= jQuery(".pt_pa_sub");


    con_win.find(".xxpg_analyze").click(function(){
        var ptana=PTwindow.Factory(Analyze_Win,{winid:"analyze_w"});
        ptana.show(1000);
        ptlog.log("hello,iam xxpg_analyze click : {0}".format(jQuery(this).html()));
    });

    con_win.find(".xxpg_merge").click(sort_wordlist);

}




//----------------------

function ajax_get_words(){
//    alert("ajax_get_words");
    var mdata={};
    mdata['pageid']=WORDLIST_NAME;
    mdata['call']="ajaxpeon";
    mdata['target']="rawpage";
    var url = DOKU_BASE + 'lib/exe/ajax.php';
    jQuery.ajax({url:url,data:mdata,success:words_analyze,dataType:"jsonp",crossDomain:true});
    jQuery("#pagestat_rt").slideDown(1000);
    jQuery("#pagestat_txtout").html("get filter list~~~");

}


function insert_words_todk(){

    var anal_txt= jQuery("#pagestat_edit").val();
    var anal_list=anal_txt.split(",");
    var outstr="<WORDLIST>";
    for (var x in anal_list){
        anal_list[x]=anal_list[x].trim();
    }
    anal_list.sort();
    outstr+=anal_list.join(",");
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

    var out_list = make_unique_list(word_list);

    var rt_txt = out_list.join(",");

    jQuery("#wiki__text").val(rt_txt);
}

//------------------------------------
//--------------check words windows -----------------
function Checkwords_Win(param_obj){
    var rt_win=[
        {type:"area",nclass:"ck_edit_words",height:"48%",width:"100%"},
        {type:"button",nclass:"ckbt_checkword",value:"check word",float:"right"},
        {type:"area",nclass:"ck_full_words",height:"48%",width:"100%"},
        {type:"button",nclass:"ckbt_fullinf",value:"get full word inf",float:"right",display:"none"},
        {type:"button",nclass:"ckbt_sort",value:"sort words",float:"right",display:"none"}
    ];
    param_obj.rt_win=rt_win;
    param_obj.subclass="pt_checkwords_win";
    MulEditwindow.call(this,param_obj);

    var ctwin=this.getclientwin();
    var call_ob=this;
    call_ob.heightlight(".ckbt_checkword");
    ctwin.find(".ckbt_checkword").click(function(){
        var txt= ctwin.find(".ck_edit_words").val();
        call_ob.check_word(extract_allwords(txt),ctwin.find(".ck_edit_words"));
        jQuery(this).hide();
        ctwin.find(".ckbt_fullinf").show();
        call_ob.heightlight(".ckbt_fullinf");
        call_ob.ctwinScrollDown();
    });
    ctwin.find(".ckbt_fullinf").click(function(){
        var txt= ctwin.find(".ck_full_words").val();
        call_ob.get_full_wordinf(extract_allwords(txt),ctwin.find(".ck_full_words"));
        jQuery(this).hide();
        ctwin.find(".ckbt_sort").show();
        call_ob.heightlight(".ckbt_sort");
    });
    ctwin.find(".ckbt_sort").click(function(){
        call_ob.sortword_inplace(ctwin.find(".ck_full_words"));
    });
}
Checkwords_Win.prototype=Object.create(MulEditwindow.prototype);



function Make_Checkwords_Win(){

    var params= PTwindow.Extract_ptparams(jQuery(this));
    var ptwin = PTwindow.Factory(Checkwords_Win,params);
    ptwin.show();

}

// ---------------------word card win -------------------------------
function WordCard_Win(param_obj){
    var rt_win=[
        {type:"static",nclass:"wc_wordcard",height:"75%",width:"100%"},
        {type:"static",nclass:"wc_inf",height:"8%",width:"100%"},
        {type:"button",nclass:"wc_pre",value:"previous",float:"left"},
        {type:"button",nclass:"wc_next",value:"next",float:"right"},
    ];
    var params={winid:param_obj.winid,subclass:"pt_wordcard_win",rt_win:rt_win,top:"0%",left:"0%",width:"100%",height:"92%"};
    MulEditwindow.call(this,params);

    var w_from=param_obj.from;
    var w_to=param_obj.to;

    var ctwin=this.getclientwin();
    var call_ob=this;
    call_ob.heightlight(".wc_next");
    this.build_card(w_from,w_to);

    ctwin.find(".wc_pre").click(function(){
        call_ob.card_itor(-1);
        ctwin.find(".wc_inf").html("<----previous");

    });

    ctwin.find(".wc_next").click(function(){
        call_ob.card_itor(1);
        ctwin.find(".wc_inf").html("next ----> ");
    });

}
WordCard_Win.prototype=Object.create(MulEditwindow.prototype) ;



WordCard_Win.prototype.build_card=function(w_from,w_to){

    var ctwin=this.getclientwin();

    var infowin= ctwin.find(".wc_inf");
    var jq_wordlist=jQuery(".wordlist");
    var word_list=[];
    if(jq_wordlist.length==0){
        infowin.html("there is no wordlist in this page!!");
        return
    }


    if(jq_wordlist.length>0) {
        var wd_txt = jq_wordlist.text();

        var tmp="\\b{0}\\b.+\\b{1}\\b".format(w_from, w_to);
//            var tmp="\b"+s_from+"\b.+\b"+s_to+"\b";

        var reg_sr = new RegExp(tmp);
        var rt = wd_txt.match(reg_sr);

        if (rt) {
            word_list=extract_allwords(rt[0]);
        }else{
            infowin.html("!!! Maybe The slice words was deleted from the wordlist,please choose another word to slice");
        }
    }

    var word_map={};
    for(var i=0;i<word_list.length;i++){
        word_map[word_list[i]]=i;
    }

    var word_cards_tmp=[];
    var tran_list=jQuery(".xxbk_open ol li");

    tran_list.each(function(index){
        var word=jQuery("div span.wrap_vo",this).text();
        if(word&&word_map[word]) {
            word_cards_tmp[word_map[word]] = jQuery(this).html();
        }
    });
    var word_cards=[];
    for(var key in word_cards_tmp){
        word_cards.push(word_cards_tmp[key]);
    }

    console.dir(word_cards);
    this.word_cards=word_cards;
    this.card_index=0;
};
WordCard_Win.prototype.card_itor=function(step){
    var ctwin=this.getclientwin();
    this.card_index+=step;
    if(this.card_index<0){this.card_index=0;}
    if(this.card_index>=this.word_cards.length){this.card_index=this.word_cards.length-1;}
    var word_c= this.word_cards[this.card_index];
    var div_wrap='<div class="wc_wordcard_wp">{0}</div>'.format(word_c);
    ctwin.find(".wc_wordcard").html(div_wrap);
    mxyd_voice_onclick(".wrap_vo",ctwin[0]);
    ctwin.find(".wrap_vo").click();
    return word_c;
};

function Make_wordcard_win(){

    var params = PTwindow.Extract_ptparams(jQuery(this));
    var ptwin=PTwindow.Factory(WordCard_Win, params);

    ptwin.show();

}

// <<<<<<<<<<<<<<----------------------------------------------------

//-----------------------------------test win -----------------------
function XXtest_Win(top,left,width,height){
    var rt_win=[
        {type:"area",nclass:"ck_test_input",height:"48%",width:"100%"},
        {type:"button",nclass:"ckbt_test",value:"test",float:"right"},
        {type:"area",nclass:"ck_test_out",height:"48%",width:"100%"}
    ];
    MulEditwindow.call(this,"pt_test_win",rt_win,top,left,width,height);
}
XXtest_Win.prototype=Object.create(MulEditwindow.prototype) ;


XXtest_Win.prototype.createwin=function(winid) {
    MulEditwindow.prototype.createwin.call(this, winid);
    var ctwin = this.getclientwin();
    var call_ob = this;
    call_ob.heightlight(".ckbt_test");
    ctwin.find(".ckbt_test").click(function(){

        var wordtxt =ctwin.find(".ck_test_input").val();
        var word_arr = extract_allwords(wordtxt);
        call_ob.ajax_get_defs(word_arr,"MORE",function(def_txt){
            console.log(def_txt);
            console.dir(ctwin);
            ctwin.find(".ck_test_out").val(def_txt);
        });
    });
};

function Make_XXtest_Win(){
    var winid = jQuery(this).attr("id");
    if(ptw_list[winid]==null){
        var top = jQuery(this).attr("arg1");
        var left = jQuery(this).attr("arg2");
        var width = jQuery(this).attr("arg3");
        var height = jQuery(this).attr("arg4");
        var ptwin =new XXtest_Win(top,left,width,height);
        ptwin.createwin(winid);
        ptw_list[winid]=ptwin;
    }
    ptw_list[winid].show();
    ptw_list[winid].getwin().draggable();
    console.log("ptw_list[winid].draggable()");
}


// ----------- list windows --------------


function make_list( learn_list,backns,ptwinid ){
    var ckname="ck_"+ptwinid;
    var mystr="";
    mystr+='<ul><li><span class="back_ns show_learnlist" ns="{0}" winid="{1}">Back</span></li>'.format(backns,ptwinid);

    if(learn_list['ns']){
        for(var ns in learn_list['ns']){
            var ckid="ckn_"+ns.replace(/:/g,"_");
            mystr+='<li class="bl_fold"><input type="checkbox" name="{1}" value="{2}" id="{3}" />\
            <label  class="lb_ns" for="{3}">{4}</label><span class="sp_fold show_learnlist" ns="{2}" winid="{0}"> </span></li>'.format(ptwinid,ckname,ns,ckid,ns);
        }
    }
    mystr+='<div style="clear: both"></div>';
    if(learn_list['files']){
        for(var i=0;i<learn_list['files'].length;i++){
            var filename = learn_list['files'][i];
            var ckid="ckf_"+filename.replace(/:/g,"_");
            mystr+='<li><input id="{2}" type="checkbox" name="{0}" value="{1}" /><label for="{2}">{3}</label></li>'.format(ckname,filename,ckid,filename);
        }
    }
    mystr+="</ul>";
    mystr+='<div style="clear: both"></div>';
    return mystr;
}

function show_learnlist(arg_ns){
    var nowns=jQuery(this).attr("ns");
    if(nowns==null){
        nowns=arg_ns;
    }
    var nslist= nowns.substr(0,nowns.length-1).split(":");
    var winid = jQuery(this).attr("winid");
    var ptwin =ptw_list[winid];
    var learn_list = ptwin.learn_list;
    var cur_ns = nslist[0]+":";
    for(var i=1;i<nslist.length;i++){
        cur_ns+=nslist[i]+":";
        learn_list=learn_list["ns"][cur_ns];
    }
    var outwin = ptwin.getclientwin().children(".learnlist");

    var ptwinid = winid;
    var backns="";
    for(var b=0;b<nslist.length-1;b++){
        backns+=nslist[b]+":";
    }

    var mystr = make_list(learn_list,backns,ptwinid);

    outwin.html(mystr);
    outwin.find(".show_learnlist").click(show_learnlist);
}


function handle_list(mdata){
    var learn_txt =mdata.content;
    var learn_list =JSON.parse(learn_txt);
    var ptwin =ptw_list[mdata.reflect];

    ptwin.learn_list = learn_list;
    var outwin = ptwin.getclientwin().children(".learnlist");
    var ptwinid = mdata.reflect;

    var mystr = make_list(learn_list,"learn:",ptwinid);
    outwin.html(mystr);
    outwin.find(".show_learnlist").click(show_learnlist);
}

function Listwindow(param_obj){
    PTwindow.call(this,param_obj);

    var winid=param_obj.winid;
    var learnlist=jQuery( '<div class="learnlist"> </div>');

//    var learndir = jQuery('<input type="text" name="learndir">');
    var btckall = jQuery('<input name="ckall" class="button" type="button" value="ClickAll">');
    var btunckall = jQuery('<input name="unckall" class="button" type="button" value="UnClickAll">');

    btckall.click(function(){
        jQuery(this).parent().find('input[type="checkbox"]').prop("checked",true);
    });
    btunckall.click(function(){
        jQuery(this).parent().find('input[type="checkbox"]').prop("checked",false);
    });
//    var user_filter_sel = jQuery('<select name="user_filter_sel"><option value="user_wordlist">uwords</option></select>');

    this.getclientwin().append(learnlist);
//    this.getclientwin().append(learndir);
    this.getclientwin().append(btckall);
    this.getclientwin().append(btunckall);
//    this.getclientwin().append(user_filter_sel);

    var mdata=new Object();
    mdata['call']="ajaxpeon";
    var url = DOKU_BASE + 'lib/exe/ajax.php';
    mdata['target']="learnlist";
    mdata['reflect']=winid;
    jQuery.ajax({url:url,data:mdata,success:handle_list,dataType:"jsonp",crossDomain:true});
}
Listwindow.prototype=Object.create( PTwindow.prototype);


function addfilter_aj(mdata){
    var ptwin =PTwindow.GetObj[mdata.reflect];
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

var USER_WORDLIST_NAME ;

function add_userfilter_aj(mdata){
    var ptwin =PTwindow.GetObj[mdata.reflect];
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


Listwindow.prototype.getSublearnlist =function(sublearnlist,out_arr){
    if(sublearnlist["ns"] ){
        for(var subns in sublearnlist['ns']){
            this.getAllSublearnlist(sublearnlist['ns'][subns],out_arr);
        }
    }
    if(sublearnlist["files"]){
        for(var i=0;i<sublearnlist['files'].length;i++) {
            out_arr.push(sublearnlist['files'][i]);
        }
    }
};

Listwindow.prototype.getsubNslearnlist =function(ns,out_arr){

    var nslist= ns.substr(0,ns.length-1).split(":");
    var learn_list = this.learn_list;
    var cur_ns = nslist[0]+":";
    for(var i=1;i<nslist.length;i++){
        cur_ns+=nslist[i]+":";
        learn_list=learn_list["ns"][cur_ns];
    }
    this.getSublearnlist(learn_list,out_arr);
};

Listwindow.prototype.getselect_learn = function(){
    var checkboxes = this.getclientwin().children(".learnlist").find('input[type="checkbox"]');
    var flat_learn_list=new Array();
    var ptwin = this;
    checkboxes.each(function(){
        if(jQuery(this).prop("checked")==true){
            var learnname = jQuery(this).val();
            if(learnname.charAt(learnname.length-1)==":" ){ // ns
                ptwin.getsubNslearnlist(learnname,flat_learn_list);
            }else{
                flat_learn_list.push(learnname);
            }
        }
    });
    return flat_learn_list;
};




function parse_learn_aj(mdata){
    var ptwin =PTwindow.GetObj[mdata.reflect];
    var pg_wordlist = mdata.content.toLowerCase().split(/[^\w\-_]+/);
    pg_wordlist.sort();
    if(ptwin.parse_count<2){
        ptwin.pb_pre_wordss=pg_wordlist;
    }else{
        var tmplist=ptwin.parse_learn_fuc(ptwin.pb_pre_wordss,pg_wordlist);
        ptwin.parse_logstr+="{0}({1},{2})->".format(tmplist.length,ptwin.pb_pre_wordss.length,pg_wordlist.length);
        ptwin.parse_str =tmplist.join(" ,  ")+"<br/><br/>" +ptwin.parse_str;
        ptwin.parse_output.html(ptwin.parse_logstr+"<br/><br/>"+ptwin.parse_str );
        ptwin.pb_pre_wordss =tmplist;
    }

    if(ptwin.parse_count<ptwin.parse_learn_list.length){
        var mdata=new Object();
        mdata['pageid']=ptwin.parse_learn_list[ptwin.parse_count];
        mdata['call']="ajaxpeon";
        var url = DOKU_BASE + 'lib/exe/ajax.php';
        mdata['target']="rawpage";
        mdata['rev']='ori';
        mdata['reflect']=ptwin.getwinid();
        jQuery.ajax({url:url,data:mdata,success:parse_learn_aj,dataType:"jsonp",crossDomain:true});
    }
    ptwin.parse_count+=1;
}

function parse_learn(event){
    var ptwin = event.data.ptwin;
    var parse_learn_list = ptwin.getselect_learn();
    var parse_fuc = ptwin.getclientwin().find('select[name="logic_sel"]').val();
    var parse_learn_fuc=null;
    switch(parse_fuc){
        case "wIntersection_w":
            parse_learn_fuc=wIntersection_w;
            break;
        case "wComplement_w":
            parse_learn_fuc=wComplement_w;
            break;
        case "wUnion_w":
            parse_learn_fuc=wUnion_w;
            break;
    }
    ptwin.parse_learn_fuc = parse_learn_fuc;
    ptwin.parse_learn_list=parse_learn_list;
    ptwin.parse_count =0;
    ptwin.pb_pre_wordss=null;
    ptwin.parse_str="";
    ptwin.parse_logstr="";
    if(parse_learn_list.length<2){
        return;
    }else{
        var buttonid= jQuery(this).attr("id");
        if(PTwindow.GetObj[buttonid]==null){
            var swin =new PTwindow("ptparse","2%","2%","90%","80%");
            PTwindow.GetObj[buttonid]=swin;
            swin.createwin(buttonid);
            ptwin.parse_output = PTwindow.GetObj[buttonid].getclientwin();
        }
        ptwin.parse_output.html("receiving learn data ...");
        PTwindow.GetObj[buttonid].show();
        var mdata=new Object();
        mdata['pageid']=parse_learn_list[ptwin.parse_count];
        mdata['call']="ajaxpeon";
        var url = DOKU_BASE + 'lib/exe/ajax.php';
        mdata['target']="rawpage";
        mdata['rev']='ori';
        mdata['reflect']=ptwin.getwinid();
        jQuery.ajax({url:url,data:mdata,success:parse_learn_aj,dataType:"jsonp",crossDomain:true});
        ptwin.parse_count+=1;
    }
}

function parse_learn_win(){

    var winid = jQuery(this).attr("id");
    var ptwin=PTwindow.GetObj(winid);
    if(!ptwin){
        var params = PTwindow.Extract_ptparams(jQuery(this));
        params.subclass="parse_learn";
        ptwin=PTwindow.Factory(Listwindow,params);

        var logic_sel = jQuery('<select name="logic_sel"><option value="wIntersection_w">Intersection</option><option value="wComplement_w">Complement</option>\
    <option value="wUnion_w">Union</option></select>');

        var parse_bt = jQuery('<input name="parse_bt" id="parse_{0}" class="button" type="button" value="Parse">'.format(winid));
        parse_bt.click({"ptwin":ptwin},parse_learn);
//        ptwin.addfilter();
//        ptwin.adduser_filter();
        ptwin.getclientwin().append(logic_sel);
        ptwin.getclientwin().append(parse_bt);
    }
    ptwin.show();

}


function search_learn_aj(mdata){
    var ptwin =PTwindow.GetObj[mdata.reflect];
    var page_wordlists = mdata.content;
    var mystr="";
    var filter = ptwin.user_filter;

    for(var learnname in page_wordlists){
        var wordarray = page_wordlists[learnname].split(",");
        var match_list = wIntersection_w(wordarray,filter);
        var unmatch_list = wComplement_w(wordarray,match_list);
        var match_rate = (match_list.length/wordarray.length)*100;
        var tmphh = match_rate.toString().split(".");
        var match_rate_str = tmphh[0];
        if(tmphh[1]!=null) {
            match_rate_str += "." + tmphh[1].substring(0, 2);
        }
        mystr+='<div class="match_rt" rate="{0}"><a href="{1}" target="_blank">{2}</a><span> , match rate:{0}% ({3}/{4}),</span><span class="match_show_dl">more detail...</span><br/>\
        <span class="mt_more_words">Unmatch list:[ {5} ]</span><br/><span class="mt_more_words">Match list : [ {6}]</span> </div>'.format(match_rate_str,DOKU_BASE+learnname,learnname,match_list.length,wordarray.length,unmatch_list.join(","),match_list.join(","));
    }
    ptwin.output.html(mystr);
    ptwin.output.find(".match_show_dl").click(function(){
        jQuery(this).siblings(".mt_more_words").toggle();
    });
}

function search_learn(event){
    var ptwin = event.data.ptwin;
    var sl_learn_list = ptwin.getselect_learn();
    var parse_fuc = ptwin.getclientwin().find('select[name="logic_sel"]').val();
    if(sl_learn_list.length>0){
        var buttonid= jQuery(this).attr("id");
        var swin=PTwindow.GetObj(buttonid);
        if(!swin){
            swin=PTwindow.Factory(PTwindow,{winid:buttonid,subclass:"ptsearch",top:"2%",left:"2%",width:"90%",height:"80%"});
            ptwin.output=swin.getclientwin();
        }

        ptwin.output.html("receiving learn data ...");
        swin.show();

        var mdata=new Object();
        mdata['call']="ajaxpeon";
        var url = DOKU_BASE + 'lib/exe/ajax.php';
        mdata['target']="page_wordlists";
        mdata['pglist']=JSON.stringify(sl_learn_list);
        mdata['reflect']=ptwin.getwinid();
        jQuery.ajax({url:url,data:mdata,success:search_learn_aj,dataType:"jsonp",crossDomain:true});
    }
}

function search_learn_win(){
    var winid = jQuery(this).attr("id");
    var ptwin=PTwindow.GetObj(winid);
    if(!ptwin){
        var params = PTwindow.Extract_ptparams(jQuery(this));
        params.subclass="search_learn";
        ptwin=PTwindow.Factory(Listwindow,params);

        var search_bt = jQuery('<input name="search_bt" id="search_{0}" class="button" type="button" value="Search">'.format(winid));
        search_bt.click({"ptwin":ptwin},search_learn);
//        ptwin.addfilter();
        ptwin.adduser_filter();
        ptwin.getclientwin().append(search_bt);
    }

    ptwin.show();
}

// <<<<<<<<<<--------------------open_page ---------

function open_page_worker(data){
    console.dir(data);
    var buttonid = data.reflect;
    var ptwin =PTwindow.GetObj(buttonid);

    ptwin.show();
    if (data.content.length<3){ptwin.getclientwin().html("Missing word . . .");
    }else{
        ptwin.getclientwin().html(data.content);
    }
}

function open_page_win(){

    var params= PTwindow.Extract_ptparams(jQuery(this));
    console.dir(params);
    if(params.pageid==null){
        return;
    }

    var ptwin=PTwindow.GetObj(params.winid);
    if(!ptwin){
        params.subclass="ptopen";
        ptwin=PTwindow.Factory(PTwindow,params);
    }


    var mdata=new Object();
    mdata['pageid']=params.pageid;
    mdata['call']="ajaxpeon";
    var url = DOKU_BASE + 'lib/exe/ajax.php';
    mdata['target']="page";
    mdata['reflect']=params.winid;
    jQuery.ajax({url:url,data:mdata,success:open_page_worker,dataType:"jsonp",crossDomain:true});
}




// ------------------edit wordlist -----------

function addto_w_rt(mdata){
    var ptwin =ptw_list[mdata.reflect];
    var rttxt = mdata.content;
    ptwin.get_edit_static().html(rttxt);
}


function addto_wordlist(event){
    var ptwin = event.data.ptwin;
    var send_txt = ptwin.get_edit_area().val();

    var mdata=new Object();
    mdata['call']="ajaxpeon";
    var url = DOKU_BASE + 'lib/exe/ajax.php';
    mdata['target']="writeraw";
    mdata['sub']="wordlist";
    mdata['txt']=send_txt;
    mdata['pageid']=JSINFO['userwords_ns']+JSINFO['user']+":"+ptwin.dst_page;
    mdata['reflect']=ptwin.getwinid();
    jQuery.ajax({url:url,data:mdata,success:addto_w_rt,dataType:"jsonp",crossDomain:true});
}


function addnewwords_win(){
    var winid = jQuery(this).attr("id");
    if(ptw_list[winid]==null){
        var top = jQuery(this).attr("arg2");
        var left = jQuery(this).attr("arg3");
        var width = jQuery(this).attr("arg4");
        var height = jQuery(this).attr("arg5");
        var ptwin =new Editwindow("addwords",top,left,width,height);
        ptwin.createwin(winid);
        ptwin.dst_page = jQuery(this).attr("arg1");
        ptw_list[winid]=ptwin;

        var addw_bt = jQuery('<input name="add_wd" id="add_wd_{0}" class="button" type="button" value="Add">'.format(winid));
        addw_bt.click({"ptwin":ptwin},addto_wordlist);
        ptwin.getclientwin().append(addw_bt);
    }
    ptw_list[winid].show();
}
//  <<<<----------------edit wordlist------------------

//----------------pg_convert_wordls------
var wls_ori_words_list =null;
var wls_filter_set=null;

function addto_txt_rt(mdata){
//    alert(mdata.content);
    filt_page_wordls();
}

function addto_wordlist_txt(words_txt){
    var mdata=new Object();
    mdata['call']="ajaxpeon";
    var url = DOKU_BASE + 'lib/exe/ajax.php';
    mdata['target']="writeraw";
    mdata['sub']="wordlist";
    mdata['txt']=words_txt;
    mdata['pageid']=USER_WORDLIST_NAME;
    jQuery.ajax({url:url,data:mdata,success:addto_txt_rt,dataType:"jsonp",crossDomain:true});
}

function add_newwords(event){
    var wlsdiv = event.data.wlsdiv;
    var add_list=new Array();
    wlsdiv.find('input.wl_unm').each(function(i,v){
        if( jQuery(this).prop("checked")==true ){
            add_list.push(jQuery(this).val());
        }
    });
//    alert(add_list.join(","));
    addto_wordlist_txt(add_list.join(","));
}

function pg_convert_wordls(mdata){
    var wordls_txt =mdata.content;
    if(wordls_txt.length<10){
        return;
    }
    var wlsdiv = jQuery(".wordlist");
    if(wlsdiv.length<1){
        alert("no wordlist");
        return;
    }
    var wlist="";
    if(wls_ori_words_list==null){
        var wlist =wlsdiv.text().split(",");
        wls_ori_words_list = wlist;
    }else{
        wlist = wls_ori_words_list;
    }
    var filter_list =wordls_txt.split(",");
    var filter_set=make_map_w(filter_list);

    var outstr = "";

    for(var i=0;i<wlist.length;i++){
        if(filter_set[wlist[i]]==null) {
            outstr += '<input class="wl_unm" id="{0}" type="checkbox" name="{1}" value="{2}" /><label class="wl_unm" for="{0}">{2},</label>'.format('wl' + wlist[i], 'wlck', wlist[i]);
        }else{
            outstr+='<span class="wl_match">{0},</span>'.format(wlist[i]);
        }
    }
    outstr+='<input name="wl_addwords" class="button" type="button" value="Add to word list">';
    wlsdiv.html(outstr);
    wlsdiv.children("input[name='wl_addwords']").click({"wlsdiv":wlsdiv},add_newwords);

}

function filt_page_wordls(){

    var mdata=new Object();
    mdata['pageid']=USER_WORDLIST_NAME;
    mdata['call']="ajaxpeon";
    var url = DOKU_BASE + 'lib/exe/ajax.php';
    mdata['target']="rawpage";
    jQuery.ajax({url:url,data:mdata,success:pg_convert_wordls,dataType:"jsonp",crossDomain:true});
}
// <<<<<-----pg_convert_wordls------------

function pg_show_wordlist(context){
    jQuery(" .pg_show_wl",context).click(function(){
        jQuery(".wordlist").toggle();
    });
    jQuery(" #pg_filt_wl",context).click(filt_page_wordls);
}

function Two_edit_win(){


    var buttonid= jQuery(this).attr("id");
    if(ptw_list[buttonid]==null){
        var top = jQuery(this).attr("arg1");
        var left = jQuery(this).attr("arg2");
        var width = jQuery(this).attr("arg3");
        var height = jQuery(this).attr("arg4");

        var swin =new MulEditwindow("twoedit","1 2 3",top,left,width,height);
        ptw_list[buttonid]=swin;
        swin.createwin(buttonid);
    }
    ptw_list[buttonid].show();
}
// <<<<<<<<<<<<---------------just wrap div- ------------------------
// <<<<<<<<<<<<---------------just wrap div- ----------------------
// <<<<<<<<<<<<---------------just wrap div- ----------------------



// ===================================

// <<<<<<<<<<<<---------------translation- block------------------------
// <<<<<<<<<<<<---------------translation- block-----------------------
// <<<<<<<<<<<<---------------translation- block-----------------------
// <<<<<<<<<<<<---------------translation- block-----------------------



//<<<<<<<<<<<<<<---------------------xxbk_base-------------------------
// BK is inplace ui ,show content inplace
// {subclass:"",dom_me:""}
function XXBK_base_ui(params_obj){

    this.subclass=params_obj.subclass;
    this.jdom_me=jQuery(params_obj.dom_me);
    this.create_ui(params_obj);
}

XXBK_base_ui.Extract_bkparams=function(jwin){

    var arg_txt=jwin.attr("xx_arg");
    var arg_list=arg_txt.split(";");
    var out_params={};
    for(var i=0;i<arg_list.length;i++){
        var sub_arg=arg_list[i].split("=");
        if(sub_arg.length>=2){
            out_params[sub_arg[0].trim()]=sub_arg[1];
        }else{
            out_params["BAD"]=arg_list[i];
        }
    }
    out_params.command=jwin.attr("command");
    return out_params;
};

XXBK_base_ui.xxbk_list={};
//{dom_me:""}
XXBK_base_ui.Factory_byMe=function(ui_type,params_obj){
    var j_me = jQuery(params_obj.dom_me);
    var winid=j_me.attr("id");
    if(j_me.attr("init")!="n"){
        return XXBK_base_ui.xxbk_list[winid];
    }

    j_me.attr("init","y");
    if(!XXBK_base_ui.GetObj(winid)){
        var params = XXBK_base_ui.Extract_bkparams(j_me);
        console.dir(params);
        params.dom_me=params_obj.dom_me;
        XXBK_base_ui.xxbk_list[winid]=new ui_type(params);
    }
    return XXBK_base_ui.xxbk_list[winid];
};
XXBK_base_ui.GetObj=function(winid){
    return XXBK_base_ui.xxbk_list[winid];
};

// javascript can use
XXBK_base_ui.prototype.create_ui=function(params_obj){
    var jdom_me=this.jdom_me;
    var winid=jdom_me.attr("id");
    var ori_txt = jdom_me.html();

    var base_ui_txt='<span class="xxbk_base_title xxbk_tt_{0}" id="tt_{1}" >{2}</span> \
    <div class="xxbk_base_ct xxbk_ct_{0}" style="display: none" init="n"></div>\
    '.format(params_obj.command,winid,ori_txt);
    this.base_ui=jQuery(base_ui_txt);

    jdom_me.html("");
    jdom_me.append(this.base_ui);

    var call_ob=this;
    this.jdom_me.find("span.xxbk_base_title").click(function(){
        console.log("span.xxbk_base_title click");
        var ct_div=call_ob.jdom_me.find("div.xxbk_base_ct");
        if(ct_div.length==0){
            call_ob.jdom_me.html("xxbk_base_ui was broken!please check the page!");
            return;
        }
        if(ct_div.attr("init")=='n') {
            call_ob.init_ct_div(ct_div,params_obj);
            ct_div.attr("init",'y');
        }
        ct_div.toggle();
    });

};

XXBK_base_ui.prototype.init_ct_div=function(ct_div_j){
    ct_div_j.html("how are you");
};

XXBK_base_ui.prototype.getTitle=function(){
  return this.jdom_me.find(".xxbk_base_title").eq(0);
};

XXBK_base_ui.prototype.getCTdiv=function(){
    return this.jdom_me.find(".xxbk_base_ct").eq(0);
};



// <<<<<<<<<<<<---------------syntax- block------------------------
// <<<<<<<<<<<<---------------syntax- block------------------------
// <<<<<<<<<<<<---------------syntax- block------------------------
// <<<<<<<<<<<<---------------syntax- block------------------------


function XXBK_slice(params_obj){
    XXBK_base_ui.call(this,params_obj);
    var jtitle=this.getTitle();
    var newtt = "{0} ~ {1} | {2}".format(params_obj.from,params_obj.to,jtitle.html());
    jtitle.html(newtt);
}
XXBK_slice.prototype=Object.create( XXBK_base_ui.prototype);
XXBK_slice.prototype.init_ct_div= function(ct_div_j,params_obj){
    var jq_wordlist=jQuery(".wordlist");
    if(jq_wordlist.length>0) {
        var wd_txt = jq_wordlist.text();
        var s_from = params_obj.from;
        var s_to = params_obj.to;
        var tmp="\\b{0}\\b.+\\b{1}\\b".format(s_from, s_to);

        var reg_sr = new RegExp(tmp);
        var rt = wd_txt.match(reg_sr);
        if (rt) {
            ct_div_j.html(rt[0]);
        }else{
            ct_div_j.html("!!! Maybe The slice words was deleted from the wordlist,please choose another word to slice");
        }
    }
};



// <<<<<<<<<<<<<<-----------------cp sidebar -------------------
function xxbk_cp_sidebar(element){
    jQuery(element).click(function(element){
        ajax_xcall("tp.tpage",["sidebar"],function(data){
           console.dir(data);
            var dst_page=data.result;
            window.location="/{0}?do=edit".format(dst_page);
        });
    });
}

//<<<<<<<<<<<<<<<<<<<-----------xxbk_open------------------------

function XXBK_open(params_obj){
    XXBK_base_ui.call(this,params_obj);
}
XXBK_open.prototype=Object.create( XXBK_base_ui.prototype);
XXBK_open.prototype.init_ct_div=function(ct_div_j,params_obj){
    XXBK_base_ui.prototype.init_ct_div.call(this,ct_div_j);
    ct_div_j.html(ct_div_j.html()+" <br/> i am XXBK_open");

    var pageid=params_obj.page;
    var call_ob=this;

    ajax_xcall("wiki.getPageHTML",[pageid],function(data){
        ct_div_j.html(data.result);
        var js_div=ct_div_j[0];
     //   init_ui("#{0} ".format(call_ob.parant_j.attr("id")));
        init_ui(js_div);
        init_mxyd_voice(".wrap_vo","y");
    });
};


//<<<<<<<<<<<<<<<<<<<<<<
function syntax_BK_init(context) {
    var sel_txt = parent+".xxbk";
    jQuery(".xxbk",context).each(function (index, element) {
    //element == this
    //    var class_txt = jQuery(this).attr("class");
    //    var ctype = class_txt.match(/\bxxbk_[\w]+\b/);
        var command = jQuery(this).attr("command");

        if(command){
            switch (command){
                case "slice":
                    XXBK_base_ui.Factory_byMe(XXBK_slice,{dom_me:element});
                    break;
                case "sidebar":
                    XXBK_base_ui.Factory_byMe(xxbk_cp_sidebar,{dom_me:element});
                    break;
                case "open":
                    XXBK_base_ui.Factory_byMe(XXBK_open,{dom_me:element});
                    break;
            }
        }
    });
}

//<<<<<<<<<<<<<<<<<<<< ------ things execute in php!!----------
function init_pagetools(){
    var jwin=jQuery(".pt_pa_sub");
    jwin.appendTo("body");
    var theul=jwin.find("ul").eq(0);
    theul.find("li").each(function(){
        var subdiv=jQuery(this).children("div");
        var subhm =subdiv.html();
        subdiv.remove();
        jQuery(this).html(subhm+jQuery(this).html());
    });
    theul.menu();
    var anck = jQuery(".pt_pagetools");
    var oset= anck.offset();
    oset.left+=anck.offsetParent().width()+10;
    jwin.offset(oset);


    jQuery(".pt_pagetools").click(function(event){
        event.preventDefault();
        event.stopPropagation();
        jQuery(".pt_pa_sub").toggle();
        jQuery(this).blur();
    });
}



function init_ui(context){
    /*
    var divstr='<div id="{0}_rt"><div id="{0}_txtout"></div> <div style="clear: both"></div>\
     <input id="{0}_ok" name="ok" class="button" type="button" value="ok">\
        <input id="{0}_cancel" class="button" type="button" value="cancel"> </div> '.format("openpage");
        */

//    alert(jQuery("html").hasClass("phone"));

    USER_WORDLIST_NAME = 'user:'+JSINFO['user']+":wordlist";
    WORDLIST_NAME=JSINFO['wordlist_ns']+"wordlist";

    console.log(parent+" .xxpg_learn");
    ptlog=new PTlog();

    init_pagetools();
    syntax_BK_init(context);
    pg_show_wordlist(context);
    Init_english_edit_tool();
    jQuery(" .xxpg_learn",context).click(search_learn_win);
    jQuery(" .xxpg_parse",context).click(parse_learn_win);
    jQuery(" .xxpg_open",context).click(open_page_win);
    jQuery(" .xxpg_words",context).click(addnewwords_win);
    jQuery(" .xxpg_twoedit",context).click(Two_edit_win);
    jQuery(" .xxpg_checkwords",context).click(Make_Checkwords_Win);
    jQuery(" .xxpg_test",context).click(Make_XXtest_Win);
    jQuery(" .xxpg_card",context).click(Make_wordcard_win);
    ptlog.log("hello");

}

jQuery(function(){

    // jQuery methods go here...
    init_ui();
});
