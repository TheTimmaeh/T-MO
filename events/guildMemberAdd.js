module.exports = function(client, member){

  // Apply default role to new users
  member.addRole(config.roles.newGuildMember)
}
