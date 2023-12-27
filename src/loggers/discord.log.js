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

const token = 'MTE4OTM5OTMxMjA2MTQ0ODIyMw.G6R0B-.L_tFS8hnO1H5ZKmA-Va0leroSF2dhP-f2Ews4E'
discordClient.login(token)

discordClient.on('messageCreate', msg => {
    if (msg.author.bot) return
    if (msg.content === 'hello') {
        msg.reply(`Hello! How can I assits you today?`)
    }
})