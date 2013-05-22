(function() {
  var strobeOnCommand, Command, RoomHelper, User, afkCheck, antispam, apiHooks, beggar, chatCommandDispatcher, chatUniversals, cmds, data, hook, initEnvironment, initHooks, initialize, msToStr, populateUserData, pupOnline, settings, undoHooks, unhook,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  settings = (function() {

    function settings() {
      this.implode = __bind(this.implode, this);

      this.intervalMessages = __bind(this.intervalMessages, this);

      this.startAfkInterval = __bind(this.startAfkInterval, this);

      this.setInternalWaitlist = __bind(this.setInternalWaitlist, this);

      this.userJoin = __bind(this.userJoin, this);

      this.getRoomUrlPath = __bind(this.getRoomUrlPath, this);

      this.startup = __bind(this.startup, this);

    }

    settings.prototype.currentsong = {};

    settings.prototype.users = {};

    settings.prototype.djs = [];

    settings.prototype.mods = [];

    settings.prototype.host = [];

    settings.prototype.hasWarned = false;

    settings.prototype.currentwoots = 0;

    settings.prototype.currentmehs = 0;

    settings.prototype.currentcurates = 0;

    settings.prototype.roomUrlPath = null;

    settings.prototype.internalWaitlist = [];

    settings.prototype.userDisconnectLog = [];

    settings.prototype.voteLog = {};

    settings.prototype.seshOn = false;

    settings.prototype.forceSkip = false;

    settings.prototype.seshMembers = [];

    settings.prototype.launchTime = null;

    settings.prototype.totalVotingData = {
      woots: 0,
      mehs: 0,
      curates: 0
    };

    settings.prototype.pupScriptUrl = '';

    settings.prototype.afkTime = 12 * 60 * 1000;

    settings.prototype.songIntervalMessages = [
      {
        interval: 15,
        offset: 0,
        msg: "I'm a bot!"
      }
    ];

    settings.prototype.songCount = 0;

    settings.prototype.startup = function() {
      this.launchTime = new Date();
      return this.roomUrlPath = this.getRoomUrlPath();
    };

    settings.prototype.getRoomUrlPath = function() {
      return window.location.pathname.replace(/\//g, '');
    };

    settings.prototype.newSong = function() {
      this.totalVotingData.woots += this.currentwoots;
      this.totalVotingData.mehs += this.currentmehs;
      this.totalVotingData.curates += this.currentcurates;
      this.setInternalWaitlist();
      this.currentsong = API.getMedia();
      if (this.currentsong !== null) {
        return this.currentsong;
      } else {
        return false;
      }
    };

    settings.prototype.userJoin = function(u) {
      var userIds, _ref;
      userIds = Object.keys(this.users);
      if (_ref = u.id, __indexOf.call(userIds, _ref) >= 0) {
        return this.users[u.id].inRoom(true);
      } else {
        this.users[u.id] = new User(u);
        return this.voteLog[u.id] = {};
      }
    };

    settings.prototype.setInternalWaitlist = function() {
      var boothWaitlist, fullWaitList, lineWaitList;
      boothWaitlist = API.getDJs().slice(1);
      lineWaitList = API.getWaitList();
      fullWaitList = boothWaitlist.concat(lineWaitList);
      return this.internalWaitlist = fullWaitList;
    };

    settings.prototype.activity = function(obj) {
      if (obj.type === 'message') {
        return this.users[obj.fromID].updateActivity();
      }
    };

    settings.prototype.startAfkInterval = function() {
      return this.afkInterval = setInterval(afkCheck, 2000);
    };

    settings.prototype.intervalMessages = function() {
      var msg, _i, _len, _ref, _results;
      this.songCount++;
      _ref = this.songIntervalMessages;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        msg = _ref[_i];
        if (((this.songCount + msg['offset']) % msg['interval']) === 0) {
          _results.push(API.sendChat(msg['msg']));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    settings.prototype.implode = function() {
      var item, val;
      for (item in this) {
        val = this[item];
        if (typeof this[item] === 'object') {
          delete this[item];
        }
      }
      return clearInterval(this.afkInterval);
    };

    settings.prototype.lockBooth = function(callback) {
      if (callback == null) {
        callback = null;
      }
      return $.ajax({
        url: "http://plug.dj/_/gateway/room.update_options",
        type: 'POST',
        data: JSON.stringify({
          service: "room.update_options",
          body: [
            this.roomUrlPath, {
              "boothLocked": true,
              "waitListEnabled": true,
              "maxPlays": 1,
              "maxDJs": 5
            }
          ]
        }),
        async: this.async,
        dataType: 'json',
        contentType: 'application/json'
      }).done(function() {
        if (callback != null) {
          return callback();
        }
      });
    };

    settings.prototype.unlockBooth = function(callback) {
      if (callback == null) {
        callback = null;
      }
      return $.ajax({
        url: "http://plug.dj/_/gateway/room.update_options",
        type: 'POST',
        data: JSON.stringify({
          service: "room.update_options",
          body: [
            this.roomUrlPath, {
              "boothLocked": false,
              "waitListEnabled": true,
              "maxPlays": 1,
              "maxDJs": 5
            }
          ]
        }),
        async: this.async,
        dataType: 'json',
        contentType: 'application/json'
      }).done(function() {
        if (callback != null) {
          return callback();
        }
      });
    };

    return settings;

  })();

  data = new settings();

  User = (function() {

    User.prototype.afkWarningCount = 0;

    User.prototype.lastWarning = null;

    User.prototype["protected"] = false;

    User.prototype.isInRoom = true;

    function User(user) {
      this.user = user;
      this.updateVote = __bind(this.updateVote, this);

      this.inRoom = __bind(this.inRoom, this);

      this.notDj = __bind(this.notDj, this);

      this.warn = __bind(this.warn, this);

      this.getIsDj = __bind(this.getIsDj, this);

      this.getWarningCount = __bind(this.getWarningCount, this);

      this.getUser = __bind(this.getUser, this);

      this.getLastWarning = __bind(this.getLastWarning, this);

      this.getLastActivity = __bind(this.getLastActivity, this);

      this.updateActivity = __bind(this.updateActivity, this);

      this.init = __bind(this.init, this);

      this.init();
    }

    User.prototype.init = function() {
      return this.lastActivity = new Date();
    };

    User.prototype.updateActivity = function() {
      this.lastActivity = new Date();
      this.afkWarningCount = 0;
      return this.lastWarning = null;
    };

    User.prototype.getLastActivity = function() {
      return this.lastActivity;
    };

    User.prototype.getLastWarning = function() {
      if (this.lastWarning === null) {
        return false;
      } else {
        return this.lastWarning;
      }
    };

    User.prototype.getUser = function() {
      return this.user;
    };

    User.prototype.getWarningCount = function() {
      return this.afkWarningCount;
    };

    User.prototype.getIsDj = function() {
      var DJs, dj, _i, _len;
      DJs = API.getDJs();
      for (_i = 0, _len = DJs.length; _i < _len; _i++) {
        dj = DJs[_i];
        if (this.user.id === dj.id) {
          return true;
        }
      }
      return false;
    };

    User.prototype.warn = function() {
      this.afkWarningCount++;
      return this.lastWarning = new Date();
    };

    User.prototype.notDj = function() {
      this.afkWarningCount = 0;
      return this.lastWarning = null;
    };

    User.prototype.inRoom = function(online) {
      return this.isInRoom = online;
    };

    User.prototype.updateVote = function(v) {
      if (this.isInRoom) {
        return data.voteLog[this.user.id][data.currentsong.id] = v;
      }
    };

    return User;

  })();

  RoomHelper = (function() {

    function RoomHelper() {}

    RoomHelper.prototype.lookupUser = function(username) {
      var id, u, _ref;
      _ref = data.users;
      for (id in _ref) {
        u = _ref[id];
        if (u.getUser().username === username) {
          return u.getUser();
        }
      }
      return false;
    };

    RoomHelper.prototype.userVoteRatio = function(user) {
      var songId, songVotes, vote, votes;
      songVotes = data.voteLog[user.id];
      votes = {
        'woot': 0,
        'meh': 0
      };
      for (songId in songVotes) {
        vote = songVotes[songId];
        if (vote === 1) {
          votes['woot']++;
        } else if (vote === -1) {
          votes['meh']++;
        }
      }
      votes['positiveRatio'] = (votes['woot'] / (votes['woot'] + votes['meh'])).toFixed(2);
      return votes;
    };

    return RoomHelper;

  })();

  pupOnline = function() {
    return API.sendChat("what da deuce");
  };

  populateUserData = function() {
    var u, users, _i, _len;
    users = API.getUsers();
    for (_i = 0, _len = users.length; _i < _len; _i++) {
      u = users[_i];
      data.users[u.id] = new User(u);
      data.voteLog[u.id] = {};
    }
  };

  initEnvironment = function() {
    document.getElementById("button-vote-positive").click();
    document.getElementById("button-sound").click();
    Playback.streamDisabled = true;
    return Playback.stop();
  };

  initialize = function() {
    pupOnline();
    populateUserData();
    initEnvironment();
    initHooks();
    data.startup();
    data.newSong();
    return data.startAfkInterval();
  };

  afkCheck = function() {
    var DJs, id, lastActivity, lastWarned, now, oneMinute, secsLastActive, timeSinceLastActivity, timeSinceLastWarning, twoMinutes, user, warnMsg, _ref, _results;
    _ref = data.users;
    _results = [];
    for (id in _ref) {
      user = _ref[id];
      now = new Date();
      lastActivity = user.getLastActivity();
      timeSinceLastActivity = now.getTime() - lastActivity.getTime();
      if (timeSinceLastActivity > data.afkTime) {
        if (user.getIsDj()) {
          secsLastActive = timeSinceLastActivity / 1000;
          if (user.getWarningCount() === 0) {
            user.warn();
            _results.push(API.sendChat("@" + user.getUser().username + ", I haven't seen you chat or vote in at least 12 minutes. Are you AFK?  If you don't show activity in 2 minutes I will remove you."));
          } else if (user.getWarningCount() === 1) {
            lastWarned = user.getLastWarning();
            timeSinceLastWarning = now.getTime() - lastWarned.getTime();
            twoMinutes = 2 * 60 * 1000;
            if (timeSinceLastWarning > twoMinutes) {
              user.warn();
              warnMsg = "@" + user.getUser().username;
              warnMsg += ", I haven't seen you chat or vote in at least 14 minutes now.  This is your second and FINAL warning.  If you do not chat or vote in the next minute I will remove you.";
              _results.push(API.sendChat(warnMsg));
            } else {
              _results.push(void 0);
            }
          } else if (user.getWarningCount() === 2) {
            lastWarned = user.getLastWarning();
            timeSinceLastWarning = now.getTime() - lastWarned.getTime();
            oneMinute = 1 * 60 * 1000;
            if (timeSinceLastWarning > oneMinute) {
              DJs = API.getDJs();
              if (DJs.length > 0 && DJs[0].id !== user.getUser().id) {
                API.sendChat("@" + user.getUser().username + ", you had 2 warnings. Please stay active by chatting or voting.");
                API.moderateRemoveDJ(id);
                _results.push(user.warn());
              } else {
                _results.push(void 0);
              }
            } else {
              _results.push(void 0);
            }
          } else {
            _results.push(void 0);
          }
        } else {
          _results.push(user.notDj());
        }
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };

  msToStr = function(msTime) {
    var ms, msg, timeAway;
    msg = '';
    timeAway = {
      'days': 0,
      'hours': 0,
      'minutes': 0,
      'seconds': 0
    };
    ms = {
      'day': 24 * 60 * 60 * 1000,
      'hour': 60 * 60 * 1000,
      'minute': 60 * 1000,
      'second': 1000
    };
    if (msTime > ms['day']) {
      timeAway['days'] = Math.floor(msTime / ms['day']);
      msTime = msTime % ms['day'];
    }
    if (msTime > ms['hour']) {
      timeAway['hours'] = Math.floor(msTime / ms['hour']);
      msTime = msTime % ms['hour'];
    }
    if (msTime > ms['minute']) {
      timeAway['minutes'] = Math.floor(msTime / ms['minute']);
      msTime = msTime % ms['minute'];
    }
    if (msTime > ms['second']) {
      timeAway['seconds'] = Math.floor(msTime / ms['second']);
    }
    if (timeAway['days'] !== 0) {
      msg += timeAway['days'].toString() + 'd';
    }
    if (timeAway['hours'] !== 0) {
      msg += timeAway['hours'].toString() + 'h';
    }
    if (timeAway['minutes'] !== 0) {
      msg += timeAway['minutes'].toString() + 'm';
    }
    if (timeAway['seconds'] !== 0) {
      msg += timeAway['seconds'].toString() + 's';
    }
    if (msg !== '') {
      return msg;
    } else {
      return false;
    }
  };

  Command = (function() {

    function Command(msgData) {
      this.msgData = msgData;
      this.init();
    }

    Command.prototype.init = function() {
      this.parseType = null;
      this.command = null;
      return this.rankPrivelege = null;
    };

    Command.prototype.functionality = function(data) {};

    Command.prototype.hasPrivelege = function() {
      var user;
      user = data.users[this.msgData.fromID].getUser();
      switch (this.rankPrivelege) {
        case 'host':
          return user.permission === 5;
        case 'cohost':
          return user.permission >= 4;
        case 'mod':
          return user.permission >= 3;
        case 'manager':
          return user.permission >= 3;
        case 'bouncer':
          return user.permission >= 2;
        case 'featured':
          return user.permission >= 1;
        default:
          return true;
      }
    };

    Command.prototype.commandMatch = function() {
      var command, msg, _i, _len, _ref;
      msg = this.msgData.message;
      if (typeof this.command === 'string') {
        if (this.parseType === 'exact') {
          if (msg === this.command) {
            return true;
          } else {
            return false;
          }
        } else if (this.parseType === 'startsWith') {
          if (msg.substr(0, this.command.length) === this.command) {
            return true;
          } else {
            return false;
          }
        } else if (this.parseType === 'contains') {
          if (msg.indexOf(this.command) !== -1) {
            return true;
          } else {
            return false;
          }
        }
      } else if (typeof this.command === 'object') {
        _ref = this.command;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          command = _ref[_i];
          if (this.parseType === 'exact') {
            if (msg === command) {
              return true;
            }
          } else if (this.parseType === 'startsWith') {
            if (msg.substr(0, command.length) === command) {
              return true;
            }
          } else if (this.parseType === 'contains') {
            if (msg.indexOf(command) !== -1) {
              return true;
            }
          }
        }
        return false;
      }
    };

    Command.prototype.evalMsg = function() {
      if (this.commandMatch() && this.hasPrivelege()) {
        this.functionality();
        return true;
      } else {
        return false;
      }
    };

    return Command;

  })();

  strobeOnCommand = (function(_super) {
      
    __extends(strobeOnCommand, _super);

    function strobeOnCommand() {
        return strobeOnCommand.__super__.constructor.apply(this, arguments);
    }
    
    strobeOnCommand.prototype.init = function() {
        this.command = '/strobe on';
        this.parseType = 'exact';
        return this.rankPrivelege = 'manager';
    };

    strobeOnCommand.prototype.functionality = function() {
      return RoomUser.audience.strobeMode(true);
    }
  
    return strobeOnCommand;
    
  })(Command);

  cmds = [strobeOnCommand];
  
  chatCommandDispatcher = function(chat) {
    var c, cmd, _i, _len, _results;
    chatUniversals(chat);
    _results = [];
    for (_i = 0, _len = cmds.length; _i < _len; _i++) {
      cmd = cmds[_i];
      c = new cmd(chat);
      if (c.evalMsg()) {
        break;
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };

  antispam = function(chat) {
    var plugRoomLinkPatt, sender;
    plugRoomLinkPatt = /(\bhttps?:\/\/(www.)?plug\.dj[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
    if (plugRoomLinkPatt.exec(chat.message)) {
      sender = API.getUser(chat.fromID);
      if (!sender.ambassador && !sender.moderator && !sender.owner && !sender.superuser) {
        if (!data.users[chat.fromID]["protected"]) {
          API.sendChat("Don't spam room links you ass clown");
          return API.moderateDeleteChat(chat.chatID);
        } else {
          return API.sendChat("I'm supposed to kick you, but you're just too darn pretty.");
        }
      }
    }
  };

  beggar = function(chat) {
    var msg, r, responses;
    msg = chat.message.toLowerCase();
    responses = ["Good idea @{beggar}!  Don't earn your fans or anything thats so yesterday", "Guys @{beggar} asked us to fan him!  Lets all totally do it! ಠ_ಠ", "srsly @{beggar}? ಠ_ಠ", "@{beggar}.  Earning his fans the good old fashioned way.  Hard work and elbow grease.  A true american."];
    r = Math.floor(Math.random() * responses.length);
    if (msg.indexOf('fan me') !== -1 || msg.indexOf('fan for fan') !== -1 || msg.indexOf('fan pls') !== -1 || msg.indexOf('fan4fan') !== -1 || msg.indexOf('add me to fan') !== -1) {
      return API.sendChat(responses[r].replace("{beggar}", chat.from));
    }
  };

  chatUniversals = function(chat) {
    data.activity(chat);
    antispam(chat);
    return beggar(chat);
  };

  hook = function(apiEvent, callback) {
    return API.addEventListener(apiEvent, callback);
  };

  unhook = function(apiEvent, callback) {
    return API.removeEventListener(apiEvent, callback);
  };

  apiHooks = [
    {
      'event': API.CHAT,
      'callback': chatCommandDispatcher
    }
  ];

  initHooks = function() {
    var pair, _i, _len, _results;
    _results = [];
    for (_i = 0, _len = apiHooks.length; _i < _len; _i++) {
      pair = apiHooks[_i];
      _results.push(hook(pair['event'], pair['callback']));
    }
    return _results;
  };

  undoHooks = function() {
    var pair, _i, _len, _results;
    _results = [];
    for (_i = 0, _len = apiHooks.length; _i < _len; _i++) {
      pair = apiHooks[_i];
      _results.push(unhook(pair['event'], pair['callback']));
    }
    return _results;
  };

  initialize();

}).call(this);
