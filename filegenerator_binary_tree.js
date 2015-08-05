/*
	Require
 */
var fs = require('fs');
var path  = require('path');

/*
 Utils
 */

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

ensureExists(__dirname + '/myapp/dummy', 0744, function(err) {
	if (!err){
		console.log("Myapp Dummy Directory Created");
	}
});

ensureExists(__dirname + '/myapp/dependents', 0744, function(err) {
	if (!err){
		console.log("Dependents Directory Created");
	}
});



//var fileTotal = 504;
//var depth = 3;
//var modulus = Math.pow(2, (depth+1));
//var fileContent;


// For Depth 3 Only
//for(var i=1 ; i<=fileTotal ; i++){
//	fileContent = "";
//	fileIndex = i;
//	if(i%modulus === 1){
//		fileContent = 'steal("dummy/test'+(fileIndex+1)+'.js","dummy/test'+(fileIndex+2)+'.js", function(){console.log("test'+(fileIndex)+'.js");});';
//	}
//	if(i%modulus === 2 ){
//		fileContent = 'steal("dummy/test'+(fileIndex+2)+'.js","dummy/test'+(fileIndex+3)+'.js", function(){console.log("test'+(fileIndex)+'.js");});';
//	}
//	if(i%modulus === 3){
//		fileContent = 'steal("dummy/test'+(fileIndex+3)+'.js","dummy/test'+(fileIndex+4)+'.js", function(){console.log("test'+(fileIndex)+'.js");});';
//	}
//
//	fs.writeFile("myapp/dummy/test"+fileIndex+".js", fileContent, function (err) {
//		if (err) throw err;
//		console.log("File has been created.");
//	});
//}


// for Depth 4 Only
var fileTotal = 510;
var depth = 3;
var modulus = Math.pow(2, (depth+1)) -1 ;
var fileContent;

for(var i=1 ; i<=fileTotal ; i++){
	fileContent = "";
	fileIndex = i;
	if(i%modulus === 1){
		fileContent = 'steal("myapp/test'+(fileIndex+1)+'.js","myapp/test'+(fileIndex+2)+'.js", function(){});';
	}
	else if(i%modulus === 2 ){
		fileContent = 'steal("myapp/test'+(fileIndex+2)+'.js","myapp/test'+(fileIndex+3)+'.js", function(){});';
	}
	else if(i%modulus === 3){
		fileContent = 'steal("myapp/test'+(fileIndex+3)+'.js","myapp/test'+(fileIndex+4)+'.js", function(){});';
	}
	else if(i%modulus === 4){
		fileContent = 'steal("myapp/test'+(fileIndex+4)+'.js","myapp/test'+(fileIndex+5)+'.js", function(){});';
	}
	else if(i%modulus === 5){
		fileContent = 'steal("myapp/test'+(fileIndex+5)+'.js","myapp/test'+(fileIndex+6)+'.js", function(){});';
	}
	else if(i%modulus === 6){
		fileContent = 'steal("myapp/test'+(fileIndex+6)+'.js","myapp/test'+(fileIndex+7)+'.js", function(){});';
	}
	else if(i%modulus === 7){
		fileContent = 'steal("myapp/test'+(fileIndex+7)+'.js","myapp/test'+(fileIndex+8)+'.js", function(){});';
	}
	else {
		fileContent = '';
	}

	fs.writeFile("myapp/dummy/test"+fileIndex+".js", fileContent, function (err) {
		if (err) throw err;
		//console.log("File has been created.");
	});
}
console.log("Application Test Files Have Been Generated");

// Create Final Myapp.js file
var myappContents = "steal(";
for(var j=1 ; j<=fileTotal ; j++){

	if(j%modulus === 1){
		myappContents += "'myapp/test"+j+".js',";
	}

}

myappContents += " function(){});";


fs.writeFile("myapp/myapp.js", myappContents, function (err) {
	if (err) throw err;
	console.log("Main MyApp File has been created.");
});


/*
 Create dependent files for each file created and a Package.json file with dependencies.
 */

var packageContents = {
	"system": {
		"paths": {
			"myapp/*" : "dummy/*.js"
		},
		"meta": {
			//"myapp/test1": {
			//	"deps": [
			//		"dependents/dependent_1"
			//	]
			//},
			//"myapp/test2": {
			//	"deps": [
			//		"dependents/dependent_1"
			//	]
			//}
		}
	}
};

var dependencyModuleName;
for(i=1 ; i<=fileTotal ; i++){


	dependencyModuleName = "myapp/test"+i;
	packageContents.system.meta[dependencyModuleName] = {
		"deps": [
			"dependents/dependent_" + i
		]
	};

	fileContent = '//dependent file to steal dependent_'+(i)+'.js';
	fs.writeFile("myapp/dependents/dependent_"+i+".js", fileContent, function (err) {
		if (err) throw err;
		//console.log("File has been created.");
	});
}



fs.writeFile("myapp/package.json", JSON.stringify(packageContents), function (err) {
	if (err) throw err;
	//console.log("File has been created.");
});

