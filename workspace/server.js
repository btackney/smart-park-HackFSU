//
// # SimpleServer
//
// A simple chat server using Socket.IO, Express, and Async.
//
/*global fs*/
var http = require('http');
var path = require('path');

var async = require('async');
var socketio = require('socket.io');
var express = require('express');

var openalpr = require ("node-openalpr");

var lastsocket;

var INorOut = "IN";



var saved=[];

var timespent=[];
var logs=[];
var users = [];

var newUsers = [];
var newLogs = [];

var parkers = 0;

  function fixStrings(s) {
    s=""+s;
    
    try {
    s=s.trim();
    s=s.toUpperCase();
    } catch(e) {
      
    }
    return s;
  }
  
  //findPlateByuser
  
  function findPlateByuser(user) {
    for (var i=0;i<newUsers.length;i++) {
      if (user==newUsers[i].fullname) return newUsers[i].plate;
    }
    return 'unknown plate';
    
  }
  
  function findUserbyplate(lic) {
    //todo trimp and upper case lic
    lic=fixStrings(lic); //trims and upper case it
    for (var i=0;i<newUsers.length;i++) {
      if (newUsers[i].plate.substr(0,2)==lic.substr(0,2)) {
      console.log("found by lic " + lic + "" + newUsers[i]);
      return newUsers[i].fullname;
      }
    }
   
    return "guest";
  }
  
  function getUsers(fullname) {
    
    fullname = fixStrings(fullname);
    var temp=[];
    for (var i=0;i<newUsers.length;i++) {
      if ((fullname=="") || (newUsers[i].fullname==fullname)) {
          temp.push(newUsers[i]);
          console.log(newUsers[i].fullname + "\n");
          }
    }
    return temp;
    
  }  
  
  // function findUserbyplate(plate) {
    
  //   plate = fixStrings(plate);
    
  //   for (var i=0;i<newUsers.length;i++) {
  //     if (newUsers[i].plate==plate) {
  //         console.log("\n" + newUsers[i].plate + " " + newUsers[i].fullname);
  //         return newUsers[i].fullname;
  //     }
  //   }
  //   return "unkown";
  // }  
  
  function findUserbyFullname(fullname) {
    
    fullname = fixStrings(fullname);
    
    for (var i=0;i<newUsers.length;i++) {
      if (newUsers[i].fullname==fullname) {
          console.log("Found:" + JSON.stringify(newUsers[i]));
          return newUsers[i];
      }
    }
    
    return null;
    
  }
  
  function addUser(fullname,plate,timestamp,details) {
    var p =  {
      'fullname': fullname,
      'plate': plate,
      'timestamp': timestamp,
      'details' : details
    }
    
    if (!findUserbyFullname(fullname)) {
      newUsers.push(p);
      return p;
    }
    return null;
  }
  
  function logAction(plate,timestamp,statusLocation) {
    
    var p = {
      'plate' : plate,
      'timestamp' : Date.now(),
      'statusLocation' : statusLocation
    }
    
    newLogs.push(p);
    
    if (statusLocation=="IN") {
      saved[plate]=timestamp;
    }
    
    
    if (statusLocation=="OUT") {
      
      //FIND THE IN RECORD
      console.log(timestamp);
      console.log(saved[plate]);
      console.log("time: " + (timestamp-saved[plate]));
    
    var q = {
      'plate' : plate,
      'timestamp' : Date.now(),
      'timespent' : (timestamp-saved[plate])/1000
    }
   
      timespent.push(q);
      
    console.log(JSON.stringify(q));
      
    }
    
    
    
  }
  
  function getLogs(plate) {
    
    //plate=fixStrings(plate);
    
    var temp=[];
    
    for (var i=0;i<newLogs.length;i++) {
      console.log('..' + newLogs[i].plate + '.. == ..' + plate);
      if  (plate==newLogs[i].plate) {
        
        temp.push(newLogs[i]);
        
       // console.log(newLogs[i]);
       // console.log("");
      }
    }
    
    return temp;
    
  }
  

// findUserbyFullname("Sheldon Pasciak");
// console.log(findUserbyplate("12345"));
// addUser('Sheldon Pasciak',"12345",Date.now(),"retired");
// addUser('Brendan Tackney',"55555",Date.now(),"lifeguard");
// logAction("12345",Date.now(),"IN");
// logAction("12345",Date.now(),"IN");
// logAction("55555",Date.now(),"IN");
// logAction("12345",Date.now(),"OUT");
// getLogs("12345");
// getUsers("");
// console.log(findUserbyplate("12345").fullname);
// findUserbyplate("55555");


addUser("SHELDON PASCIAK","EJBU74", Date.now(), 'LOAD');
addUser("SHELDON PASCIAK","EJB74", Date.now(), 'LOAD');
addUser("SHELDON PASCIAK","EJ8U74", Date.now(), 'LOAD');

addUser("BRENDAN TACKNEY","BRENDAN", Date.now(), 'LOAD');
addUser("JOEL MILLIGAN","JOEL", Date.now(), 'LOAD');
addUser("JOEL MILLIGAN","JOEL", Date.now(), 'LOAD');

addUser("SHELDON PASCIAK","SHELDON", Date.now(), 'LOAD');
addUser("SMART SIGN","SMARTSIGN", Date.now(), 'LOAD');

logAction("BRENDAN",Date.now(),"IN");
logAction("EJBU74",Date.now(),"IN");
logAction("JOEL",Date.now(),"IN");

logAction("BRENDAN",Date.now()+60000,"OUT");
logAction("EJBU74",Date.now(),"OUT");
logAction("JOEL",Date.now(),"OUT");

