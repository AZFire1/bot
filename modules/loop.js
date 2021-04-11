// Config
const loadYAML = require('@modules/yaml.js')
const config = loadYAML('config')

// Chalk
const chalk = require('chalk');
const infoPrefixColor = chalk.black.bgWhite
const warnPrefixColor = chalk.black.bgYellow
const errorPrefixColor = chalk.white.bgRed
const urlColor = chalk.blue.underline
const highlightColor = chalk.yellow

// Tasks
const tasks = require('@modules/tasks')

module.exports = (doLoop) => {
    const loop = setInterval(action = () => {
        if (doLoop !== true) return clearInterval(loop);
        tasks('run')
    }, 1000)

}