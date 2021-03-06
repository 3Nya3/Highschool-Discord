const Discord = require("discord.js");
const config = require("../botconfig.json");
const utils = require("../util/utils");


module.exports.run = async (bot, message, args) => {
    if (utils.checkDm(message)) return;

    if (!message.guild.member(bot.user).hasPermission(this.help.permission)) return utils.simpleMessage(":no_entry_sign: **I** need the **Ban Members** permission to do that", message, config.errorColor, config.tempMsgTime);
    if (!message.member.hasPermission(this.help.permission)) return utils.simpleMessage(":no_entry_sign: You need the **Ban Members** permission to do that", message, config.errorColor, config.tempMsgTime);

    let target = message.guild.member(message.mentions.users.first() || message.guild.members.cache.get(args[0]));
    if (!target) return utils.simpleMessage(":frowning2: Can't find the user", message, config.errorColor, config.tempMsgTime);
    if (target.hasPermission(this.help.permission)) return utils.simpleMessage(":warning: You can't ban someone with the permission **Ban Members**", message, config.errorColor, config.tempMsgTime);
    if (!target.bannable) return utils.simpleMessage(":thinking: I can't ban this user for some reason", message, config.errorColor, config.tempMsgTime);

    let targetIcon = target.user.avatarURL();
    let authorIcon = message.author.avatarURL();
    let moderationChannel = message.guild.channels.cache.find(channel => channel.name === config.moderationChannel);

    args.shift();
    let reason = args.join(" ");
    if (!reason) return utils.simpleMessage(":warning: You need a reason to ban someone", message, config.errorColor, config.tempMsgTime);


    let embed = new Discord.MessageEmbed()
        .setColor(`${config.embedColor}`)
        .setThumbnail(targetIcon)
        .setTitle(`**@${target.user.username} Just Got Banned!**`)
        .addField(`I have banned`, `${target.user}`, true)
        .addField(`On behalf of`, `${message.author}`, true)
        .addField("For the reason", reason);

    let moderationEmbed = new Discord.MessageEmbed()
        .setColor(`${config.embedColor}`)
        .setThumbnail(targetIcon)
        .setTitle(`**Ban**`)
        .addField("Banned User", `${target.user} with ID: ${target.user.id}`, true)
        .addField("Banned By", `${message.author} with ID: ${message.author.id}`, true)
        .addField("Ban Reason", reason)
        .addField("Ban Time", message.createdAt);

    let pmEmbed = new Discord.MessageEmbed()
        .setColor(`${config.embedColor}`)
        .setThumbnail(authorIcon)
        .setTitle(`**You Just Got Banned from the server "${message.guild.name}"**`)
        .addField("You got banned by", `${message.author}`, true)
        .addField("For the reason", reason, true)
        .addField("At", message.createdAt);

    target.user.send(pmEmbed).catch(() => {
        console.log("Failed to send pm");
    });
    try {
        moderationChannel.send(moderationEmbed);
    } catch (e) {
        console.log("Moderation channel does not exsist");
        utils.simpleMessage(`:warning: Can't find the moderation channel: "${config.moderationChannel}", detailed information about this ban won't be recorded`, message, config.errorColor);
    }
    message.channel.send(embed);
    setTimeout(() => {
        message.guild.member(target).ban();
    }, 2500);
};

module.exports.help = {
    name: "ban",
    args: "{@user} {Reason}",
    description: "Bans the target user from this server.",
    permission: "BAN_MEMBERS",
    example: `${config.prefix}ban @TestUser for being retarded, ${config.prefix}b @Ynng because why not`,
    aliases: ["ban","b"]
};