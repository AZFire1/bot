// Config
const loadYAML = require('@modules/yaml.js')
const config = loadYAML('config')

// SQLite
const Database = require('better-sqlite3')
let db = new Database('data.db');

let taskIDs = new Array()

// Chalk
const chalk = require('chalk');
const infoPrefixColor = chalk.black.bgWhite
const warnPrefixColor = chalk.black.bgYellow
const errorPrefixColor = chalk.white.bgRed
const urlColor = chalk.blue.underline
const highlightColor = chalk.yellow

module.exports = (type, task, userID, runAt) => {
    db.exec('CREATE TABLE IF NOT EXISTS tasks (id SMALLINT(255), task VARCHAR(255), user_id BIGINT(255), run_at TIMESTAMP)');
    const tasksTableSelection = db.prepare('SELECT * FROM tasks');
    const tasksTableGetSelection = tasksTableSelection.all();

    const insert = db.prepare('INSERT INTO tasks (id, task, user_id, run_at) VALUES (?, ?, ?, ?)');

    switch (type) {
        case 'list':
            if (tasksTableGetSelection.length > 0) {
                console.log(infoPrefixColor(config.ConsoleStyle.Prefix.Info), `====== Aesthetic BOT Task Queue List ======`)
                for (listTask of tasksTableGetSelection) {
                    let date = new Date(0)
                    date.setUTCSeconds(listTask.run_at)
                    switch (listTask.task) {
                        case 'unban':
                            console.log(`[${listTask.id}]> Unban ${listTask.user_id} by ${date} (UNIX ${listTask.run_at})`)
                            break
                        case 'unmute':
                            console.log(`[${listTask.id}]> Unmute ${listTask.user_id} by ${date} (UNIX ${listTask.run_at})`)
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
            for (runTask of tasksTableGetSelection) {
                if (runDate >= runTask.run_at) {
                    switch (runTask.task) {
                        case 'unban':
                            db.exec(`DELETE FROM tasks WHERE ${runTask.id}`);
                            removeID = taskIDs.indexOf(runTask.id)
                            taskIDs.splice(removeID, 1, '');
                            console.log(`[${listTask.id}]> Unban of ${listTask.user_id} executed`)
                            break
                        case 'unmute':
                            db.exec(`DELETE FROM tasks WHERE ${runTask.id}`);
                            removeID = taskIDs.indexOf(runTask.id)
                            taskIDs.splice(removeID, 1, '');
                            console.log(`[${listTask.id}]> Unmute of ${listTask.user_id} executed`)
                            break
                        default:
                            break
                    }
                }
            }
            return
        case 'clear':
            db.exec('DROP TABLE IF EXISTS tasks');
            db.exec('CREATE TABLE IF NOT EXISTS tasks (id SMALLINT(255), task VARCHAR(255), user_id BIGINT(255), run_at TIMESTAMP)');
            return
        default:
            return console.log(warnPrefixColor(config.ConsoleStyle.Prefix.Warn), `${type} is not a valid task type.`)
    }
}