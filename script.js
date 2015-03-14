/**
 * Created by iamchenxin on 2015/3/14.
 */
function xxeditpsbt_add(){

    var $sizect = jQuery('#size__ctl');
    var sizect=$sizect[0];
    if(!sizect)return;

    var mdiv =jQuery("<div id='pagestat_edit'></div>");

    var bt=jQuery("<input name='anal' class='button' type='button' value='anal'>");

    bt.click(ajax_get_words);
    mdiv.append(bt);

    jQuery("#size__ctl").after(mdiv);

    var rtdiv = jQuery('<div id="pagestat_rt"><div id="pagestat_txtout"></div> <input id="pagestat_ok" name="ok" class="button" type="button" value="ok"> </div> ');

    jQuery("body").append(rtdiv);
    jQuery("#pagestat_ok").click(function(){
        jQuery("#pagestat_rt").slideUp(1000);
//        jQuery("#pagestat_rt").css("display","none");
    });

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
    var wd_filter = JSON.parse(wordlisttxt);

    var outstr = "wd_filter = " +wd_filter.length ;
    outstr+="<br/>";
    jQuery("#pagestat_txtout").html(outstr);

    var text = jQuery("#wiki__text").val();
    var txlist= text.split(/[^\w\-_]+/);
    txlist.sort();


    var i=1;
    var count=1;
    var tx_countset={};
    // order and count every word
    for(;i<txlist.length;i++){
        if(txlist[i]!=txlist[i-1]){
            tx_countset[txlist[i-1]]=count;
            count=1;
        }else{
            count+=1;
        }
    }
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

    var outlist=[];
    for (x in tx_countset){
        outlist[outlist.length]=x;
    }




    outstr += "outlist = " +outlist.length ;
    outstr+="<br/>";
    outstr += JSON.stringify(outlist,null,"\t")+"<br/>";

    jQuery("#pagestat_txtout").html(outstr);
}

jQuery(xxeditpsbt_add);