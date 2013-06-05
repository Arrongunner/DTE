blacklist = [ 
        //user IDs
];

API.addEventListener(API.USER_JOIN, checkBlacklist);

function checkBlacklist(user) {
        if (blacklist.indexOf(user.id) > -1 ) {
                API.sendChat("/me blacklisted user detected, removing them from the room!");
                API.moderateBanUser(user.id, "Blacklisted User. You may not join this room again");
        }
}

API.addEventListener(API.CHAT, getID);
function getID(data)
{
  var idCmdCheck=data.message.substr(0,4)
  if(idCmdCheck=="/id ")
  {
    var idCommand = data.message.trim();
    for (var i=0;i<API.getStaff().length;i++) 
    {
      if (API.getStaff()[i].id==data.fromID)
      {
        var idUser = data.message.replace("/id ","");
        for(var j=0;j<API.getUsers().length;j++)
        {
          if(API.getUsers()[j].username==idUser)
          {
            log("User Name = "+API.getUsers()[j].username);
            log("User ID = "+API.getUsers()[j].id);  
            break;
          }
        }
      }
    }
  }
}
