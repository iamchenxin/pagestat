/**
 * Created by iamchenxin on 2015/3/14.
 */
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
        if(tx_countset[wd_filter[k]] != "undefined" ){
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
    var outstr="<WORDLIST>"+anal_list.length+",";
    for (var x in anal_list){
        outstr+=anal_list[x].trim()+", ";
    }
    outstr+="</WORDLIST>\n\n";
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

jQuery(xxeditpsbt_add);