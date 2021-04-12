// Load embed module
const embed = require('@modules/embed.js')

// Load YAML module
const loadYAML = require('@modules/yaml.js')
const config = loadYAML('config')

// Load tasks
const tasks = require('@modules/tasks')

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

        if (targetUser.id === message.author.id) return message.channel.send(embed('error', `Temp Ban`, `You cannot temporarily ban yourself!`))
        
        if (!targetUser.bannable) {
            return message.channel.send(embed('error', `Temp Ban`, `User ${targetUser} cannot be temporarily banned!\n*They might have a higher role than I do.*`))
        } else {
            targetUser.ban({ reason: `${reason}` }).catch(err => {
                return message.channel.send(embed('error', `Unknown`, `${err}`))
            })
            unmuteAt = parseInt(sTime) + parseInt(Math.floor(Date.now() / 1000))
            tasks('create', 'unban', targetUser.id, unmuteAt)
            message.channel.send(embed('default', `User Temp Banned`, `User ${targetUser} was temporarily banned!`).addFields(
                { name: 'Banned By', value: `${message.author}`, inline: true },
                { name: 'Length', value: `\`\`\`${time}\`\`\``, inline: true },
                { name: 'Reason', value: `\`\`\`${reason}\`\`\``, inline: false },
            ))
        }
    },
};