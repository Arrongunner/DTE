delay();
loadDammit();
function delay() {
  setTimeout("load();", 6000);
}

function load() {
  var head = document.getElementsByTagName('head')[0];
  var script = document.createElement('script');
	script.type = 'text/javascript';
	script.src = 'http://cookies.googlecode.com/svn/trunk/jaaulde.cookies.js';
	script.onreadystatechange = function() {
		if (this.readyState == 'complete') {
    			loaded();
    		}
	}
	script.onload = readCookies;
	head.appendChild(script);
}

function loaded() {
	loaded = true
}
function loadDammit() {
	if (loaded == true) {
		readCookies();
	}
}
function readCookies() {
	var currentDate = new Date();
	currentDate.setFullYear(currentDate.getFullYear() + 1);
    	var newOptions = {
    		expiresAt: currentDate
    	}
    	jaaulde.utils.cookies.setOptions(newOptions);
    	var value = jaaulde.utils.cookies.get(COOKIE_WOOT);
    	autowoot = value != null ? value : false;
    	value = jaaulde.utils.cookies.get(COOKIE_QUEUE);
    	autoqueue = value != null ? value : false;
    	value = jaaulde.utils.cookies.set(COOKIE_STREAM);
    	stream = value != null ? value : true;
    	value = jaaulde.utils.cookies.get(COOKIE_HIDE_VIDEO);
    	hideVideo = value != null ? value : false;
	onCookiesLoaded();
}

function onCookiesLoaded() {
	if (autowoot) {
		setTimeout("$('#button-vote-positive').click();", 7000);
	}
	if (autoqueue && !isInQueue()) {
		joinQueue();
	}
	if (hideVideo) {
		$('#yt-frame').animate({'height': (hideVideo ? '0px' : '271px')}, {duration: 'fast'});
		$('#playback .frame-background').animate({'opacity': (hideVideo ? '0' : '0.91')}, {duration: 'medium'});
	}
    	initAPIListeners();
    	displayUI();
    	initUIListeners();
    	populateUserlist();
}

var words = {
"Points" : "Beats!",
"Now Playing" : "Now Spinning!",
"Time Remaining" : "Time Remaining!",
"Volume" : "Crank the Volume!",
"Current DJ" : "Disk Jockey",
"Crowd Response" : "Crowd Reaction!",
"Fans":"Stalkers!"};

String.prototype.prepareRegex = function() {
return this.replace(/([\[\]\^\&\$\.\(\)\?\/\\\+\{\}\|])/g, "\\$1");
};

function isOkTag(tag) {
return (",pre,blockquote,code,input,button,textarea".indexOf(","+tag) == -1);
}

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

var loaded = false;
var mentioned = false;
var clicked = false;
var timeToWait = 120000;
var clickWait = 5000;
var timePassed = 0;
var clickPassed = 0;
var timer = null;
var clickTimer = null;
var COOKIE_WOOT = 'autowoot';
var COOKIE_QUEUE = 'autoqueue';
var COOKIE_STREAM = 'stream';
var COOKIE_HIDE_VIDEO = 'hidevideo';
var MAX_USERS_WAITLIST = 50;

var loveMsg = ["I love this song! makes me want to jizz in my pants", "this... song... is... AWESOME!!", "this song is a BEAST!", "me likes this song me does"];
var mehMsg = ["I'm not really a fan of this song, but it's okay I guess", "this song isn't as good as others, but it could be worse"];
var hateMsg = ["I hate this song! makes me want to vomit all over myself. just kidding, but I still don't like it", "what is this god awful noise? D:", "this song... just... eww"];
var sleepMsg = ["Sleepy time!!!", "going to sleep now", "time to hit the sack", "so tired, sleep is needed me thinks", "tiredness... taking... over... must sleep"];
var workMsg = ["I'm working so mention me if I'm needed", "I'm going to do work related stuffs, mention if needed", "I'm gonna be busy, mention if needed"];
var afkMsg = ["I'm going away on a merry merry quest, be back soon!", "going AFK for a while, be back soon!", "going away, be back soon!", "going to hunt the galaxy, be back soon!"];
var backMsg = ["I'm back from my adventures!", "I'm baaacckkk", "guess who's back? ME! I'm back :D", "be-ber-ber-b-be-back!"];

