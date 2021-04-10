// Load embed module
const embed = require('@modules/embed.js')

// Load YAML module
const loadYAML = require('@modules/yaml.js')
const config = loadYAML('config')

module.exports = {
    commands: ['unban', 'unpermban', 'unperm-ban', 'unpermaban', 'unperma-ban', 'untempban', 'untempoban', 'untemp-ban', 'untempo-ban', 'untemporaryban', 'untemporary-ban'],
    expectedArgs: 'userID* reason',
    minArgs: 1,
    requiredRoles: ['Mod'],
    serverOnly: true,
    description: "Unban a member",
    callback: (client, message, arguments) => {
        let targetUserID = arguments[0]
        let targetUser = arguments[0].tag

        let reason = arguments.slice(1).join(" ")
        if (!reason) reason = 'Unspecifed'

        if (targetUserID === message.author.id) return message.channel.send(embed('error', `Unban`, `You cannot unban yourself!`))

        if (!message.guild.member(`${targetUserID}`)) {
            message.guild.members.unban(targetUserID)
                .then(user => {
                    if (user) {
                        message.channel.send(embed('default', `User Unbanned`, `User ${targetUser} was unbanned!`).addFields(
                            { name: 'Unbanned By', value: `${message.author}`, inline: true },
                            { name: 'Reason', value: `\`\`\`${reason}\`\`\``, inline: false },
                        ))
                    }
                })
                .catch(err => {
                    return message.channel.send(embed('error', `Unknown`, `${err}`))
                })

        } else {
            message.channel.send(embed('error', `Unban`, `User ${targetUser} \`${targetUserID}\` cannot be unbanned!\n*They are currently in this server.*`))
        }
    },
};