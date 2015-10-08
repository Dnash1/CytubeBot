var api = require("./apiclient")
var utils = require("./utils")

/*  This is useful for quick and dirty custom commands
	This file won't be changed much over the course of time
	See chatcommands.js for examples on how to add commands
	All functions should have the signature function(bot, username, data, fromIRC)
	bot is a reference to the current bot and all of its properties and methods
	username is the username of the user who is calling the command
	data is all the information given after the command
	fromIRC is if the command comes from irc
 */

// Add commands here

var gameArray = [];

var customHandlers = {
    "roll": function(bot, username, data, fromIRC) {
        var inp = data.split("d");
        var dice = [];
        var total = 0;
        for (var i = 0; i < inp[0]; i++) {
            var x = Math.floor(Math.random() * (inp[1] - 1 + 1)) + 1;
            dice.push(x);
            total += x;
        }
        bot.sendChatMsg(username + " rolled " + inp[0] + " " + inp[1] + "-sided dice: " + dice + " for a total of " + total);
    },

    "games": function(bot, username, data, fromIRC) {
        bot.sendChatMsg("Listing all games:");
        for (var i = 0; i < gameArray.length; i++) {
            bot.sendChatMsg(gameArray[i].name);
        }
    },

    "addgame": function(bot, username, data, fromIRC) {
        gameArray.push({name: data, players: []});
    }
}

// Shouldn't need to modify things past this point

var customHandlerList = [];
for (var key in customHandlers) {
    customHandlerList.push({
        re: new RegExp("^\\$" + key + "(?:\\s|$)"),
        fn: customHandlers[key]
    });
}

function handle(bot, username, msg, fromIRC) {
    for (var i = 0; i < customHandlerList.length; i++) {
        var h = customHandlerList[i];
        if (msg.match(h.re)) {
            var rest;
            if (msg.indexOf(" ") >= 0) {
                rest = msg.substring(msg.indexOf(" ") + 1);
            } else {
                rest = "";
            }
            return h.fn(bot, username, rest, fromIRC);
        }
    }
}

exports.handle = handle