var autoAwayMsg = ["I'm currently AFK", "I'm AFK", "I'm on an adventure (afk)", "gone away for a moment", "not present at keyboard"];
var autoSlpMsg = ["I'm currently sleeping", "I'm counting sheep in my dreams", "I've hit the sack", "I'm asleep", "I've gone to sleep"];
var autoWrkMsg = ["I'm currently working", "I'm busy", "doing work related stuffs"];

var styles = [
            '.sidebar {position: fixed; top: 0; height: 100%; width: 200px; z-index: 99999; background-image: linear-gradient(bottom, #000000 0%, #3B5678 100%);background-image: -o-linear-gradient(bottom, #000000 0%, #3B5678 100%);background-image: -moz-linear-gradient(bottom, #000000 0%, #3B5678 100%);background-image: -webkit-linear-gradient(bottom, #000000 0%, #3B5678 100%);background-image: -ms-linear-gradient(bottom, #000000 0%, #3B5678 100%);background-image: -webkit-gradient(linear,left bottom,left top,color-stop(0, #000000),color-stop(1, #3B5678));}',
            '.sidebar#side-right {right: -190px;z-index: 99999;}',
            '.sidebar#side-left {left: -190px; z-index: 99999; }',
            '.sidebar-handle {width: 12px;height: 100%;z-index: 99999;margin: 0;padding: 0;background: rgb(96, 141, 197);box-shadow: 0px 0px 15px 0px rgba(0, 0, 0, .9);cursor: "ne-resize";}',
            '.sidebar-handle span {display: block;position: absolute;width: 10px;top: 50%;text-align: center;letter-spacing: -1px;color: #000;}',
            '.sidebar-content {position: absolute;width: 185px;height: 100%; padding-left: 15px}',
            '.sidebar-content2 {position: absolute;width: 185px;height: 100%;}',
            '.sidebar-content2 h3 {font-weight: bold; padding-left: 5px; padding-bottom: 5px; margin: 0;}',
            '.sidebar-content2 a {font-weight: bold; font-size: 13px; padding-left: 5px;}',
            '#side-right .sidebar-handle {float: left;}',
            '#side-left .sidebar-handle {float: right;}',
            '#side-right a {display: block;min-width: 100%;cursor: pointer;padding: 4px 5px 8px 5px;border-radius: 4px;font-size: 13px;}',
            '.sidebar-content2 span {display: block; min-width: 94%;cursor: pointer;border-radius: 4px; padding: 0 5px 0 5px; font-size: 12px;}',
            '#side-right a span {padding-right: 8px;}',
            '#side-right a:hover {background-color: rgba(97, 146, 199, 0.65);text-decoration: none;}',
            '.sidebar-content2 span:hover {background-color: rgba(97, 146, 199, 0.65);text-decoration: none;}',
            '.sidebar-content2 a:hover {text-decoration: none;}',
            'html{background: url("http://i.imgur.com/a75C9wE.jpg") no-repeat scroll center top #000000;}',
            '#room-wheel {z-index: 2;position: absolute;top: 2px;left: 0;width: 1044px;height: 394px;background: url(http://) no-repeat;display: none;}',
            '.chat-bouncer {background: url(http://i.imgur.com/9qWWO4L.png) no-repeat 0 5px;padding-left: 17px;width: 292px;}',
            '.chat-manager{background: url(http://i.imgur.com/hqqhTcp.png) no-repeat 0 5px;padding-left: 17px;width: 292px;}',
            '.chat-cohost {background: url(https://dl.dropbox.com/u/67634625/chat-bouncer-icon.png) no-repeat 0 5px;padding-left: 17px;width:292px;}',
            '.chat-host{background: url(https://dl.dropbox.com/u/67634625/chat-bouncer-icon.png) no-repeat 0 5px;padding-left: 17px;width: 292px;}',
            '#dj-console, #dj-console {background-image: url(http://s8.postimage.org/wpugb8gc5/Comp_2.gif);min-height:33px;min-width:131px;}',
            '.chat-from-you{color: #0099FF;font-weight: bold;margin-top: 0px; padding-top: 0px;}',
            '.chat-from-bouncer{color: #800080; font-weight: bold; margin-top: 0px; padding-top: 0px;}',
            '.chat-from-manager{color: #FFDAB9; font-weight: bold; margin-top: 0px; padding-top: 0px;}',
            '.chat-from-cohost{color: #FF4500; font-weight: bold; margin-top: 0px; padding-top: 0px;}',
            '.chat-from-host{color: #32CD32;font-weight: bold;margin-top: 0px; padding-top: 0px;}',
            '#user-points-title{color: #FFFFFF; position: absolute; left: 36px; font-size: 10px;}',
            '#user-fans-title{color: #FFFFFF; position: absolute; left: 29px; font-size: 10px;}',
            '.meta-header span{color: rgba(255, 255, 255, 0.79); position: absolute; left: 15px; font-size: 10px;}',
            '#button-lobby {background-image: url("http://i.imgur.com/brpRaSY.png");}',
            '#volume-bar-value{background-image: url("http://i.imgur.com/xmyonON.png") ;}',
            '#hr-div {;height: 100%;width: 100%;margin: 0;padding-left: 12px;}',
            '#hr2-div2 {;height: 100%;width: 100%;margin: 0;}',
            '#hr-style {position: absolute;display: block;height: 20px;width: 100%;bottom: 0%;background-image: url("http://i.imgur.com/gExgamX.png");}',
            '#hr2-style2 {position: absolute;display: block;height: 20px;width: 94%%;bottom: 0%;background-image: url("http://i.imgur.com/gExgamX.png");}',
            '#side-left h3 {padding-left: 5px}',
];

