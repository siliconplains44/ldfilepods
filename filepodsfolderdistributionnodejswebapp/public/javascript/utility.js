/**
 * Created by Allan on 1/27/2015.
 */

function loadjscssfile(filename, filetype, cb){
    if (filetype=="js"){ //if filename is a external JavaScript file
        var fileref=document.createElement('script');
        fileref.setAttribute("type","text/javascript");
        fileref.setAttribute("src", filename);
    }
    else if (filetype=="css"){ //if filename is an external CSS file
        var fileref=document.createElement("link");
        fileref.setAttribute("rel", "stylesheet");
        fileref.setAttribute("type", "text/css");
        fileref.setAttribute("href", filename);
    }
    if (typeof fileref!="undefined") {

        fileref.onreadystatechange = fileref.onload = function() {
            var state = fileref.readyState;
            if (!cb.done && (!state || /loaded|complete/.test(state))) {
                cb.done = true;
                cb();
            }
        };

        document.getElementsByTagName("head")[0].appendChild(fileref);
    }
};

var filevaultApi = 'https://datavaultapi.leoparddata.com:50000';
var securityApi = "https://securityapi.leoparddata.com:50008";
var filePodsApi = "https://filepodsapi.leoparddata.com:50002";
var fileMirrorApi = "https://filemirrorapi.leoparddata.com:50018";
var fileShareApi = "https://isfileshareapi.leoparddata.com:50001";
var fileLockApi = "https://encryptionv1api.leoparddata.com:50014";
var textMessageSenderApi = "https://textmessagesenderapi.leoparddata.com:50011";
var emailSenderApi = "https://emailsenderapi.leoparddata.com:50010";

var fileLock = 1;
var fileShare = 2;
var fileVault = 3;
var filePods = 4;
var fileMirror = 5;

var postAjaj = function(protocol, objectToSend, cb) {

    $.ajax({
        type: "POST",
        url: protocol,
        data: JSON.stringify(objectToSend),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        timeout: 500000,
        success: function(data){
            cb(data)
        },
        failure: function(errMsg) {
            alert(errMsg);
        }
    });
};

function validateEmail(email) {
    var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    return re.test(email);
};

