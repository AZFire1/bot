// Load embed module
const embed = require('@modules/embed.js')

// Load YAML module
const loadYAML = require('@modules/yaml.js')
const config = loadYAML('config')

module.exports = {
    commands: ['kick'],
    expectedArgs: 'user* reason',
    minArgs: 1,
    requiredRoles: ['Mod'],
    serverOnly: true,
    description: "Kick a member",
    callback: (client, message, arguments) => {
        let targetUser = message.mentions.members.first()
        if (!targetUser) return message.channel.send(embed('error', `Kick`, `User \`${arguments[0]}\` cannot be kicked!\n*They could not be found in this server.*`))

        let reason = arguments.slice(1).join(" ")
        if (!reason) reason = 'Unspecifed'

        if (targetUser.id === message.author.id) return message.channel.send(embed('error', `Kick`, `You cannot kick yourself!`))

        if (!targetUser.kickable) {
            return message.channel.send(embed('error', `Kick`, `User ${targetUser} cannot be kicked!\n*They might have a higher role than I do.*`))
        } else {
            targetUser.kick({ reason: `${reason}` }).catch(err => {
                return message.channel.send(embed('error', `Unknown`, `${err}`))
            })
            message.channel.send(embed('default', `User Kicked`, `User ${targetUser} was kicked!`).addFields(
                { name: 'Kicked By', value: `${message.author}`, inline: true },
                { name: 'Reason', value: `\`\`\`${reason}\`\`\``, inline: false },
            ))
        }
    },
};