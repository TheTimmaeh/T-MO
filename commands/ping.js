module.exports = {

  // Name of the command
  name: 'ping',

  // Alternative names
  aliases: ['pong'],

  // Brief description
  description: 'Simple ping/pong command',

  // Usage example
  usage: '!ping',

  // Accessability
  // Set of 'text' or 'dm', roleIDs and userIDs, any if empty/omitted
  accessibility: ['dm'],

  // Command function
  execute: (client, message) => {

    message.channel.send(`${message.command} yourself!`)
  }
}
