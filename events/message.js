const _ = require('lodash')

module.exports = async function(client, message){

  // Filter out non-command & bot messages
  if(!message.content.startsWith('!') || message.author.bot) return

  // Split message into command & arguments
  let [cmd, ...args] = message.content.substr(1).replace(/[,;]/g, ' ').split(/\s+/)
  cmd = cmd.toLowerCase()

  // Check for command alias
  let command = client.commands.get(cmd) || client.commands.find((c) => c.aliases && c.aliases.includes(cmd))

  // Check if command exists
  if(!command) return

  // Check if command is accessible by...
  if(command.accessibility && command.accessibility.length){

    // ...message type
    if(_.intersection(command.accessibility, ['dm', 'text']).length && !command.accessibility.includes(message.channel.type)) return

    // ...userID
    let granted
    let grantedusers = command.accessibility.filter(a => a.startsWith('u'))
    if(grantedusers.length){
      if(grantedusers.includes(`u${message.author.id}`)) granted = true
      else                                               granted = false
    }

    // ...roleID
    if(!granted){
      let grantedroles = command.accessibility.filter(a => a.startsWith('r'))
      if(grantedroles.length){
        message.member = message.member || client.guilds.get(client.config.guild).members.get(message.author.id)
        if(_.intersection(grantedroles, message.member.roles.keyArray()).length > 0) granted = true
        else                                                                         granted = false
      }
    }

    // Prevent command execution
    if(granted === false) return
  }

  // Add command and arguments to the message object
  message.command = cmd
  message.args = args

  // Execute command
  command.execute(client, message)
}
