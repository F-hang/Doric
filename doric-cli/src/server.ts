import fs from "fs";
import { exec, spawn } from "child_process";
import ws from "nodejs-websocket";
import "colors";

export async function createServer() {
    console.log("Create Server")
    let contextId: string = "0"
    let clientConnection: any = null
    let debuggerConnection: any = null
    let deviceId = 0
    const server = (ws as any).createServer((connection: any) => {
        let thisDeviceId = deviceId++
        console.log('Connected', connection.headers.host)
        if (connection.headers.host.startsWith("localhost")) {
            console.log(`Debugger ${thisDeviceId} attached to dev kit`.green)
            debuggerConnection = connection
            clientConnection.sendText(JSON.stringify({
                cmd: 'SWITCH_TO_DEBUG',
                contextId: contextId
            }), () => { })
        } else {
            console.log(`Client ${thisDeviceId} attached to dev kit`.green)
        }
        connection.on('text', function (result: string) {
            let resultObject = JSON.parse(result)
            switch (resultObject.cmd) {
                case 'DEBUG':
                    clientConnection = connection;
                    (server as any).debugging = true;
                    console.log("Enter debugging");
                    contextId = resultObject.data.contextId;
                    let projectHome = '.';

                    fs.writeFileSync(projectHome + '/build/context', contextId, 'utf8');

                    let source = resultObject.data.source;
                    console.log(connection.key + " request debug, project home: " + projectHome);
                    spawn('code', [projectHome, projectHome + "/src/" + source]);
                    setTimeout(() => {
                        exec('osascript -e \'tell application "System Events"\ntell application "Visual Studio Code" to activate\nkey code 96\nend tell\'', (err, stdout, stderr) => {
                            if (err) {
                                console.log(`stdout: ${err}`)
                            }
                        })
                    }, 1500);
                    break;
                case 'EXCEPTION':
                    console.log(resultObject.data.source.red);
                    console.log(resultObject.data.exception.red);
                    break;
                case 'LOG':
                    const date = new Date
                    const format = function (num: number) {
                        return (Array(2).join("0") + num).slice(-2);
                    };
                    const timeStr = `${format(date.getHours())}:${format(date.getMinutes())}:${format(date.getSeconds())}.${(Array(3).join("0") + date.getMilliseconds()).slice(-3)}`
                    let logContent = resultObject.data.message as string

                    if (resultObject.data.type == 'DEFAULT') {
                        console.log(`${timeStr} Device ${thisDeviceId} ${"[I]".green} ${logContent.green}`.bgBlue);
                    } else if (resultObject.data.type == 'ERROR') {
                        console.log(`${timeStr} Device ${thisDeviceId} ${"[E]".green} ${logContent.green}`.bgRed);
                    } else if (resultObject.data.type == 'WARN') {
                        console.log(`${timeStr.black} ${("Device " + thisDeviceId).black} ${"[W]".green} ${logContent.green}`.bgYellow);
                    }
                    break
            }
        })
        connection.on('connect', function (code: number) {
            console.log('connect', code)
        })
        connection.on('close', function (code: number) {
            console.log('close: code = ' + code, connection.key)
            console.log("quit debugging");
            (server as any).debugging = false
        })
        connection.on('error', function (code: number) {
            console.log('error', code)
        })
    })
    return server
}

