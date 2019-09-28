module.exports = {

  // Name of the command
  name: 'modify',

  // Alternative names
  aliases: [],

  // Brief description
  description: 'Post a message via the bot',

  // Usage example
  usage: '!modify [message] [text]',

  // Accessability
  // Set of 'text' or 'dm', roleIDs and userIDs, any if empty/omitted
  accessibility: [
    'text',
    'u115716278332817416' // TheTimmaeh
  ],

  // Command function
  execute: async (client, message) => {

    let msg = message.content.split(/ (.+)/)[1]
    if(msg.length < 1) return

    message.channel.send(msg).then(() => {
      message.delete()
    }).catch(console.error)
  }
}
