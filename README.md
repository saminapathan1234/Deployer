# Deployer

This script is used for deploying a particular application an a free server on available port from the specified range.


**Problem Statement.**

* You have 10 servers.
* You need to deploy 1000 web apps onto in between these 10 servers.
* Assume the deployment process is

deploy <appname> free ip free port

* Write a program to find free ports available on free ips to deploy the app.

* Log all the details to a log file.
* See the use of various log levels.



**Assumptions and prerequisites.**


1. The file config.js contains the list of valid apps , list of servers and the port range valid for a particular app.
2. The file deploy.js is the main file i.e. node server code.
3. All the node_modules required by the code are contained in the node_modules folder.
4. Requires node version 8 or above.
5. So , there are 10 servers in the config file , 10 apps for now(can be increased to 1000).
6. Deploying a particular app on a particular server and port assuming it is not already running.
7. Assuming a range of ports to be available for a particular app (As specified in the config file).
8. Logs are being written in a logfile deploy.log .(Using bunyan for logging)

**Steps to deploy.**


* CLI COMMANDS TO BE USED :

	node deploy.js <action> <appname>
	 
		e.g. node deploy.js deploy app1
		This command is used to deploy app1 on a free Server from the list of 10 servers and a free port from the port range specified.



