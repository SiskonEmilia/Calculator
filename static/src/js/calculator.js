/*jshint esversion: 6*/
var isNew = false, isEnd = false, isFunc = 0;
var isPow = false, isExp = false, isDeg = false, isLev = 0;
var isOpr = true, isRot = false;
var tempOpr = "", tempPow = "", oriOpr = "";
var OL_Action_Root = "http://127.0.0.1:8888";

function Req_ajax() {
  $.ajax({
    data: {
      info: document.getElementById('operations').innerHTML,
      type: "post"
    },
    url: OL_Action_Root + "/req_cal",
    dataType: 'json',
    cache: false,
    timeout: 5000,
    type: "post",
    success: function (data) {
      var res = data;
      if (res[0] == 'success') {
        document.getElementById('number').innerHTML = res[1];
        clearOverflow();
      }
      else if (res[0] == 'NaN') {
        document.getElementById('number').innerHTML = NaN;
      }
      else {
        document.getElementById('number').innerHTML = "INVALID";
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      document.getElementById('number').innerHTML = "TIMEOUT";
      alert("Timeout! Please check your network connection!");
    }
  });
}

function autoFill() {
  var idOpr = document.getElementById('operations');
  for (; isFunc > 0; --isFunc) {
    idOpr.innerHTML += ")";
  }
  tempOpr = "";
  oriOpr = "";
}

function clearFunc() {
  if (isPow || isFunc > 0 || isLev) {
    isPow = false;
    isFunc = 0;
    if(!isRot)
      document.getElementById('operations').innerHTML = oriOpr;
    tempOpr = tempPow = oriOpr = "";
  }
}

function rootSolve() {
  isRot = false;
  document.getElementById('operations').innerHTML += document.getElementById('number').innerHTML + ")";
}

function expSolve() {
  var idNum = document.getElementById('number'),
    idOpr = document.getElementById('operations');
  if (idNum.innerHTML.charAt(0) == "-")
    idOpr.innerHTML += idNum.innerHTML + ")";
  else
    idOpr.innerHTML += "+" + idNum.innerHTML + ")";
  isExp = false;
}

var clearOverflow = function () {
  var numberBoard = document.getElementById('number');
  var init = 140;
  do {
    numberBoard.style.fontSize = (init /= 1.2) + "pt";
  } while (numberBoard.scrollWidth > numberBoard.clientWidth || numberBoard.scrollHeight > numberBoard.clientHeight);
};

function input(data) {
  var idNum = document.getElementById('number'), idOpr = document.getElementById('operations');
  if (isNaN(data)) {
    switch (data) {
      case "C":
        idOpr.innerHTML = "";
        idNum.innerHTML = "0";
        tempOpr = "";
        tempPow = "";
        oriOpr = "";
        isFunc = isLev = 0;
        isNew = isEnd = isExp = isPow = isDeg = isRot = false;
        isOpr = true;
        clearOverflow();
        break;
      case "CE":
        idNum.innerHTML = "0";
        isDeg = isExp = false;
        clearOverflow();
        if (isEnd) {
          idOpr.innerHTML = "";
          isEnd = false;
        }
        break;
      case "Del":
        if (isFunc) {
          tempOpr = tempOpr.substr(tempOpr.indexOf("(") + 1);
          idOpr.innerHTML = oriOpr + tempOpr;
          --isFunc;
          if (isFunc == 0) {
            idOpr.innerHTML = oriOpr;
            tempOpr = "";
          }
          break;
        }
        else if (isPow) {
          idOpr = oriOpr;
          isPow = false;
          break;
        }
        else if (isDeg) {
          idNum.innerHTML = idNum.innerHTML.substr(0, idNum.innerHTML.length - 4) + "deg";
          if (idNum.innerHTML == "deg")
            idNum.innerHTML = "0deg";
          break;
        }
        else
          oriOpr = "";
        idNum.innerHTML = Math.trunc(idNum.innerHTML / 10);
        if (idNum.innerHTML == "NaN")
          idNum.innerHTML = "0";
        if (idNum.innerHTML.includes("e"))
          idNum.innerHTML = "0";
        clearOverflow();
        if (isEnd) {
          idOpr.innerHTML = "";
          isEnd = false;
        }
        break;
      case ".":
        if (isPow || isFunc > 0) {
          isPow = false;
          isFunc = 0;
          idOpr = oriOpr;
        }
        if (isEnd) {
          idOpr.innerHTML = "";
          isEnd = false;
        }
        if (idNum.innerHTML.includes(".")) {
          break;
        }
        idNum.innerHTML += ".";
        isNew = false;
        break;
      case "±":
        clearFunc();
        if (isEnd) {
          idOpr.innerHTML = "";
          isEnd = false;
        }
        if (isDeg)
          idNum.innerHTML = idNum.innerHTML.substr(0, idNum.innerHTML.length - 3);
        idNum.innerHTML = idNum.innerHTML.substr(0, idNum.innerHTML.length - isLev);

        if (idNum.innerHTML == "π")
          idNum.innerHTML = "-π";
        else if (idNum.innerHTML == "-π")
          idNum.innerHTML = "π";
        else
          idNum.innerHTML = -idNum.innerHTML;

        for (let i = 0; i < isLev; ++i)
          idNum.innerHTML += "!";
        if (isDeg)
          idNum.innerHTML += "deg";
        isNew = false;
        break;
      case "=":
        if (isEnd)
          break;
        try {
          if (isFunc == 0 && !isPow && isOpr && !isExp && !isRot)
            idOpr.innerHTML += idNum.innerHTML;
          if (isExp)
            expSolve();
          if (isRot)
            rootSolve();
          autoFill();
          Req_ajax();
          idOpr.innerHTML += data;
        }
        catch (exception) {
          clearOverflow();
          idNum.innerHTML = "INVALID";
        }
        isNew = isEnd = isPow = isExp = isDeg = isLev = isRot = false;
        isOpr = true;
        break;
      case "(":
        if (isEnd) {
          idOpr.innerHTML = "";
          isEnd = false;
        }
        idOpr.innerHTML += data;
        break;
      case ")":
        if (isEnd) {
          idOpr.innerHTML = "";
          isEnd = false;
        }
        isOpr = false;
        if (isFunc == 0 && !isLev && !isPow) {
          idOpr.innerHTML += idNum.innerHTML;
          isDeg = false;
          isNew = true;
        }
        idOpr.innerHTML += ")";
        break;
      case "10^x": case "e^x":
        data = data.substr(0, data.length - 1);
      case "sin": case "asin": case "cos": case "acos":
      case "log": case "ln": case "tan": case "atan":
        if (isEnd) {
          idOpr.innerHTML = "";
          isEnd = false;
        }
        if(!isOpr)
          break;
        if (isExp)
          break;
        if (isRot)
          rootSolve();
        if (tempOpr == "") {
          if (oriOpr == "")
            oriOpr = idOpr.innerHTML;
          tempOpr = idNum.innerHTML;
        }
        tempOpr = data + "(" + tempOpr;
        idOpr.innerHTML = oriOpr + tempOpr;
        ++isFunc;
        isNew = true;
        break;
      case "deg":
        if (isEnd) {
          idOpr.innerHTML = "";
          isEnd = false;
        }
        if (isExp)
          break;
        clearFunc();
        if (isDeg) {
          idNum.innerHTML = idNum.innerHTML.substr(0, idNum.innerHTML.length - 3);
          isDeg = false;
        }
        else {
          idNum.innerHTML += "deg";
          isDeg = true;
        }
        break;

      case "√":
        data = "x^(1/2)";
      case "1/x":
        if (data == "1/x")
          data = "x^(-1)";
      case "x^2": case "x^3":
        if (isEnd) {
          idOpr.innerHTML = "";
          isEnd = false;
        }
        if (isExp)
          break;
        autoFill();
        data = data.substr(1);
        if (oriOpr == "")
          oriOpr = idOpr.innerHTML;
        if (!isPow && isFunc == 0 && isOpr) {
          idOpr.innerHTML += idNum.innerHTML;
          tempPow += idNum.innerHTML;
        }
        isPow = true;
        idOpr.innerHTML += data;
        tempPow += data;
        isNew = true;
        break;
      case "n!":
        if (isEnd) {
          idOpr.innerHTML = "";
          isEnd = false;
        }
        if (isExp)
          break;
        clearFunc();
        if (isDeg)
          idNum.innerHTML = idNum.innerHTML.substr(0, idNum.innerHTML.length - 3);
        idNum.innerHTML += "!";
        ++isLev;
        if (isDeg)
          idNum.innerHTML += "deg";
        isNew = false;
        break;
      case "Exp":
        clearFunc();
        if (isExp)
          break;
        idNum.innerHTML = idNum.innerHTML.replace(/deg/g, "");
        idNum.innerHTML = idNum.innerHTML.replace(/!/g, "");
        isDeg = false;
        isExp = true;
        isLev = 0;
        isNew = true;
        idOpr.innerHTML += "(" + idNum.innerHTML;
        if (!idNum.innerHTML.includes(".")) {
          idOpr.innerHTML += ".";
        }
        idOpr.innerHTML += "e";
        break;
      case "π":
        if (isExp)
          break;
        clearFunc();
        isDeg = false;
        isLev = 0;
        isNew = true;
        isEnd = false;
        idNum.innerHTML = "π";
        break;
      case "y√x":
        autoFill();
        if (isPow || isRot || !isOpr) {
          if (isRot)
            rootSolve();
        }
        else {
          idOpr.innerHTML += idNum.innerHTML;
        }
        idNum.innerHTML = idNum.innerHTML.substr(0, idNum.innerHTML.length - 3 * isDeg);
        isDeg = false;
        isRot = true;
        isLev = 0;
        isNew = true;
        idOpr.innerHTML += "^(1/";
        break;
      case "x^y":
        data = "^";
      default:
        if (isEnd) {
          idOpr.innerHTML = "";
          isEnd = false;
        }
        var flag = isFunc;
        autoFill();
        if (!(flag > 0 || isExp || isPow || !isOpr))
          idOpr.innerHTML += idNum.innerHTML;
        if (isExp)
          expSolve();
        if (isRot)
          rootSolve();
        idOpr.innerHTML += data;
        isNew = true;
        isPow = false;
        isDeg = false;
        isLev = false;
        isOpr = true;
        break;
    }
  }
  else {
    clearFunc();
    if (isEnd) {
      idOpr.innerHTML = "";
      isEnd = false;
    }
    if (idNum.innerHTML == "0" || isNew) {
      idNum.innerHTML = data;
      clearOverflow();
      isNew = false;
      return;
    }
    if (isDeg)
      idNum.innerHTML = idNum.innerHTML.substr(0, idNum.innerHTML.length - 3);
    idNum.innerHTML = idNum.innerHTML.substr(0, idNum.innerHTML.length - isLev);
    idNum.innerHTML += data;
    for (let i = 0; i < isLev; ++i)
      idNum.innerHTML += "!";
    if (isDeg)
      idNum.innerHTML += "deg";
    clearOverflow();
  }
}