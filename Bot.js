var Discord = require('discord.js');
var PlugAPI = require('plugapi');
var config = require('config');

/**
 * Configuration
 * https://eslachance.gitbooks.io/discord-js-bot-guide/content/getting-started/the-long-version.html
 */
var mailPlugDJ = config.get('PlugDJ.Mail');
var pwdPlugDJ = config.get('PlugDJ.Password');
var roomPlugDJ = config.get('PlugDJ.Room');
var textChannelDiscord = config.get('Discord.TextChannel');
var tokenDiscord = config.get('Discord.Token');

var client;
var channel;
var advanceFunction = function(data)
{
	if(data.media && data.currentDJ){
		var author = data.media.author;
		var title = data.media.title;
		var djUsername = data.currentDJ.username;
		if(channel){
			channel.sendMessage(djUsername + " just issued " + title + " from PlugDJ room : " + roomPlugDJ);
			channel.sendMessage("!play " + author + " " + title)
		}
	}
}
function outputSuccess(token)
{
	console.log(`Logged in. Token: ${token}`);
	channel = client.channels.get(textChannelDiscord);
}
function outputError(error)
{
	if(error){
		console.log(`There was an error : ${error}`);
		return;
	}
}

/**
 * PlugDJ Bot
 */
var botPlug = new PlugAPI({
	email: mailPlugDJ,
	password: pwdPlugDJ
});
botPlug.connect(roomPlugDJ);
botPlug.on('advance', advanceFunction);

/**
 * Discord Bot
 */
client = new Discord.Client();
var promise = client.login(tokenDiscord).then(outputSuccess, outputError)
