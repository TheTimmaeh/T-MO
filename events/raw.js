module.exports = async function(client, packet){

  // Filter out non-reaction packets
  if(!['MESSAGE_REACTION_ADD', 'MESSAGE_REACTION_REMOVE'].includes(packet.t)

  // Filter out reactions for messages we don't track
  || !(client.db.get(`reactions['${packet.d.message_id}']`).value()

  // Filter out inverted reactions for messages we don't track
  || client.db.get(`invertedreactions['${packet.d.message_id}']`).value())) return

  let guild = client.guilds.get(client.config.guild)
  let member = guild.members.get(packet.d.user_id)

  // Filter out bot reactions
  if(member.user.bot) return

  let channel = client.channels.get(packet.d.channel_id)

  channel.fetchMessage(packet.d.message_id).then((message) => {
    let emoji = packet.d.emoji.name //(packet.d.emoji.id ? `${packet.d.emoji.name}:${packet.d.emoji.id}` : packet.d.emoji.name)
    let role = client.db.get(`reactions['${message.id}']['${emoji}']`).value()
    let inverted = false

    // Search for inverted roles
    if(!role){
      role = client.db.get(`invertedreactions['${message.id}']['${emoji}']`).value()

      // Filter out reactions we don't track
      if(!role) return

      inverted = true
    }

    // Add role to user
    if(packet.t === (!inverted ? 'MESSAGE_REACTION_ADD' : 'MESSAGE_REACTION_REMOVE')){
      member.addRole(role).then(() => {
        console.log(`Role React: Added ${member.user.username}#${member.user.discriminator} to ${guild.roles.get(role).name}`)
      }).catch(console.error)

    // Remove role from user
    } else if(packet.t === (!inverted ? 'MESSAGE_REACTION_REMOVE' : 'MESSAGE_REACTION_ADD')){
      member.removeRole(role).then(() => {
        console.log(`Role React: Removed ${member.user.username}#${member.user.discriminator} from ${guild.roles.get(role).name}`)
      }).catch(console.error)
    }
  })
}
