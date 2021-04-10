// Load embed module
const embed = require('@modules/embed.js')

// Load YAML module
const loadYAML = require('@modules/yaml.js')
const config = loadYAML('config')

module.exports = {
    commands: ['unmute', 'unpermmute', 'unperm-mute', 'unpermamute', 'unperma-mute'],
    expectedArgs: 'user* reason',
    minArgs: 1,
    requiredRoles: ['Mod'],
    serverOnly: true,
    description: "Unmute a member",
    callback: (client, message, arguments) => {
        let targetUser = message.mentions.members.first()
        if (!targetUser) return message.channel.send(embed('error', `Mute`, `User \`${arguments[0]}\` cannot be temporarily banned!\nThey could not be found in this server.`));
        let memberID = targetUser.id
        let reason = arguments.slice(1).join(" ")

        let muteRole = message.guild.roles.cache.find(role => role.name === config.Moderation.Mute.Role);
        if (!muteRole) return message.channel.send(embed('error', `No Muted Role`, `No muted role was found in the server, therefore this command cannot be ran.`))
        if (!reason) reason = 'Unspecifed';
        if (memberID === message.author.id) return message.channel.send(embed('error', `Mute`, `You cannot unmute yourself!`));

        if (!targetUser.roles.highest.editable && config.Moderation.Mute.LowerRolesOnly) {
            return message.channel.send(embed('error', `Mute`, `User ${targetUser} cannot be permanently muted!\n*They might have a higher role than I do.*`));
        } else {
            if (targetUser.roles.cache.has(muteRole.id)) {
                targetUser.roles.remove(muteRole.id)
                message.channel.send(embed('default', `User Unmuted`, `User ${targetUser} was unmuted!`).addFields(
                    { name: 'Unmuted By', value: `${message.author}`, inline: true },
                    { name: 'Reason', value: `\`\`\`${reason}\`\`\``, inline: false },
                ))
            } else {
                message.channel.send(embed('error', `User Not Muted`, `Cannot unmute this user, they are not muted.`))
            }
            
        }
    },
};