var scripts = [
            "(function($){$.fn.hoverIntent=function(f,g){var cfg={sensitivity:7,interval:100,timeout:0};cfg=$.extend(cfg,g?{over:f,out:g}:f);var cX,cY,pX,pY;var track=function(ev){cX=ev.pageX;cY=ev.pageY};var compare=function(ev,ob){ob.hoverIntent_t=clearTimeout(ob.hoverIntent_t);if((Math.abs(pX-cX)+Math.abs(pY-cY))<cfg.sensitivity){$(ob).unbind('mousemove',track);ob.hoverIntent_s=1;return cfg.over.apply(ob,[ev])}else{pX=cX;pY=cY;ob.hoverIntent_t=setTimeout(function(){compare(ev,ob)},cfg.interval)}};var delay=function(ev,ob){ob.hoverIntent_t=clearTimeout(ob.hoverIntent_t);ob.hoverIntent_s=0;return cfg.out.apply(ob,[ev])};var handleHover=function(e){var ev=jQuery.extend({},e);var ob=this;if(ob.hoverIntent_t){ob.hoverIntent_t=clearTimeout(ob.hoverIntent_t)}if(e.type=='mouseenter'){pX=ev.pageX;pY=ev.pageY;$(ob).bind('mousemove',track);if(ob.hoverIntent_s!=1){ob.hoverIntent_t=setTimeout(function(){compare(ev,ob)},cfg.interval)}}else{$(ob).unbind('mousemove',track);if(ob.hoverIntent_s==1){ob.hoverIntent_t=setTimeout(function(){delay(ev,ob)},cfg.timeout)}}};return this.bind('mouseenter',handleHover).bind('mouseleave',handleHover)}})(jQuery);",
            'if (jQuery.easing.easeOutQuart === undefined) jQuery.easing.easeOutQuart = function (a,b,c,d,e) { return -d*((b=b/e-1)*b*b*b-1)+c; }',
            '$("#side-right")',
            '    .hoverIntent(function() {',
            '        var timeout_r = $(this)',
            '            .data("timeout_r");',
            '        if (timeout_r) {',
            '            clearTimeout(timeout_r);',
            '        }',
            '        $(this)',
            '            .animate({',
            '                "right": "0px"',
            '            }, 300, "easeOutQuart");',
            '    }, function() {',
            '        $(this)',
            '            .data("timeout_r", setTimeout($.proxy(function() {',
            '            $(this)',
            '                .animate({',
            '                    "right": "-190px"',
            '                }, 300, "easeOutQuart");',
            '       }, this), 500));',
            '    });',
            '$("#side-left")',
            '    .hoverIntent(function() {',
            '        var timeout_r = $(this)',
            '            .data("timeout_r");',
            '        if (timeout_r) {',
            '            clearTimeout(timeout_r);',
            '        }',
            '        $(this)',
            '            .animate({',
            '                "left": "0px"',
            '            }, 300, "easeOutQuart");',
            '    }, function() {',
            '        $(this)',
            '            .data("timeout_r", setTimeout($.proxy(function() {',
            '            $(this)',
            '                .animate({',
            '                    "left": "-190px"',
            '                }, 300, "easeOutQuart");',
            '       }, this), 500));',
            '    });'
];

