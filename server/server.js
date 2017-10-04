var fs = require('fs');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.use(express.static('../static'));

app.get("/", function(req, res){
    res.writeHead(200,{"Content-Type":"text/html"})
    res.end(fs.readFileSync("../static/html/calculator.html"));
});

app.post('/req_cal', urlencodedParser, function(req, res){
    var type = req.body.type;
    var info = req.body.info;
    try{
        var result = eval(req.body.info);
        console.log("Require received! Type of which is " + type + ", and info in which is " + info + ". \nResult: " + result);
        if(isFinite(result))
            res.json(['success', result]);
        else
            res.json(['NaN']);
    }
    catch(excepetion){
        console.log('Fail: ' + info);
        res.json(['failure']);
    }
    res.end();
});


var server = app.listen(8888, function () {
    console.log('Listening');
});