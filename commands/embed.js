module.exports = {

  // Name of the command
  name: 'embed',

  // Alternative names
  aliases: [],

  // Brief description
  description: 'Add an embedded message',

  // Usage example
  usage: '!embed {...}',

  // Accessability
  // Set of 'text' or 'dm', roleIDs and userIDs, any if empty/omitted
  accessibility: [
    'text',
    'u115716278332817416' // TheTimmaeh
  ],

  // Command function
  execute: async (client, message) => {

    let embed

    try {
      embed = JSON.parse(message.content.split(/ (.+)/)[1])
    } catch(e){
      message.channel.send(`Error: ${e}`)
      return
    }

    console.log(embed)

    if(!embed) return

    message.channel.send({embed}).then(() => {
      message.delete()
    }).catch(console.error)
  }
}
