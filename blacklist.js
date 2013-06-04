//The blacklist to stop those particularly naughty users joining
blacklist=
[ 
        //"userID"
];

API.addEventListener(API.USER_JOIN, checkBlacklist);

function checkBlacklist(user) {
 if(blacklist.indexOf(user.id) > -1 ) {
     API.sendChat("/me blacklisted user detected, removing them from the room!");
     API.moderateBanUser(user.id, "Banned from this room")
   }
 }
