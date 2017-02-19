var newUsers = [];
var newLogs = [];

  function fixStrings(s) {
    s=s.trim();
    s=s.toUpperCase();
    return s;
  }
  
  function findUserbyplate(lic) {
    //todo trimp and upper case lic
    lic=fixStrings(lic); //trims and upper case it
    for (var i=0;i<newUsers.length;i++) {
      if (newUsers[i].plate==lic) {
      console.log("found by lic " + lic + "" + newUsers[i]);
      return newUsers[i];
      }
    }
    return null;
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
  
  function findUserbyplate(plate) {
    
    plate = fixStrings(plate);
    
    for (var i=0;i<newUsers.length;i++) {
      if (newUsers[i].plate==plate) {
          console.log("\n" + newUsers[i].plate + " " + newUsers[i].fullname);
          return newUsers[i]
      }
    }
    return null;
  }  
  
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
    
  }
  
  function getLogs(plate) {

    var p = {
      'plate' : plate,
      'timestamp' : Date.now(),
      'statusLocation' : ""
    }    
    
    plate=fixStrings(plate);
    
    var temp=[];
    
    for (var i=0;i<newLogs.length;i++) {
      if ((plate=="") || (plate==newLogs[i].plate)) {
        temp.push(newLogs[i]);
        
        console.log(newLogs[i]);
        console.log("");
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


