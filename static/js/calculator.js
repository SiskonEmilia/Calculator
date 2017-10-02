var isNew = false, isEnd = false;
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
                idNum.innerHTML = eval(idOpr.innerHTML);
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