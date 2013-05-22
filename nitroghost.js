if (meshkaEnhanced !== undefined)
    meshkaEnhanced.close();
String.prototype.equalsIgnoreCase = function(other) {
    return this.toLowerCase() === other.toLowerCase();
};
var plugCubed,
_roomElements = RoomUser.audience.roomElements
var meshkaEnhancedModel = Class.extend({
    version: {
        major: 1,
        minor: 1,
        patch: 2
    },
    init: function(){
        $('#room-wheel').hide()
        $('head').append('<style type="text/css" id="meshka-css">'
            + 'html{background: url("http://i.imgur.com/4L9QVPy.jpg") no-repeat scroll center top #000000;'
            + '#dj-console, #dj-console {background-image: url("http://www.omfgdogs.com/omfgdogs.gif");min-height:33px;min-width:131px;'
            + 'body {color:#ff0000;}'
        + '</style>');
         setTimeout(function(){RoomUser.audience.roomElements = []; RoomUser.redraw();},500);
        var words = {
            // Syntax: 'Search word' : 'Replace word',
            "Points" : "Points",
            "Now Playing" : "Now Playing",
            "Time Remaining" : "Time Remaining",
            "Volume" : "Crank it up!",
            "Current DJ" : "Current DJ",
            "Crowd Response" : "Crowd's Reaction",
            "Fans":"Minions"
        };
        String.prototype.prepareRegex = function() {
            return this.replace(/([\[\]\^\&\$\.\(\)\?\/\\\+\{\}\|])/g, "\\$1");
        };
        function isOkTag(tag) {
            return (",pre,blockquote,code,input,button,textarea".indexOf(","+tag) == -1);
        };
        var regexs=new Array(),
        replacements=new Array();
        for(var word in words) {
            if(word != "") {
                regexs.push(new RegExp("\\b"+word.prepareRegex().replace(/\*/g,'[^ ]*')+"\\b", 'gi'));
                replacements.push(words[word]);
            }
        }
        var texts = document.evaluate(".//text()[normalize-space(.)!='']",document.body,null,6,null), text="";
        for(var i=0,l=texts.snapshotLength; (this_text=texts.snapshotItem(i)); i++) {
        if(isOkTag(this_text.parentNode.tagName.toLowerCase()) && (text=this_text.textContent)) {
            for(var x=0,l=regexs.length; x<l; x++) {
                text = text.replace(regexs[x], replacements[x]);
                this_text.textContent = text;
                }
            }
        }
        this.proxy = {
            onChat: $.proxy(this.onChat, this)
        };
        API.addEventListener(API.CHAT,this.proxy.onChat)
        ChatModel.chatCommand = function (a) {
            var b;
            if ("/help" == a) return a = {
                    type: "update"
            }, a.message =
                Lang.chat.help, this.receive(a), !0;
            if ("/strobe on" == a) {API.sendChat("/strobe on"); log(Models.user.data.username + ' hit the strobe light!'); return RoomUser.audience.strobeMode(true), !0;};
            if ("/strobe off" == a) return RoomUser.audience.strobeMode(false), !0;
            if ("/rave on" == a) {log(Models.user.data.username + ' turned the lights down!'); return RoomUser.audience.lightsOut(true), !0;};
            if ("/rave off" == a) return RoomUser.audience.lightsOut(false), !0;
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
        log('<span style="color:#FF0000"><i>Running Super Enhanced version ' + this.version.major + '.' + this.version.minor + '.' + this.version.patch + '</i></span>');
        log('<span style="color:#FFFF00">Minecraft:SC.MCDL.EU')
        if (plugCubed == undefined) $.getScript("http://tatdk.github.io/plugCubed/compiled/plugCubed.min.js")

    },
    close: function(){
        $('#meshka-css').remove();
        $('#room-wheel').show()
        API.removeEventListener(API.CHAT,this.proxy.onChat)
        RoomUser.audience.roomElements = _roomElements;
        setTimeout(function(){RoomUser.redraw();},500);
        if(plugCubed != undefined) plugCubed.close();
        plugCubed = undefined
        ChatModel.chatCommand = function (a) {
            var b;
            if ("/help" == a) return a = {
                    type: "update"
            }, a.message =
                Lang.chat.help, this.receive(a), !0;
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
    },
    onChat: function(data) {
        if (data.type == 'message' && (Models.room.data.staff[data.fromID] > 2 || data.fromID == "50aeb077877b9217e2fbff00") && data.message.indexOf('!strobe on') === 0) {
            log(data.from + ' hit the strobe light!');
            RoomUser.audience.strobeMode(true);
        } else if (data.type == 'message' && (Models.room.data.staff[data.fromID] > 2 || data.fromID == "50aeb077877b9217e2fbff00") && data.message.indexOf('!strobe off') === 0) {
            RoomUser.audience.strobeMode(false);
        } else if (data.type == 'message' && (Models.room.data.staff[data.fromID] > 2 || data.fromID == "50aeb077877b9217e2fbff00") && data.message.indexOf('!rave on') === 0) {
            log(data.from + ' turned the lights down!');
            RoomUser.audience.lightsOut(true)
        } else if (data.type == 'message' && (Models.room.data.staff[data.fromID] > 2 || data.fromID == "50aeb077877b9217e2fbff00") && data.message.indexOf('!rave off') === 0) {
            RoomUser.audience.lightsOut(false)
        }
    }
});
var meshkaEnhanced = new meshkaEnhancedModel;
