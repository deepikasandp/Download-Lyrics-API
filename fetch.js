"use strict"; 
//https://api.lyrics.ovh/v1/artist/title
var url = 'https://api.lyrics.ovh/v1/';
var title;
var artist;
const init ={
    headers:{        
        'Content-Type': 'application/json',
    }
} 

function getData(response) {
    return response.json();
}

function onSuccess(data) {
    console.log(data);
    if(data.lyrics == ""){  
        $('#card').css("display", "block");
        $('#lyrics').text("No lyrics found, please try again");
        $('#lyrics').css("color", "red");
        $('#test_form #title').val("");
        $('#test_form #artist').val("");
    }
    else{
        let title_case = title.toUpperCase();
        let artist_case = artist.toUpperCase();
        $('#test_form').css("display", "none");
        $('#card').css("display", "block");
        $("#cardTitle").text(title_case);
        $("#cardTitle").css("text-decoration", "underline");
        $("#subTitle").text(artist_case);
        $("#subTitle").css("text-decoration", "underline");        
        $("#lyrics").css("font-weight", "bold");
        //data.lyrics.replace(/(?:\r\n|\r|\n)/g, '<br>');
        var lyrics = data.lyrics.split("\n").join("<br />");
        for(var i in lyrics){
            if(lyrics[i] == "<br />"){                
                $("#lyrics").html("<br/>");
            }
            $("#lyrics").html(lyrics);
        }
    }
}

function onFail(status) {
    console.log(status);    
    $('#card').css("display", "block");
    $("#cardTitle").text(title);
    $("#subTitle").text(artist);
    $('#lyrics').text("Invalid Input, Please try again");
    $('#lyrics').css("color", "red");
    $('#test_form #title').val("");
    $('#test_form #artist').val("");
}

function validateResponse(response){
    if(!response.ok){
        throw new Error(`${response.status} : ${response.statusText}`);
    }
    return response;
}

function get(url, success, fail, init) {
    fetch(url, init)
    .then((response) => validateResponse(response))    
    .then((response)=>getData(response))    
    .then((data)=>success(data))
    .catch((status)=>fail(status))
};

function prepareQueryParams(artist, title){
    let query;    
    query = encodeURIComponent(artist);  
    query += "/"; 
    query += encodeURIComponent(title);   
    return query;
}

const checkCompletionAndGet = function(form)
{
    artist =  form["artist"].value;
    title =  form["title"].value;
    if(artist != "" && title != ""){
        let endpoint = url;
        endpoint += prepareQueryParams(artist, title);        
        console.log(endpoint);
        get(endpoint ,onSuccess, onFail, form);
    }
    return false;
}

const clearInput = function(){        
    $('#test_form #title').val(""); 
    $('#test_form #artist').val("");    
    $('#lyrics').html("");
    artist = "";
    title = "";
}

const showForm = function(){       
    $('#test_form').css("display", "block"); 
    $('#test_form #title').val(""); 
    $('#test_form #artist').val("");    
    $('#lyrics').html("");
    title = "";
    title = "";   
    $('#card').css("display", "none"); 
}

function downloadLyrics() {
    var el = $("#lyrics").html();
    var str = el.split("<br>").join("\n");
    var fileName =  title+"_"+artist+'.txt';
    var mimeType = 'text/html';
    var link = document.createElement('a');
    mimeType = mimeType;
    link.setAttribute('download', fileName);
    link.setAttribute('href', 'data:' + mimeType  +  ';charset=utf-8,' + encodeURIComponent(str));
    link.click(); 
}

$("document").ready(function(){
    $('#downloadLink').click(downloadLyrics);
})