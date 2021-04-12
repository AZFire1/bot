// Load embed module
const embed = require('@modules/embed.js')

// Load YAML module
const loadYAML = require('@modules/yaml.js')
const config = loadYAML('config')

// Load tasks
const tasks = require('@modules/tasks')

module.exports = {
    commands: ['tempmute', 'temppermmute', 'tempperm-mute', 'temppermamute', 'tempperma-mute'],
    expectedArgs: 'user* length* reason',
    minArgs: 2,
    requiredRoles: ['Mod'],
    serverOnly: true,
    description: "Mute a member",
    callback: (client, message, arguments) => {
        let targetUser = message.mentions.members.first()
        if (!targetUser) return message.channel.send(embed('error', `Mute`, `User \`${arguments[0]}\` cannot be temporarily muted!\nThey could not be found in this server.`));

        let time = arguments[1]
        let sTime = 1800
        if (time.endsWith('s')) {
            time = time.replaceAll('s', '')
            sTime = time
            time = `${time} second(s)`
        } else if (time.endsWith('m')) {
            time = time.replaceAll('m', '')
            sTime = time * 60
            time = `${time} minute(s)`
        } else if (time.endsWith('h')) {
            time = time.replaceAll('h', '')
            sTime = time * 3600
            time = `${time} hour(s)`
        } else if (time.endsWith('d')) {
            time = time.replaceAll('d', '')
            sTime = time * 86400
            time = `${time} day(s)`
        } else if (time.endsWith('w')) {
            time = time.replaceAll('w', '')
            sTime = time * 604800
            time = `${time} week(s)`
        } else if (time.endsWith('M')) {
            time = time.replaceAll('M', '')
            sTime = time * 2629800
            time = `${time} month(s)`
        } else {
            return message.channel.send(embed('error', `Invalid Length`, `The provided length isn't valid. Use one of the following: \`\`\`s, m, d, w, or M\`\`\``))
        }

        if (!sTime) return message.channel.send(embed('error', `Invalid Length`, `The provided length isn't valid. Make sure to include a time duration`))

        let reason = arguments.slice(2).join(" ")
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

        if (targetUser.id === message.author.id) return message.channel.send(embed('error', `Mute`, `You cannot temporarily mute yourself!`));

        if (!targetUser.roles.highest.editable && config.Moderation.Mute.LowerRolesOnly) {
            return message.channel.send(embed('error', `Mute`, `User ${targetUser} cannot be temporarily muted!\n*They might have a higher role than I do.*`));
        } else {
            if (targetUser.roles.cache.has(muteRole.id)) return message.channel.send(embed('error', `User Already Muted`, `Cannot unmute this user, they are already muted.`))

            targetUser.roles.add(muteRole.id)
            unmuteAt = parseInt(sTime) + parseInt(Math.floor(Date.now() / 1000))
            tasks('create', 'unmute', targetUser.id, unmuteAt)
            message.channel.send(embed('default', `User Muted`, `User ${targetUser} was temporarily muted!`).addFields(
                { name: 'Muted By', value: `${message.author}`, inline: true },
                { name: 'Length', value: `\`\`\`${time}\`\`\``, inline: true },
                { name: 'Reason', value: `\`\`\`${reason}\`\`\``, inline: false },
            ))

        }
    },
};