logAction("BRENDAN",Date.now(),"IN");
logAction("BRENDAN",Date.now()+60000*5,"OUT");

logAction("BRENDAN",Date.now(),"IN");
logAction("BRENDAN",Date.now()+60000*10,"OUT");

logAction("BRENDAN",Date.now(),"IN");
logAction("BRENDAN",Date.now()+60000*15,"OUT");

logAction("BRENDAN",Date.now(),"IN");
logAction("BRENDAN",Date.now()+60000*90,"OUT");
//
// ## SimpleServer `SimpleServer(obj)`
//
// Creates a new instance of SimpleServer with the following options:
//  * `port` - The HTTP port to listen on. If `process.env.PORT` is set, _it overrides this value_.
//
var router = express();
var server = http.createServer(router);
var io = socketio.listen(server);

router.use(express.static(path.resolve(__dirname, 'client')));
var messages = [];
var sockets = [];



io.on('connection', function (socket) {

    sockets.push(socket);

    socket.on('disconnect', function () {
      sockets.splice(sockets.indexOf(socket), 1);
      updateRoster();
    });

    
      socket.on('IN', function (msg) {
        console.log("Coming IN");
        msg=msg.replace("octet-stream","image/png")
        INorOut = "IN";
        saveImage(msg,"IN.png");
  
        runshit();
      });
    
      socket.on('OUT', function (msg) {
          console.log("Going Out");
          INorOut = "OUT";
          msg=msg.replace("octet-stream","image/png")
          saveImage(msg,"OUT.png", "OUT");

          runshit();
      });
      
      socket.on('TO_SERVER', function (data) {
       console.log(data);
       data="MODIFIED " + data;
       socket.emit("FROM_SERVER", data);
      });
      
      socket.on("userData", function(data){
        
        addUser(data.firstName + " " + data.lastName,data.plate,Date.now(),"");
        getUsers("");
        
        console.log(data);
        users.push(data);
        console.log("TEST" + JSON.stringify(users));
        
      });


      socket.on("MY_ACCOUNT", function(data){
        console.log("PLATE #:" + data)
        data=fixStrings(data);
        var objs = getLogs(data);
        console.log("@@@" + objs);
        socket.emit("USER_ACCOUNT", objs);
        socket.emit("USER_ACCOUNT2", timespent);
      });
      
      
      

function updateRoster() {
  async.map(
    sockets,
    function (socket, callback) {
      socket.get('name', callback);
    },
    function (err, names) {
      broadcast('roster', names);
    }
  );
}


function broadcast(event, data) {
  sockets.forEach(function (socket) {
    socket.emit(event, data);
  });
}



function saveImage(img,fname) {
  
var fs = require('fs');

var data = img.replace(/^data:image\/\w+;base64,/, "");
var buf = new Buffer(data, 'base64');
fs.writeFile(fname, buf);

}

function showLogs() {
  
  for (var i=0;i<logs.length;i++) {
    console.log(JSON.stringify(logs[i]));
  }
  
}


function runshit() {
  
  var d = new Date();
  var myTime = d.getTime();
  
console.log("INOROUT"+ INorOut)
var path;
  if(INorOut == "IN"){
    path = '/home/ubuntu/workspace/IN.png';
  }
    if(INorOut == "OUT"){

    path = '/home/ubuntu/workspace/OUT.png';
  }

var exec = require('child_process').exec;
var cmd = 'alpr -c us ' + path;

exec(cmd, function(error, stdout, stderr) {
  console.log("test2222");
  var arr = stdout.split("\n");
    console.log("my path" + path);

  if(arr.length >6){
    var plate = "my plate" + arr[1];
    console.log(plate)
    var plate2 = arr[1].split(" ");
    plate2[5].replace(/\s/g,'')
    var writeME = INorOut + ":" + plate2[5] + ":" + myTime;//todo tODO
    
    console.log("plate2" + writeME);
    
   // var obj = {  'plate': plate2[5], 'time': myTime, 'Tracking': INorOut } 
    
    var dd=plate2[5];
    
    do {
      dd=dd.replace(" ","");
    } while(dd.search(" ")>-1)
    
    dd=dd.substr(0,6);
    
   var obj = {  'plate': dd, 'time': myTime, 'Tracking': INorOut } 
    
    console.log("." + dd + ".");
    
    for (var i=0;i<users.length;i++){
      //console.log(JSON.stringify(users[i]));
     // console.log("users plate");
      //console.log(users[i].plate);
       console.log("-." + users[i].plate + ".-");
      if (users[i].plate==dd) console.log("Found: " + JSON.stringify(users[i]));
    }
    
   var tn = findUserbyplate(dd);
   
   var ul = findPlateByuser(tn);
   
    logAction(ul,Date.now(),INorOut);
    
    logs.push(obj);
    
   // var tn = "guest" ;  if (findUserbyFullname(dd).fullname) tn = findUserbyFullname(dd).fullname;
    

   
   if (ul=="unknown plate") ul=dd;
    
    socket.emit("GREEN",  tn  );
    
    if(INorOut == "IN"){
      parkers++;
      socket.emit("SHOW_SPACES", parkers);
    } else {
      if (parkers>0) parkers--;
      console.log(parkers + " parkers ");
      socket.emit("SHOW_SPACES", parkers);
    }
  } else  {
    
    socket.emit("RED",parkers);
    socket.emit("SHOW_SPACES", parkers); 
    console.log("BAD PLATE." + dd );
  
  }
  
});

}

  });


server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  var addr = server.address();
  console.log("Chat server listening at", addr.address + ":" + addr.port);
});
