var fs = require('fs');
var express = require('express');
var bodyParser = require('body-parser');
var math = require('mathjs');

var app = express();
var urlencodedParser = bodyParser.urlencoded({ extended: false });
math.config({
    number: 'BigNumber'
});

function ln(a) {
    return math.eval("log(" + a + ")/log(e)");
}
math.import({
    ln: ln
});

app.use(express.static('../static'));

app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1');
    if(req.method=="OPTIONS") res.send(200);
    else  next();
});

app.get("/", function(req, res){
    res.writeHead(200,{"Content-Type":"text/html"})
    res.end(fs.readFileSync("../static/html/calculator.html"));
    console.log('Someone has just visited our home page!');
});

app.post('/req_cal', urlencodedParser, function(req, res){
    var type = req.body.type;
    var info = req.body.info;
    info = info.replace(/π/g, "pi");
    try{
        var result = math.eval(info);
        console.log("Require received! Type of which is " + type + ", and info in which is " + info + ".");
        console.log("Result: " + result + " sent successfully.");
        if(!isNaN(result)){
            if((result + "").length > 19)
                res.json(['success', result.toPrecision(18) + ""]);
            else
                res.json(['success', result + ""]);
        }
        else
            res.json(['NaN']);
    }
    catch(excepetion){
        console.log('Fail to calculate: ' + info);
        console.log('Error message sent.');
        res.json(['failure']);
    }
    res.end();
});


var server = app.listen(8888, function () {
    console.log('Listening at http://localhost:8888/...');
});