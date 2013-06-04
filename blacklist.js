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