function initAPIListeners() {
	API.addEventListener(API.DJ_ADVANCE, djAdvanced);
  	API.addEventListener(API.CHAT, autoRespond);
  	API.addEventListener(API.DJ_UPDATE, queueUpdate);
  	API.addEventListener(API.VOTE_UPDATE, function (obj) {
            	populateUserlist();

    	});
	API.addEventListener(API.USER_JOIN, function (user) {
          	populateUserlist();
    	});
    	API.addEventListener(API.USER_LEAVE, function (user) {
            	populateUserlist();
    	});
}

function displayUI() {
  $('#side-right .sidebar-content').append(
			'<a id="plug-btn-woot" title="toggles auto woot" style="color:#ED1C24">auto woot</a>'
		+ 	'<a id="plug-btn-queue" title="toogles auto queue" style="color:#ED1C24">auto queue</a>'
		+ 	'<a id="plug-btn-stream" title="toggles video stream" style="color:#3FFF00">stream</a>'
		+ 	'<a id="plug-btn-hidevideo" title="toggles hide video" style="color:#ED1C24">hide video</a>'
		+	'<a  onclick="rules()" title="displays rules" style="color:#0000FF">rules</a>'
		+	'<a id="plug-btn-lovesong" title="sends love song message" style="color:#FF8C00">loves this song</a>'
		+	'<a id="plug-btn-mehsong" title="sends not fan of song message" style="color:#FF8C00">not fan of song</a>'
		+	'<a id="plug-btn-hatesong" title="sends hate song message" style="color:#FF8C00">hates this song</a>'
		+	'<a id="plug-btn-sleeping" title="sends sleep message and sets status to sleeping" style="color:#FF8C00">sleeping</a>'
		+	'<a id="plug-btn-working" title="sends work message and sets status to working" style="color:#FF8C00">working</a>'
		+	'<a id="plug-btn-afk" title="sends afk message and sets status to afk" style="color:#FF8C00">afk</a>'
		+	'<a id="plug-btn-back" title="sends available message and sets status to available" style="color:#FF8C00">available</a>'
    );
}

function initUIListeners() {
	$("#plug-btn-woot").on("click", function() {
		autowoot = !autowoot;
		$(this).css("color", autowoot ? "#3FFF00" : "#ED1C24");
		if (autowoot) {
			setTimeout("$('#button-vote-positive').click();", 7000);
		}
		jaaulde.utils.cookies.set(COOKIE_WOOT, autowoot);
	});
	$("#plug-btn-queue").on("click", function() {
		autoqueue = !autoqueue;
        	$(this).css('color', autoqueue ? '#3FFF00' : '#ED1C24');
        	if (autoqueue && !isInQueue()) {
        		joinQueue();
        	}
        	jaaulde.utils.cookies.set(COOKIE_QUEUE, autoqueue);
	});
	$("#plug-btn-stream").on("click", function() {
		stream = !stream;
		$(this).css("color", stream ? "#3FFF00" : "#ED1C24");
		if (stream == true) {
			API.sendChat("/stream on");
		} else { 
			API.sendChat("/stream off");
		}
		jaaulde.utils.cookies.set(COOKIE_STREAM, stream);
	});
	$("#plug-btn-hidevideo").on("click", function() {
		hideVideo = !hideVideo;
		$(this).css("color", hideVideo ? "#3FFF00" : "#ED1C24");
		$("#yt-frame").animate({"height": (hideVideo ? "0px" : "271px")}, {duration: "fast"});
		$("#playback .frame-background").animate({"opacity": (hideVideo ? "0" : "0.91")}, {duration: "medium"});
		jaaulde.utils.cookies.set(COOKIE_HIDE_VIDEO, hideVideo);
	});
	$("#plug-btn-lovesong").on("click", function() {
  	if (clicked == false) {
			clicked = true;
			clickTimer = setInterval(function() {checkClicked()}, 1000);
			API.sendChat(loveMsg[Math.floor(Math.random() * loveMsg.length)]);
		}
	});
	$("#plug-btn-mehsong").on("click", function() {
		if (clicked == false) {
			clicked = true;
			clickTimer = setInterval(function() {checkClicked()}, 1000);
			API.sendChat(mehMsg[Math.floor(Math.random() * mehMsg.length)]);
		}
	});
	$("#plug-btn-hatesong").on("click", function() {
		if (clicked == false) {
			clicked = true;
			clickTimer = setInterval(function() {checkClicked()}, 1000);
			API.sendChat(hateMsg[Math.floor(Math.random() * hateMsg.length)]);
		}
	});
	$("#plug-btn-sleeping").on("click", function() {
		if (clicked == false) {
			clicked = true;
			clickTimer = setInterval(function() {checkClicked()}, 1000);
			if (Models.user.data.status != 3) {
				API.sendChat(sleepMsg[Math.floor(Math.random() * sleepMsg.length)]);
				Models.user.changeStatus(3);
			}
		}
	});
	$("#plug-btn-working").on("click", function() {
		if (clicked == false) {
			clicked = true;
			clickTimer = setInterval(function() {checkClicked()}, 1000);
			if (Models.user.data.status != 2) {
				API.sendChat(workMsg[Math.floor(Math.random() * workMsg.length)]);
				Models.user.changeStatus(2);
			}
		}
	});	
	$("#plug-btn-afk").on("click", function() {
		if (clicked == false) {
			clicked = true;
			clickTimer = setInterval(function() {checkClicked()}, 1000);
			if (Models.user.data.status != 1) {
				API.sendChat(afkMsg[Math.floor(Math.random() * afkMsg.length)]);
				Models.user.changeStatus(1);
			}
		}
	});
	$("#plug-btn-back").on("click", function() {
		if (clicked == false) {
			clicked = true;
			clickTimer = setInterval(function() {checkClicked()}, 1000);
			if (Models.user.data.status != 0) {
				API.sendChat(backMsg[Math.floor(Math.random() * backMsg.length)]);
				Models.user.changeStatus(0);
			}
		}
	});
}

