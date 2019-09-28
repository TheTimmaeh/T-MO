module.exports = {

  // Name of the command
  name: 'addrolereact',

  // Alternative names
  aliases: ['addrolereaction'],

  // Brief description
  description: 'Add a message/reaction to grant roles',

  // Usage example
  usage: '!addrolereact {"message": "<Message ID>", "emoji": "<Emoji>", "role": "<Role ID>"}',

  // Accessability
  // Set of 'text' or 'dm', roleIDs and userIDs, any if empty/omitted
  accessibility: [
    'dm',
    'u115716278332817416' // TheTimmaeh
  ],

  // Command function
  execute: async (client, message) => {

    // Parse options
    let options

    try {
      options = JSON.parse(message.content.split(/ (.+)/)[1])
    } catch(e){
      message.channel.send(`Error: ${e}`)
      return
    }

    // Transform object into array
    if(!(options instanceof Array)) options = [options]

    // Iterate through each options object
    for(let o of options){

      // Check for required options
      if(!o.message || !o.emoji || !o.role) continue

      // Parse message link
      if(!o.channel){
        let link = /(\d{17,18})\/(\d{17,18})\/(\d{17,18})$/.exec(o.message)
        if(link) o.link = o.message, o.channel = link[2], o.message = link[3]
        else continue
      } else {
        o.link = `https://discordapp.com/channels/${client.config.guild}/${o.channel}/${o.message}`
      }

      // Check if role exists
      o.role = client.guilds.get(client.config.guild).roles.get(o.role)
      if(!o.role){
        message.channel.send('Role not found.')
        continue
      }

      // Check if channel exists
      let targetchannel = client.channels.get(o.channel)
      if(!targetchannel){
        message.channel.send('Channel not found.')
        continue
      }

      // Check if message exists
      let targetmessage

      try {
        targetmessage = await targetchannel.fetchMessage(o.message)
      } catch(e){
        if(e.message !== 'Unknown Message') console.error(e)
      }

      if(!targetmessage){
        message.channel.send('Message not found.')
        continue
      }

      let emoji = client.emojis.find(e => e.name === o.emoji || e.id === o.emoji || e.toString() === o.emoji)
      if(!emoji){
        message.channel.send('Emoji not found.')
        continue
      }

      o.inverted = o.inverted || false

      // Save Role React in DB
      try {
        client.db.get((!o.inverted ? 'reactions' : 'invertedreactions')).set(`${o.message}.${emoji.name}`, o.role.id).write()
      } catch(e){
        console.error(e)
        continue
      }

      // React with emoji to message
      await targetmessage.react(emoji).then(() => {

        // Notify user
        message.channel.send(`Role React added for role ${(message.channel.type == 'text' ? `<@${o.role.id}>` : client.markdown.code + o.role.name + client.markdown.code)}, emoji ${emoji.toString()}, message <${o.link}> & inverted ${o.inverted}`)
      })

      await sleep(500)
    }

    if(message.channel.type == 'text') message.delete()
  }
}

const sleep = (ms = 0) => new Promise((r) => setTimeout(r, ms))
