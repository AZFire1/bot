// Load embed module
const embed = require('@modules/embed.js')

// Load YAML module
const loadYAML = require('@modules/yaml.js')
const config = loadYAML('config')

// Chalk
const chalk = require('chalk');
const infoPrefixColor = chalk.black.bgWhite
const warnPrefixColor = chalk.black.bgYellow
const errorPrefixColor = chalk.white.bgRed
const urlColor = chalk.blue.underline
const highlightColor = chalk.yellow

module.exports = {
    commands: ['eval'],
	description: "Evaluate javascript code",
    callback: (client, message, arguments) => {
        if (message.author.id === config.OwnerID) {
            if (config.Eval.Enabled) {
                const args = arguments.slice(0).join(" ")
                const evalResult = eval(args)
                message.channel.send(embed('default', `Eval Results`, `Check console for more information\n**Result:**\n\`\`\`${evalResult}\`\`\``))
                console.log(warnPrefixColor('Eval Result >'), evalResult)
            } else {
                message.channel.send(embed('error', `Command Disabled`, `The eval command is disabled and should only be enabled if you know what you are doing and realise the risks`))
            }
        } else {
            return // For discretion
        }
    },
}