// Load embed module
const embed = require('@modules/embed.js')

// Load YAML module
const loadYAML = require('@modules/yaml.js')
const config = loadYAML('config')

module.exports = {
    commands: ['tempban', 'tempoban', 'temp-ban', 'tempo-ban', 'temporaryban', 'temporary-ban'],
    expectedArgs: 'user* length* reason',
    minArgs: 2,
    requiredRoles: ['Mod'],
    serverOnly: true,
    description: "Temporarily ban a member",
    callback: (client, message, arguments) => {
        let targetUser = message.mentions.members.first()
        if (!targetUser) return message.channel.send(embed('error', `Temp Ban`, `User \`${arguments[0]}\` cannot be temporarily banned!\nThey could not be found in this server.`))

        let length = parseInt(arguments[1])
        if (length < 1 || length > 7) return message.channel.send(embed('error', `Temp Ban`, `Ban duration cannot be shorter than **1 day** and longer than **7 days**!`))
        let reason = arguments.slice(2).join(" ")
        if (!reason) reason = 'Unspecifed'

        if (targetUser.id === message.author.id) return message.channel.send(embed('error', `Temp Ban`, `You cannot temporarily ban yourself!`))
        
        if (!targetUser.bannable) {
            return message.channel.send(embed('error', `Temp Ban`, `User ${targetUser} cannot be temporarily banned!\n*They might have a higher role than I do.*`))
        } else {
            targetUser.ban({ days: length, reason: `${reason}` }).catch(err => {
                return message.channel.send(embed('error', `Unknown`, `${err}`))
            })
            message.channel.send(embed('default', `User Temp Banned`, `User ${targetUser} was temporarily banned!`).addFields(
                { name: 'Banned By', value: `${message.author}`, inline: true },
                { name: 'Length', value: `\`\`\`${arguments[0]} days\`\`\``, inline: true },
                { name: 'Reason', value: `\`\`\`${reason}\`\`\``, inline: false },
            ))
        }
    },
};