const config = require("../botconfig.json");
const utils = require("../util/utils");


module.exports.run = async (bot, message, args) => {
  if (utils.checkDm(message)) return;
  if (!message.guild.member(bot.user).hasPermission(this.help.permission)) return utils.simpleMessage(":no_entry_sign: I don't have the permission to **Manage Channels**", message, config.errorColor, config.tempMsgTime);
  if (!message.member.hasPermission(this.help.permission)) return utils.simpleMessage(":no_entry_sign: You don't have the permission to **Manage Channels**", message, config.errorColor, config.tempMsgTime);

  var messageCount = args[0];
  if (!messageCount) return utils.simpleMessage(":warning: Please enter the number of messages to remove", message, config.errorColor, config.tempMsgTime);
  messageCount = Number(messageCount);
  if (!messageCount || messageCount < 1 || messageCount > 99) return utils.simpleMessage(":warning: Please enter a integer number between 1 and 99", message, config.errorColor, config.tempMsgTime);

  message.channel.bulkDelete(messageCount + 1);
  utils.simpleMessage(`:ok_hand: Removed ${messageCount} messages from #${message.channel.name}`, message, config.embedColor);
};

module.exports.help = {
  name: "wipe",
  args: "{# of messages}",
  permission: "MANAGE_MESSAGES",
  description: "Wipes the specified number (1~99) of messages in the current channel",
  example: `${config.prefix}wipe 10, ${config.prefix}remove 2, ${config.prefix}w 5`,
  aliases: ["wipe", "w", "remove", "clear", "c"]
};