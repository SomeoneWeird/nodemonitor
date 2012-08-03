nodemonitor
===========

NodeJS process manager.

Allows for searching processes, listing by user etc.
Also allows you to kill processes using their PID.


Installation
============

npm install nodemanager

Usage
=====

	var nodemanager = require('nodemanager');

	nodemanager.search("COMMAND", "CHROME", function(processes) {

		for(var i = 0; i < processes.length; i++) {

			console.log(processes[i].PID);

			// Log the PID of each process that has "CHROME" in its command.

			nodemanager.kill(processes[i].PID, function(res) {

				if(res==1) {

					console.log("Killed processes with PID " + processes[i].PID + " OK!");

				} else {

					console.log("Error killing process with PID " + processes[i].PID);

				}

			});

		}

	});