function queueUpdate() {
	if (autoqueue && !isInQueue()) {
		joinQueue();
    	}
}

function isInQueue() {
	var self = API.getSelf();
    	return API.getWaitList().indexOf(self) !== -1 || API.getDJs().indexOf(self) !== -1;
}

function joinQueue() {
	if ($('#button-dj-play').css('display') === 'block') {
		$('#button-dj-play').click();
    	} 
	else if (API.getWaitList().length < MAX_USERS_WAITLIST) {
        API.waitListJoin();
    	}
}

function autoRespond(data) {
	var a = data.type == "mention" && Models.room.data.staff[data.fromID] && Models.room.data.staff[data.fromID] >= Models.user.BOUNCER, b = data.message.indexOf('@') >0;
	if (data.type == "mention" && mentioned == false) {
		if (API.getUser(data.fromID).status == 0) {
			mentioned = true;
			timer = setInterval("checkMentioned();", 1000);
			if (Models.user.data.status == 1) {
				API.sendChat("@" + data.from + " automsg: " + autoAwayMsg[Math.floor(Math.random() * autoAwayMsg.length)]);
			}
			if (Models.user.data.status ==2) {
				API.sendChat("@" + data.from + " automsg: " + autoWrkMsg[Math.floor(Math.random() * autoWrkMsg.length)]);
			}
			if (Models.user.data.status ==3) {
				API.sendChat("@" + data.from + " automsg: " + autoSlpMsg[Math.floor(Math.random() * autoSlpMsg.length)]);
			}
		}
	}
}

function djAdvanced(obj) {
	if (hideVideo) {
		$("#yt-frame").css("height", "0px");
		$("#playback .frame-background").css("opacity", "0.0");
	}
	if (autowoot) {
		setTimeout("$('#button-vote-positive').click();", 7000);
	}
}

