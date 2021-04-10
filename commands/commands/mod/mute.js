// Load embed module
const embed = require('@modules/embed.js')

// Load YAML module
const loadYAML = require('@modules/yaml.js')
const config = loadYAML('config')

module.exports = {
    commands: ['mute', 'permmute', 'perm-mute', 'permamute', 'perma-mute'],
    expectedArgs: 'user* reason',
    minArgs: 1,
    requiredRoles: ['Mod'],
    serverOnly: true,
    description: "Mute a member",
    callback: (client, message, arguments) => {
        let targetUser = message.mentions.members.first()
        if (!targetUser) return message.channel.send(embed('error', `Mute`, `User \`${arguments[0]}\` cannot be temporarily banned!\nThey could not be found in this server.`));

        let reason = arguments.slice(1).join(" ")
        if (!reason) reason = 'Unspecifed';

        let muteRole = message.guild.roles.cache.find(role => role.name === config.Moderation.Mute.Role);
        if (!muteRole) {
            muteRole = message.guild.roles.create({
                data: {
                    name: `${config.Moderation.Mute.Role}`,
                    color: 'RED',
                },
            })
        }

        if (targetUser.id === message.author.id) return message.channel.send(embed('error', `Mute`, `You cannot permanently mute yourself!`));

        if (!targetUser.roles.highest.editable && config.Moderation.Mute.LowerRolesOnly) {
            return message.channel.send(embed('error', `Mute`, `User ${targetUser} cannot be permanently muted!\n*They might have a higher role than I do.*`));
        } else {
            if (targetUser.roles.cache.has(muteRole.id)) {
                message.channel.send(embed('error', `User Already Muted`, `Cannot unmute this user, they are already muted.`))
            } else {
                targetUser.roles.add(muteRole.id)
                message.channel.send(embed('default', `User Muted`, `User ${targetUser} was permanently muted!`).addFields(
                    { name: 'Muted By', value: `${message.author}`, inline: true },
                    { name: 'Length', value: `\`\`\`PERMANENT\`\`\``, inline: true },
                    { name: 'Reason', value: `\`\`\`${reason}\`\`\``, inline: false },
                ))
            }
            
        }
    },
};