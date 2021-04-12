// Config
const loadYAML = require('@modules/yaml.js')
const config = loadYAML('config')

// SQLite
const Database = require('better-sqlite3')
let db = new Database('data.db');

let taskIDs = new Array()

// Get client
//const { client } = require('@root/index.js')

// Chalk
const chalk = require('chalk');
const infoPrefixColor = chalk.black.bgWhite
const warnPrefixColor = chalk.black.bgYellow
const errorPrefixColor = chalk.white.bgRed
const urlColor = chalk.blue.underline
const highlightColor = chalk.yellow

module.exports = async (type, task, userID, runAt) => {
    db.exec('CREATE TABLE IF NOT EXISTS tasks (id SMALLINT(255), task VARCHAR(255), user_id text, run_at TIMESTAMP)');
    db.defaultSafeIntegers(true);
    const tasksTableSelection = db.prepare('SELECT * FROM tasks')
    const tasksTableGetSelection = tasksTableSelection.all();

    const insert = db.prepare('INSERT INTO tasks (id, task, user_id, run_at) VALUES (?, ?, ?, ?)');

    const { client } = require('@root/index.js')

    switch (type) {
        case 'list':
            if (tasksTableGetSelection.length > 0) {
                console.log(infoPrefixColor(config.ConsoleStyle.Prefix.Info), `====== Aesthetic BOT Task Queue List ======`)
                let UNIX = new Date()
                UNIX = Math.floor(Date.now() / 1000)
                console.log(infoPrefixColor(config.ConsoleStyle.Prefix.Info), `Current UNIX time (s): ${UNIX}`)
                for (listTask of tasksTableGetSelection) {
                    switch (listTask.task) {
                        case 'unban':
                            console.log(`[${listTask.id}]> Unban ${listTask.user_id} at UNIX ${listTask.run_at}`)
                            break
                        case 'unmute':
                            console.log(`[${listTask.id}]> Unmute ${listTask.user_id} at UNIX ${listTask.run_at}`)
                            break
                        default:
                            console.log(warnPrefixColor(config.ConsoleStyle.Prefix.Warn), `Task ${listTask.task} is not a recognised task`)
                            break
                    }
                }
                console.log(infoPrefixColor(config.ConsoleStyle.Prefix.Info), `====== Aesthetic BOT Task Queue List ======`)
            }
            return
        case 'create':
            if (!task || !userID || !runAt) return console.log(warnPrefixColor(config.ConsoleStyle.Prefix.Warn), `Missing arguments to create a task.`)

            for (taskID of tasksTableGetSelection) {
                if (!taskIDs.includes(taskID.id)) taskIDs.push(taskID.id)
            }
            let nextTaskID = Math.floor(Math.random() * 32767)
            while (taskIDs.includes(nextTaskID)) {
                nextTaskID = Math.floor(Math.random() * 32767)
            }
            
            insert.run(nextTaskID, `${task}`, userID, runAt)
            taskIDs.push(nextTaskID)
            return
        case 'run':
            let runDate = Math.floor(Date.now() / 1000)
            const guild = await client.guilds.cache.get(`${config.ServerID}`)
            for (runTask of tasksTableGetSelection) {
                if (runDate >= runTask.run_at) {
                    switch (runTask.task) {
                        case 'unban':
                            if (!guild.member(`${runTask.user_id}`)) {
                                guild.members.unban(runTask.user_id)
                                    .catch(err => {  })
                                console.log(`[${runTask.id}]> Unban of ${runTask.user_id} executed`)
                            }

                            db.exec(`DELETE FROM tasks WHERE ${runTask.id}`);
                            removeID = taskIDs.indexOf(runTask.id)
                            taskIDs.splice(removeID, 1, '');
                            break
                        case 'unmute':
                            let muteRole = guild.roles.cache.find(role => role.name === config.Moderation.Mute.Role);

                            let targetUser = guild.members.cache.get(`${runTask.user_id}`)
                            if (targetUser.roles.cache.has(muteRole.id) && muteRole) {
                                targetUser.roles.remove(muteRole.id)
                                console.log(`[${runTask.id}]> Unmute of ${runTask.user_id} executed`)
                            }

                            db.exec(`DELETE FROM tasks WHERE ${runTask.id}`);
                            removeID = taskIDs.indexOf(runTask.id)
                            taskIDs.splice(removeID, 1, '');
                            return
                        default:
                            db.exec(`DELETE FROM tasks WHERE ${runTask.id}`);
                            removeID = taskIDs.indexOf(runTask.id)
                            taskIDs.splice(removeID, 1, '');
                            break
                    }
                }
            }
            return
        case 'clear':
            db.exec('DROP TABLE IF EXISTS tasks');
            db.exec('CREATE TABLE IF NOT EXISTS tasks (id SMALLINT(255), task VARCHAR(255), user_id text, run_at TIMESTAMP)');
            return
        default:
            return console.log(warnPrefixColor(config.ConsoleStyle.Prefix.Warn), `${type} is not a valid task type.`)
    }
}