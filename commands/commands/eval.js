// Load embed module
const embed = require('@modules/embed.js')

// Load YAML module
const loadYAML = require('@modules/yaml.js')
const config = loadYAML('config')

module.exports = {
    commands: ['eval'],
	description: "Eval javascript",
    callback: (client, message, arguments) => {
        if (message.author.id === config.OwnerID) {
            if (config.Eval.Enabled) {
                const args = arguments.slice(0).join(" ")
                const evalResult = eval(args)
                message.channel.send(embed('default', `Eval Results`, `${evalResult}`))
            } else {
                message.channel.send(embed('error', `Command Disabled`, `The eval command is disabled and should only be enabled if you know what you are doing and realise the risks`))
            }
        } else {
            return // For discretion
        }
    },
}