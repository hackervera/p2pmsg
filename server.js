var dgram = require('dgram');
var message = new Buffer(JSON.stringify({"+end":"38666817e1b38470644e004b9356c1622368fa57"}));
var socket = dgram.createSocket("udp4");
var ezcrypto = require('./ezcrypto-js/ezcrypto.js').ezcrypto;
var Mu = require('./Mu/lib/mu');
var fs = require('fs');
var sqlite = require('./node-sqlite/sqlite');
var db = new sqlite.Database();
var http = require('http');
var parser = require('url').parse;
Mu.templateRoot = './templates';
var index;
var ring;

try { 
  data = fs.readFileSync('./keys','ascii');
  keys = JSON.parse(data);
} catch(e) {
  console.log(e);
  keys = ezcrypto.generateKey();
  fs.writeFileSync('./keys',JSON.stringify(keys));
}
tweetsJavascript = fs.readFileSync('./tweets.js');

db.open("tweets.db", function(error){
  if (error) {
      console.log("Error opening database");
      throw error;
  }
  db.getTweets = function(res){ 
    console.log("calling get tweets");
    db.execute("select name,message,timestamp from tweets join names on tweets.key = names.key", function(error, rows){
      if (error && error.message.search("no such table: tweets") != -1){
        console.log(error);//throw error;
        db.execute("CREATE TABLE tweets (key, message, timestamp)",function(){});
        db.execute("CREATE TABLE names (key, name)",function(){});
        db.getTweets(res);
        return;
      }
      if (!rows || rows.length < 1){
        db.execute("select key,message,timestamp from tweets", function(error, rows){
          
          for (x in rows){
            row = rows[x];
            row.name = row.key;
         }
          console.log("Calling render tweets from select key");
          http.renderTweets(res, rows);
        });
        return
      }    
      console.log("calling render tweets from main function");
      //console.log(rows);
      http.renderTweets(res, rows);
      //console.log(rows);
    
    });
  };
  
});



http.renderTweets = function(res, rows){
  
  var tweetLogic = {
    tweets: rows.reverse()
  };
  //console.log(tweetLogic);
  Mu.render('tweets.html', tweetLogic, {}, function(err, output){
    if (err){
      throw err;
    }
    
    var buffer = '';
    
    output.addListener('data', function (c) {buffer += c; })
          .addListener('end', function () { res.end(buffer) });
  });
};

http.createServer(function(req,res){
  
  var output = ("An error occured");
  var reqdict = parser(req.url, true);
  var pathname = reqdict.pathname;
  console.log(reqdict);
  if (pathname == "/"){
    output = index;
  }
  if (pathname == "/tweets"){
    res.writeHead(200, {'Content-Type': 'text/html'});
    db.getTweets(res);
    return;
  }
  if(pathname == "/tweets.js"){
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end(tweetsJavascript);
    return;
  }
  if (pathname == "/send"){
    console.log("LINE: " + console.line);
    res.writeHead(200, {'Content-Type': 'text/html'});
    var message = reqdict.query.message;
    var hash = ezcrypto.hash(message);
    var signature = ezcrypto.sign(hash, keys.public, keys.private);
    var json = {"+key":keys.public,"_line":console.line,"+end":"8bf1cce916417d16b7554135b6b075fb16dd26ce","_to":"208.68.163.247:42424", "+sig":signature, "+message":message};
    var msg = new Buffer(JSON.stringify(json));
    socket.sendData(msg);
    res.end("Very well");
    return;
  }
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.end(output);
}).listen(8080, "0.0.0.0");

socket.sendData = function(message){ console.log(message.toString()); this.send(message, 0, message.length, 42424, "telehash.org"); }
socket.on("message", function(data, rinfo){
  console.log(data.toString());
  telex = JSON.parse(data.toString());
  if (telex["_ring"] || telex["_line"]){
    ring = telex["_ring"] || telex["_line"];
    console.log("LINE: " + ring);
      console.line = ring;
    var response = new Buffer(JSON.stringify({".tap":[{"has":["+key"]}],"_line":ring, "_to":"208.68.163.247:42424"}));
    this.sendData(response);
  }
  if (telex["+key"]){
    console.log("INCOMING KEY!!!!!!!!");
    var message = telex["+message"];
    var key = telex["+key"];
    var signature = telex["+sig"];
    var test = ezcrypto.verify(message, signature, key)
    if (test){
      console.log("Key validates");
      var timestamp = new Date().toString();
      db.insertTweets = function(){
        db.execute("INSERT INTO tweets (key, message, timestamp) VALUES (?,?,?)", [key, message, timestamp], function(error, rows){
          if (error){
            db.execute("CREATE TABLE tweets (key, message, timestamp)",function(){});
            db.insertTweets();
          }
        });
      };
      db.insertTweets();
    } else {
      console.log("Key doesn't validate");
    }
    
  }
});

socket.on("listening", function(){
  console.log("Now listening");
  setTimeout(function(){ socket.send(message, 0, message.length, 42424, "telehash.org"); socket.ping() }, 1000);

});

socket.bind(12345);




var pingmsg = new Buffer(JSON.stringify({"_line":console.line, "_to":"208.68.163.247:42424"}));
socket.ping = function(){ setTimeout(function(){ socket.sendData(pingmsg); socket.ping(); },30000) };
