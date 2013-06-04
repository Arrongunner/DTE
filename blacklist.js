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


//place this in the console meesta midi doo dah

var customisedChatsModel = Class.extend({
            init: function(){
        	ChatModel.chatCommand = function (a) {
            		var b;
            		if ("/help" == a) return a = {type: "update"}, a.message =Lang.chat.help, this.receive(a), log('<span><strong>Extra Commands:</strong></br>/ca &nbsp; Change Avatar</br>/op &nbsp; Show Track ID</br>/strobe off &nbsp; Deactivate Strobes</span>'), !0;
            		if ("/commands" == a) return log('<span><strong>Extra Commands:</strong></br>/ca &nbsp; Change Avatar</br>/op &nbsp; Show Track ID</br>/strobe off &nbsp; Deactivate Strobes</span>'), !0;
            		if ("/ca" == a) return Models.user.changeAvatar("halloween" + prompt("Enter Avatar Number:\r\r01 - Male Vampire\r02 - Female Vampire\r03 - Male Frankenstein\r04 - Female Frankenstein\r05 - Male Skeleton\r06 - Female Skeleton\r07 - Male Mummy\r08 - Female Mummy\r09 - Male Ghost\r10 - Male Werewolf\r11 - Pumpkin Man\r12 - Female Werewolf\r13 - Male Zombie", "01")), !0;
            		if ("/op" == a) return log('<span>Song: ' + API.getMedia().author + " - " + API.getMedia().title + '"</span></br><span>song ID: "' + API.getMedia().id + '"</span>'), !0;
            		if ("/strobe off" == a) {log('<span>strobes deactivated!</span>'); return RoomUser.audience.strobeMode(false), !0;};
            		if ("/users" == a) return UserListOverlay.show(), !0;
            		if ("/hd on" == a) return Playback.setHD(!0), !0;
            		if ("/hd off" == a) return Playback.setHD(!1), !0;
            		if ("/chat big" == a) return this.expand(), !0;
            		if ("/chat small" == a) return this.collapse(), !0;
            		if ("/afk" == a) return Models.user.changeStatus(1), !0;
            		if ("/back" == a) return Models.user.changeStatus(0), !0;
            		if (0 == a.indexOf("/ts ")) return b = a.split(" ").pop(), DB.settings.chatTS = "12" == b ? 12 : "24" == b ? 24 : !1, this.dispatchEvent("timestampUpdate", {
                    		value: DB.settings.chatTS
                	}),
            		DB.saveSettings(), !0;
            		if (0 == a.indexOf("/cap ")) {
                		if (a = parseInt(a.split(" ").pop()), 0 < a && 201 > a) return RoomUser.audience.gridData.avatarCap = a, RoomUser.redraw(), DB.settings.avatarcap = a, DB.saveSettings(), log(Lang.messages.cap.split("%COUNT%").join("" + a)), !0
            		} else {
                		if ("/cleanup" == a) return DB.reset(), Dialog.alert(Lang.alerts.updateMessage, $.proxy(Utils.forceRefresh, Utils), Lang.alerts.update, !0), !0;
                		if ("/stream on" == a) DB.settings.streamDisabled = !1, DB.saveSettings(), Playback.media && Playback.play(Playback.media,
                        		Playback.mediaStartTime), b = "Video/audio streaming enabled.";
                		else if ("/stream off" == a) DB.settings.streamDisabled = !0, DB.saveSettings(), Playback.stop(), b = "<strong>Video/audio streaming has been stopped.</strong> Type <em>/stream on</em> to enable again.";
                		else {
                    			if ("/clear" == a) return this.dispatchEvent("chatClear"), _gaq.push(["_trackEvent", "Chat", "Clear", Models.room.data.id]), !0;
                    			Models.room.ambassadors[Models.user.data.id] ? "/fixbooth" == a && (new ModerationBoothCleanupService, b = "Fixing Booth") : Models.room.admins[Models.user.data.id] &&
                        			("/fixbooth" == a ? (new ModerationBoothCleanupService, b = "Fixing Booth") : 0 == a.indexOf("/audience ") ? (a = parseInt(a.split(" ").pop()), 0 < a ? (RoomUser.testAddAvatar(a), b = "Adding " + a + " fake avatars to audience") : (RoomUser.clear(), RoomUser.setAudience(Models.room.getAudience()), RoomUser.setDJs(Models.room.getDJs()), b = "Cleared fake avatars from audience")) : 0 == a.indexOf("/ping ") ? (DB.settings.showPings = "/ping on" == a ? !0 : !1, DB.saveSettings(), b = "Ping messages are " + (DB.settings.showPings ? "on" : "off")) : 0 == a.indexOf("/speed ") &&
                        			(b = parseInt(a.split(" ").pop()), animSpeed = 0 < b ? b : 83, b = "Setting animation speed to " + animSpeed))
                		}
            		}
            		return b ? (a = {
                		type: "system"
            		}, a.message = b, this.receive(a), !0) : !1
        	}
        	Models.chat.chatCommand = ChatModel.chatCommand
    	}
});
var customisedChats = new customisedChatsModel;
