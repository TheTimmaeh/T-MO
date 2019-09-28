module.exports = function(client, member){

  // Apply default role to new users
  member.addRole(client.config.roles.newGuildMember)
}
