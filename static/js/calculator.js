var isNew = false, isEnd = false;
var clearOverflow = function(){
    var numberBoard = document.getElementById('number');
    var init = 120;
    do{
        numberBoard.style.fontSize = (init /= 1.2) + "pt";
    }while(numberBoard.scrollWidth > numberBoard.clientWidth);
};

function input(data){
    if(isNaN(data)){
        if(data == "C"){
            document.getElementById('operations').innerHTML = "";
            document.getElementById('number').innerHTML = "0";
            clearOverflow();
            return;
        }
        if(data == "CE"){
            document.getElementById('number').innerHTML = "0";
            clearOverflow();
            if(isEnd){
                document.getElementById('operations').innerHTML = "";
                isEnd = false;
            }
            return;
        }
        if(data == "Del"){
            document.getElementById('number').innerHTML = Math.trunc(document.getElementById('number').innerHTML / 10);
            clearOverflow();
            if(isEnd){
                document.getElementById('operations').innerHTML = "";
                isEnd = false;
            }
            return;
        }
        if(data == "."){
            if(isEnd){
                document.getElementById('operations').innerHTML = "";
                isEnd = false;
            }
            if(document.getElementById('number').innerHTML.includes(".")){
                return;
            }
            document.getElementById('number').innerHTML += ".";
            return;
        }
        if(data == "±"){
            if(isEnd){
                document.getElementById('operations').innerHTML = "";
                isEnd = false;
            }
            document.getElementById('number').innerHTML = -document.getElementById('number').innerHTML;
            return;
        }
        if(data == "="){
            if(isEnd)
                return;
            try{
                document.getElementById('operations').innerHTML += document.getElementById('number').innerHTML;
                document.getElementById('number').innerHTML = eval(document.getElementById('operations').innerHTML);
                document.getElementById('operations').innerHTML += data;
                clearOverflow();
            }
            catch(exception){
                clearOverflow();
                document.getElementById('number').innerHTML = "INVALID";
            }
            isNew = true;
            isEnd = true;
            return;
        }
        document.getElementById('operations').innerHTML += document.getElementById('number').innerHTML + data;
        isNew = true;
    }
    else{
        if(isEnd){
            document.getElementById('operations').innerHTML = "";
            isEnd = false;
        }
        if(document.getElementById('number').innerHTML == "0" || isNew){
            document.getElementById('number').innerHTML = data;
            clearOverflow();
            isNew = false;
            return;
        }
        document.getElementById('number').innerHTML += data;
        clearOverflow();
    }
};