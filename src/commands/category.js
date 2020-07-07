// TODO: UPDATE WHAT CATEGORY USERS RECEIVE STREAM UPDATES FROM
const db = require('monk')(process.env.MONGODB_URI)
const collection = db.get('document')
const Discord = require('discord.js');
const getGameID = require('../TwitchFetch/getGameID')

module.exports = {
  name: 'categoryUpdate',
  description: 'Change the category for your updates',
  usage: '!category <new category>',
  aliases: ['category'],
  args: true,
  cooldown: 5,
  async execute(message, args) {
    let serverID = message.guild.id
    let gameName = args.join(' ')
    let gameLink = args.join('%20')
    let gameID = await getGameID(gameLink)
    if (gameID.length) {
      collection.update({ ServerID: serverID }, { $set: { Category: gameID } }).then(() => {
        const successMessage = new Discord.MessageEmbed()
          .setColor('#2ecc71')
          .setTitle(`Successfully changed your category to ${gameName}`)
          .setURL(`https://www.twitch.tv/directory/game/${gameLink}`)
        message.channel.send(successMessage)
        db.close()
      })
    } else {
      const errorMessage = new Discord.MessageEmbed()
        .setColor('#e74c3c')
        .setTitle('This category doesn\'t exist')
      return message.channel.send(errorMessage)
    }
  },
};
