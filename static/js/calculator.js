var isNew = false;
function input(data, button){
    if(isNaN(data)){
        if(data == "C"){
            document.getElementById('operations').innerHTML = "";
            document.getElementById('number').innerHTML = "0";
            return;
        }
        if(data == "CE"){
            document.getElementById('number').innerHTML = "0";
            return;
        }
        if(data == "Del"){
            document.getElementById('number').innerHTML /= 10;
            return;
        }
        document.getElementById('operations').innerHTML += document.getElementById('number').innerHTML + data;
        isNew = true;
    }
    else{
        if(document.getElementById('number').innerHTML == "0" || isNew){
            document.getElementById('number').innerHTML = data;
            isNew = false;
            return;
        }
        document.getElementById('number').innerHTML += data;
    }
};