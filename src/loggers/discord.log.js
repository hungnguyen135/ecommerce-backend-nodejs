'use strict'

const {Client, GatewayIntentBits} = require('discord.js')
const {DISCORD_TOKEN} = process.env

const discordClient = new Client({
    intents: [
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ]
})

discordClient.on('ready', () => {
    console.log(`Logged is as ${discordClient.user.tag}`);
})

// discordClient.login(DISCORD_TOKEN)

discordClient.on('messageCreate', msg => {
    if (msg.author.bot) return
    if (msg.content === 'hello') {
        msg.reply(`Hello! How can I assits you today?`)
    }
})