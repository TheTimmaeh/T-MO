const fs = require('fs')
const _ = require('lodash')

// Discord
const Discord = require('discord.js')
const client = new Discord.Client()

// LowDB
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('db.json')
client.db = require('lowdb')(adapter)
client.db.defaults({reactions: {}, invertedreactions: {}}).write()

// Config
client.config = require('./config')

// Config
client.markdown = require('./markdown')

// Commands
client.commands = new Discord.Collection()
fs.readdirSync('./commands').filter((file) => file.endsWith('.js')).forEach((file) => {
  let cmd = require(`./commands/${file}`)
  console.log(`Found command ${cmd.name}`)
  client.commands.set(cmd.name, cmd)
})

// Events
fs.readdirSync('./events').filter((file) => file.endsWith('.js')).forEach((file) => {
  let event = require(`./events/${file}`)
  client.on(file.split('.')[0], (...args) => event(client, ...args))
})

// Process error handler
process.on('uncaughtException', (err) => {
  const errorMsg = (err ? err.stack || err : '').toString().replace(new RegExp(`${__dirname}\/`, 'g'), './')

  console.log(errorMsg)
  process.exit(1)
})

process.on('unhandledRejection', async (src) => {
  if(src instanceof Error){
    logError(`Uncaught Promise error: \nMessage: ${src.message}\nStack:${src.stack}`)
    process.exit(1)
  }
})

// Bot initialisation
client.login(client.config.token)
