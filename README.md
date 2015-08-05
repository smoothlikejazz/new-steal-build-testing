# How does the new stealjs dependency management work
This repo has been created help me figure out how dependencies work with new stealjs build framework. 

# Context
I currently have an application that has been using .then all over the place, and with the new version of steal there is no longer support for it. 
So there is a migration guide here http://stealjs.com/docs/StealJS.migrating.html  which outlines that if you have used the .then, then you must now use the deps inside of the meta

# Why Im Upgrading to the new steal
So using the old steal our app has grown very large and we are hitting the IE8 Maximum execution statement limit of 5 million http://www.sitepoint.com/javascript-execution-browser-limits/
So in an attempt to mitigate were going to upgrade to new version of steal located here stealjs.com, And hoping that the production file built with this new version stays away from hitting the 5 mill limit.
So our journey begins in migrating from 3.3 JMVC steal build to new stealjs.com build. and obstacal number 1 is removing .then and utilizing dependencies.


# My Goal
So my goal is to load a dependency. so that i can translate this to my applcation. so im just trying to get a working example. 
Currently what i have outlined in my myapp/package.json is a dependency on 1 file in my components
```
{
  "system": {
    "paths": {
    },
    "meta": {
      "dummy/test1.js": {
        "deps": [
          "components/test/test.js"
        ]
      }
    }
  }
}
```
What I get in terminal is that my module could not be found, and its searching for it in node_modules ?? so I have placed my comoponents test within node_modules, and it still did not find it there. 
```
WARN: Could not find dummy/test1.js in node_modules. Ignoring.
```

# Steps to getting my example running
## Run Npm install
``` npm install ```

## Generate Files
*Note:* This does not have to be run i already checked it into to the repo so my example can be ran without this extra step.
Running the below command will create 511 js files to simulate the behaviour of steal loading. It will create a main myapp.js along with all other files necessary to be stolen.
Looks like a binary search tree, with only a depth of 4, where test1.js steals 2 & 3, and 2 steals  4 & 5 ...
``` node filegenerator ```

## Run the steal build
```
grunt
```

# My Notes
## How To Build Via The Command Line with steal tools
```
./node_modules/.bin/steal-tools build --config myapp/config.js --main myapp --source-maps --minify
 ```



# Buliding old steal production.js
oldsteal/ js theme/SOA/CM/init.js




