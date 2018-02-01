'use strict';
let configData = require('./config.js');
let async = require('async')
let shell = require('shelljs')
let nginxArray = configData.nginxArray;
let services = configData.serviceList;
let appList = configData.appList
let action = process.argv[2] || "";
let appName = process.argv[3]
let isDeployed = false;
let freeServer;
let freePort;
var Logger = require('bunyan');
var log = new Logger({
    name: 'deploy',
    streams: [{
        path: 'deploy.log'
    }]
});
var time;
/*First function to be called is this , 
which will validate the number of arguments and call the main function if its proper.*/
function validateParams() {
    if (!action || !appName) {
        console.log("Wrong Command Format. Use : node deploy.js <deploy> <appName>");
        time = new Date();
        log.error({
            message: "Wrong Command Format",
            time: time
        })
    } else {
        action = action.trim().toLowerCase();
        appName = appName.toLowerCase();
        if (appList[appName] == 1)
            main();
        else {
            console.log("===========Please enter a valid appName from the list.===============")
            log.error({
                message: "Invalid appName",
                time: time,
                query: appName
            })
        }
    }
}

/*This function calls the findServer function,
 First waits for its response post which passes it to findPort function 
, waits for its response and then invokes the startService Function*/
async function main() {

    try {
        var respServer = await findServer();
        console.log("In main, response from findServer", respServer)
    } catch (e) {
        console.log("Err in Main while calling findServer", e)
        log.error({
            message: "Err in Main :findServer" + e,
            time: time
        })

        process.exit(1)
    }

    try {
        var respPort = await findPort(respServer);
        console.log("In main, response from findPort", respPort)
    } catch (e) {
        console.log("Err in Main while calling findPort", e)
        log.error({
            message: "Err in Main :findPort" + e,
            time: time
        })

        process.exit(1)
    }

    let finalResp = startService(appName, respServer, respPort)
    console.log("In main, finalResp from startService", finalResp)
}


/*This function will find free server and will then return it to main*/
function findServer() {
    return new Promise((resolve, reject) => {
        for (let i in nginxArray) {
            console.log('Finding if the server is free ', nginxArray[i][Object.keys(nginxArray[i])[0]]);
            if (nginxArray[i][Object.keys(nginxArray[i])[0]] == "free") {
                freeServer = [Object.keys(nginxArray[i])[0]]
                resolve(freeServer);
                break;
            } else {
                console.log('Server ' + Object.keys(nginxArray[i])[0] + ' is busy');
            }
        }
    })
}


/*This function checks for avalable free  ports for a particular app to be deployed , 
when it finds it free , it return the same*/
async function findPort(server) {
    let newArray = services[appName]
    for (let i in newArray) {
        console.log('Finding if the port  ' + newArray[i] + 'is free');
        //Shell script connectPort.sh takes a port as argument and returns code based on it is free or not
        let codeFromShellScript = await shell.exec('sudo sh ./connectPort.sh' + " " + newArray[i]).code
        if (codeFromShellScript == 0) {
            return newArray[i];
            break;
        } else {
            continue;
        }
    }
}

/* Specify all the steps required in deploying a particular app*/
function startService(appName, server, port) {
    console.log("Deploying App ", appName, "on Server " + server + " and Port " + port)
    isDeployed = true
    if (isDeployed) {
        console.log("App ", appName, " is SuccessFully Deployed on Server " + server + " and Port " + port)
        process.exit(1)
    } else
        console.log("Not yet deployed")

}

validateParams();
