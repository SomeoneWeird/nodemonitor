var exec = require('child_process').exec;

var columns = [
	'USER',
	'PID',
	'CPU',
	'MEM',
	'VSZ',
	'RSS',
	'TTY',
	'STAT',
	'START',
	'TIME',
	'COMMAND'
]

function getProcs(cb) {

	var procs = [];

	exec('ps aux', function(err, sout, serr) {

		var tmp = sout.split('\n');

		tmp.pop();

		for(var i = 0; i < tmp.length; i++) {

			var tmp2 = tmp[i].split(/\s{1,100}/);

			var tmp3 = {};

			for(var j = 0; j < tmp2.length; j++) {
				if(columns[j])
					tmp3[columns[j]] = tmp2[j];
			}

			procs.push(tmp3);

		}

		cb(procs);

	});
}

var getColumnNumber = exports.getColumnNumber = function(name, cb) {

	for(var i = 0; i < columns.length; i++) {
		if(columns[i]==name) {
			cb(i);
			return;
		}
	}
	cb(-1);
	return;
}

var search = exports.search = function(col, text, cb) {

	var res = [];

	getColumnNumber(col, function(colres) {

		if(colres==-1) {
			console.log("Invalid column: " + col);
			return;
		}

		getProcs(function(processes) {

			for(var i = 0; i < processes.length; i++) {

				var tmp = processes[i];

				if(tmp[columns[colres]].indexOf(text)>-1) {
					res.push(processes[i]);
				}
			}

			cb(res);

		});
	});
}

// -1 failed, 1 OK, 2 No permissions, 3 no process

var kill = exports.kill = function(pid, cb) {
	exec('kill ' + pid, function(e, so, se) {

		if(e||se) {
			if(se.indexOf('No such process')) {
				cb(3);
				return;
			} else {
				cb(-1);
				return;
			}
		} else {
			cb(1);
			return;
		}

	});
}

var searchAndKill = exports.searchAndKill = function(col, text, cb) {
	search(col, text, function(sres) {
		for(var i = 0; i < sres.length; i++) {
			kill(sres[i].PID, function(kres) {});
		}
	});
}