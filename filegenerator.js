/*
	Require
 */
var fs = require('fs');
var path  = require('path');

/*
  Predefined Variables
 */

var fileTotal = 500;
var depth = 3;
var modulus = 10;//Math.pow(2, (depth+1)) -1 ;
var fileContent;
var includeEmptyController = false;

/*
 Utils
 */
process.argv.forEach(function (val, index, array) {
	//console.log(index + ': ' + val);
	switch (val){
		case "-includeCanjs":
			console.log( "Actual value", process.argv[index+1] );
			includeEmptyController = (process.argv[index+1] === "true")? true : false;
			console.log("So what is this value" , includeEmptyController);
			break;
	}
});

function ensureExists(path, mask, cb) {
	if (typeof mask == 'function') { // allow the `mask` parameter to be optional
		cb = mask;
		mask = 0777;
	}
	fs.mkdir(path, mask, function(err) {
		if (err) {
			if (err.code == 'EEXIST') cb(null); // ignore the error if the folder already exists
			else cb(err); // something else went wrong
		} else cb(null); // successfully created folder
	});
}

/*
 Begin File Generator
 */

ensureExists(__dirname + '/theme/SOA/CM/dummy/', 0744, function(err) {
	if (!err){
		console.log("New Steal Theme Dummy Directory Created");
	}else{
		console.log(err);
	}
});



for(var i=1 ; i<=fileTotal ; i++){
	fileContent = "";
	fileIndex = i;


	if(i%modulus === 1 || i%modulus === 2 || i%modulus === 3 || i%modulus === 4 ){
		if(includeEmptyController){
			fileContent = 'steal("dummy/test'+(fileIndex+(i%modulus+1))+'.js",' +
				'function(){' +
					'can.getObject("SOA.CM.Test'+fileIndex+'", window, true);' +
					'SOA.CM.Test'+fileIndex+' = can.Control.extend({' +
						'init: function( element, options ) {}' +
					'});' +
				'});';
		}else{
			fileContent = 'steal("dummy/test'+(fileIndex+(i%modulus+1))+'.js",function(){});';
		}

	}else if(i%modulus === 5){
		if(includeEmptyController){
			fileContent = 'steal("dummy/test'+(fileIndex+5)+'.js",' +
				'function(){' +
					'can.getObject("SOA.CM.Test'+fileIndex+'", window, true);' +
					'SOA.CM.Test'+fileIndex+' = can.Control.extend({' +
						'init: function( element, options ) {}' +
					'});' +
				'});';
		}else{
			fileContent = 'steal("dummy/test'+(fileIndex+5)+'.js",function(){});';
		}

	}else{
		fileContent = '';
	}




	//if(i%modulus === 1){
	//	fileContent = 'steal("dummy/test'+(fileIndex+2)+'.js",' +
	//		'function(){' +
	//		'can.getObject("SOA.CM.Test'+fileIndex+'", window, true);' +
	//		'SOA.CM.Test'+fileIndex+' = can.Control.extend({' +
	//			'init: function( element, options ) {}' +
	//			'});' +
	//		'});';
	//}
	//else if(i%modulus === 2 ){
	//	fileContent = 'steal("dummy/test'+(fileIndex+3)+'.js",function(){can.getObject("SOA.CM.Test'+fileIndex+'", window, true);});';
	//}
	//else if(i%modulus === 3){
	//	fileContent = 'steal("dummy/test'+(fileIndex+4)+'.js",function(){can.getObject("SOA.CM.Test'+fileIndex+'", window, true);});';
	//}
	//else if(i%modulus === 4){
	//	fileContent = 'steal("dummy/test'+(fileIndex+5)+'.js",function(){can.getObject("SOA.CM.Test'+fileIndex+'", window, true);});';
	//}
	//else if(i%modulus === 5){
	//	fileContent = 'steal("dummy/test'+(fileIndex+5)+'.js",function(){can.getObject("SOA.CM.Test'+fileIndex+'", window, true);});';
	//}
	//else {
	//	fileContent = '';
	//}

	fs.writeFile("theme/SOA/CM/dummy/test"+fileIndex+".js", fileContent, function (err) {
		if (err) throw err;
		//console.log("File has been created.");
	});
}
console.log("Application Test Files Have Been Generated");

// Create Final Myapp.js file
var myappContents = "var timer = new Date().getTime();console.log(\"Start Time\" ,timer );" +
	"steal(";
for(var j=1 ; j<=fileTotal ; j++){

	if(j%modulus === 1){
		myappContents += "'dummy/test"+j+".js',";
	}

}

myappContents += " function(){" +
	"console.log(\"End time\" ,new Date().getTime() );" +
	"console.log(\"Total Elapsed Time\" ,new Date().getTime() - timer );" +
	"});";


fs.writeFile("theme/SOA/CM/init.js", myappContents, function (err) {
	if (err) throw err;
	console.log("Main MyApp File has been created.");
});


/*
 Create dependent files for each file created and a Package.json file with dependencies.
 */

var packageContents = {
	"system": {
		"paths": {
			"can/*": "../../../node_modules/can/*.js",
			"can": "../../../node_modules/can/can.js",
			"jquery/*": "../../../node_modules/jquery/dist/*.js",
			"theme/*": "../../*.js"
		},
		"meta": {
			//"dummy/test2": {
			//	"deps": [
			//		"dummy/test4"
			//	]
			//},
			//"dummy/test3": {
			//	"deps": [
			//		"dummy/test6"
			//	]
			//},
			//"dummy/test4": {
			//	"deps": [
			//		"dummy/test8"
			//	]
			//}
		}
	}
};

var dependencyModuleName;
var dependencyModuleFile;
for(i=1 ; i<=fileTotal ; i++){

	if(i%modulus === 1 || i%modulus === 2 || i%modulus === 3 || i%modulus === 4){
		dependencyModuleName = "dummy/test"+i;
		dependencyModuleFile = "dummy/test"+(i + (i%modulus) );

		packageContents.system.meta[dependencyModuleName] = {
			"deps": [
				dependencyModuleFile
			]
		};

		if(includeEmptyController){
			packageContents.system.meta[dependencyModuleName].deps.push("can/can");
		}


	}


	//if(i%modulus === 1){
	//	dependencyModuleName = "dummy/test"+i;
	//	dependencyModuleFile = "dummy/test"+(i+1);
	//}
	//if(i%modulus === 2){
	//	dependencyModuleName = "dummy/test"+i;
	//	dependencyModuleFile = "dummy/test"+(i+2);
	//}
	//if(i%modulus === 3){
	//	dependencyModuleName = "dummy/test"+i;
	//	dependencyModuleFile = "dummy/test"+(i+3);
	//}
	//if(i%modulus === 4){
	//	dependencyModuleName = "dummy/test"+i;
	//	dependencyModuleFile = "dummy/test"+(i+4);
	//}
	//
	//packageContents.system.meta[dependencyModuleName] = {
	//	"deps": [
	//		dependencyModuleFile
	//	]
	//};

}



fs.writeFile("theme/SOA/CM/package.json", JSON.stringify(packageContents), function (err) {
	if (err) throw err;
	//console.log("File has been created.");
});