function populateUserlist() {
	var mehlist = '';
    	var wootlist = '';
    	var undecidedlist = '';
	var a = API.getUsers();
    	var totalMEHs = 0;
    	var totalWOOTs = 0;
    	var totalUNDECIDEDs = 0;
    	var str = '';
	var users = API.getUsers();
	var myid = API.getSelf();
	for (i in a) {
        	str = '<span class="chat-from-clickable ';
        	if (typeof (a[i].admin) !== 'undefined' && a[i].admin == true) {
            		str += 'chat-from-admin ';
        	} else if (typeof (a[i].ambassador) !== 'undefined' && a[i].ambassador == true) {
            		str += 'chat-from-ambassador ';
        	}
        	if (typeof (a[i].owner) !== 'undefined' && a[i].owner != false) {
            		str += 'chat-from-host ';
        	}else if (typeof (a[i].BOUNCER) !== 'undefined' && a[i].bouncer == true ) {
            		str += 'chat-from-bouncer ';
        	}
        	if (a[i].id === myid) {
            		str += 'chat-from-cohost ';
        	}
        	str += '" onclick="$(\'#chat-input-field\').val($(\'#chat-input-field\').val() + \'@' + a[i].username + ' \').focus();" ">' + a[i].username + '</span>';
        	if (typeof (a[i].vote) !== 'undefined' && a[i].vote == -1) {
            		totalMEHs++;
            		mehlist += str; 
        	} else if (typeof (a[i].vote) !== 'undefined' && a[i].vote == +1) {
            		totalWOOTs++;
            		wootlist += str; 
        	} else {
            		totalUNDECIDEDs++;
            		undecidedlist += str; 
        	}
    	}
    	var totalDECIDED = totalWOOTs + totalMEHs;
    	var totalUSERS = totalDECIDED + totalUNDECIDEDs;
    	var totalMEHsPercentage = Math.round((totalMEHs / totalUSERS) * 100);
    	var totalWOOTsPercentage = Math.round((totalWOOTs / totalUSERS) * 100);
    	if (isNaN(totalMEHsPercentage) || isNaN(totalWOOTsPercentage)) {
        	totalMEHsPercentage = totalWOOTsPercentage = 0;
    	}
	mehlist = ' ' + totalMEHs.toString() + ' (' + totalMEHsPercentage.toString() + '&#37;)' + mehlist;
    	wootlist = ' ' + totalWOOTs.toString() + ' (' + totalWOOTsPercentage.toString() + '&#37;)' + wootlist;
    	undecidedlist = ' ' + totalUNDECIDEDs.toString() + undecidedlist;
	if ($('#side-left .sidebar-content').children().length > 0) {
            	$('#side-left .sidebar-content2').append();
	}
        $('#side-left .sidebar-content2').html('<h3 class="users">users: ' + API.getUsers().length + '</h3>');
        var spot = Models.room.getWaitListPosition();
        var waitlistDiv = $('<h3></h3>').addClass('waitlistspot').text('waitlist: ' + (spot !== null ? spot + ' / ' : '') + Models.room.data.waitList.length);
        $('#side-left .sidebar-content2').append(waitlistDiv);
        $('#side-left .sidebar-content2').append('<div class="meanlist"></div>');
        $(".meanlist").append( 
        	 	'<div id="mehlist_div" style="border:1px solid rgb(233,6,6);"><a>meh list:</a>' + mehlist + '</div>' 
        	+ 	'<div id="wootlist_div" style="border:1px solid rgb(2,140,7);"><a>woot list:</a>' + wootlist + '</div>'
        );
}

function checkMentioned() {
	if(timePassed >= timeToWait) {
		clearInterval(timer);
		mentioned = false;
		timePassed = 0;
	}
	else {
		timePassed = timePassed + 1000;
	}
}

function checkClicked() {
	if (clickPassed >= clickWait) {
		clearInterval(clickTimer);
		clicked = false;
		clickPassed = 0;
	}
	else {
		clickPassed = clickPassed + 1000;
	}
}

$('#plugbot-css').remove();
$('#plugbot-js').remove();
$('#chat-messages').append('<div class="chat-update"><span class="chat-text">Also, welcome to Dubstep, Techno, and Electro custom scipt, coded by Nitro Ghost. Version: 4.1.3</span></div>');
$('body').prepend('<style type="text/css" id="plug-css">' + "\n" + styles.join("\n") + "\n" + '</style>');
$('body').append('</div><div id="side-right" class="sidebar">' +
'    <div class="sidebar-handle"><span>|||</span></div>' +
'    <div class="sidebar-content"></div>' +
'    <div id="hr-div"><div><div id="hr-style"></div></div></div>' +
'</div><div id="side-left" class="sidebar">' +
'    <div class="sidebar-handle"><span>|||</span></div>' +
'    <div class="sidebar-content2"></div>' +
'    <div id="hr2-div2"><div><div id="hr2-style2"></div></div></div>' +
'</div>');
$('body').append('<script type="text/javascript" id="plug-js-extra">' + "\n" + scripts.join("\n") + "\n" + '</script>');
