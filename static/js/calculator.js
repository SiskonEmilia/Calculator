var isNew = false, isEnd = false;
var OL_Action_Root = "http://127.0.0.1:8888";

function Req_ajax()
{            
    $.ajax({
            data: {
                info: document.getElementById('operations').innerHTML,
                type: "post"
            },
            url: OL_Action_Root+"/req_cal",
            dataType: 'json',
            cache: false,
            timeout: 5000,
            type: "post",    // 如果要使用GET方式，则将此处改为'get'
            success: function(data){
                var res = data;
                if(res[0] == 'success')
                {
                    document.getElementById('number').innerHTML =  res[1];
                }
                else if(res[0] == 'NaN'){
                    document.getElementById('number').innerHTML = NaN;
                }
                else
                {
                    console(res[0]);
                    document.getElementById('number').innerHTML = "INVALID";
                }
            },
            error: function(jqXHR, textStatus, errorThrown){
                alert("Timeout! Please check your network connection!");
                document.getElementById('number').innerHTML = "0";
            }
        });
};

var clearOverflow = function(){
    var numberBoard = document.getElementById('number');
    var init = 120;
    do{
        numberBoard.style.fontSize = (init /= 1.2) + "pt";
    }while(numberBoard.scrollWidth > numberBoard.clientWidth);
};

function input(data){
    var idNum = document.getElementById('number'), idOpr = document.getElementById('operations');
    if(isNaN(data)){
        if(data == "C"){
            idOpr.innerHTML = "";
            idNum.innerHTML = "0";
            clearOverflow();
            return;
        }
        if(data == "CE"){
            idNum.innerHTML = "0";
            clearOverflow();
            if(isEnd){
                idOpr.innerHTML = "";
                isEnd = false;
            }
            return;
        }
        if(data == "Del"){
            idNum.innerHTML = Math.trunc(idNum.innerHTML / 10);
            clearOverflow();
            if(isEnd){
                idOpr.innerHTML = "";
                isEnd = false;
            }
            return;
        }
        if(data == "."){
            if(isEnd){
                idOpr.innerHTML = "";
                isEnd = false;
            }
            if(idNum.innerHTML.includes(".")){
                return;
            }
            idNum.innerHTML += ".";
            return;
        }
        if(data == "±"){
            if(isEnd){
                idOpr.innerHTML = "";
                isEnd = false;
            }
            idNum.innerHTML = -idNum.innerHTML;
            return;
        }
        if(data == "="){
            if(isEnd)
                return;
            try{
                idOpr.innerHTML += idNum.innerHTML;
                Req_ajax();
                idOpr.innerHTML += data;
                clearOverflow();
            }
            catch(exception){
                clearOverflow();
                idNum.innerHTML = "INVALID";
            }
            isNew = true;
            isEnd = true;
            return;
        }
        idOpr.innerHTML += idNum.innerHTML + data;
        isNew = true;
    }
    else{
        if(isEnd){
            idOpr.innerHTML = "";
            isEnd = false;
        }
        if(idNum.innerHTML == "0" || isNew){
            idNum.innerHTML = data;
            clearOverflow();
            isNew = false;
            return;
        }
        idNum.innerHTML += data;
        clearOverflow();
    }
};