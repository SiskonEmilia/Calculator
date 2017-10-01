var isNew = false, isEnd = false;;
function input(data, button){
    if(isNaN(data)){
        if(data == "C"){
            document.getElementById('operations').innerHTML = "";
            document.getElementById('number').innerHTML = "0";
            return;
        }
        if(data == "CE"){
            document.getElementById('number').innerHTML = "0";
            if(isEnd){
                document.getElementById('operations').innerHTML = "";
                isEnd = false;
            }
            return;
        }
        if(data == "Del"){
            document.getElementById('number').innerHTML = Math.trunc(document.getElementById('number').innerHTML / 10);
            if(isEnd){
                document.getElementById('operations').innerHTML = "";
                isEnd = false;
            }
            return;
        }
        if(data == "="){
            if(isEnd)
                return;
            try{
                document.getElementById('operations').innerHTML += document.getElementById('number').innerHTML;
                document.getElementById('number').innerHTML = eval(document.getElementById('operations').innerHTML);
                document.getElementById('operations').innerHTML += data;
            }
            catch(exception){
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
            isNew = false;
            return;
        }
        document.getElementById('number').innerHTML += data;
    }
};