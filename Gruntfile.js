module.exports = function (grunt) {
    grunt.initConfig({
        "steal-build": {
            default: {
                options: {
                    system: {
                        //config: "myapp/config.js",
                        config: "package.json!npm",
                        main: "init",
                        bundlesPath:"dist/bundles",
                        baseUrl:"./theme/SOA/CM/"
                    },
                    buildOptions: {
                        minify: true,
                        sourceMaps: false,
                        bundleSteal : false,
                        bundleDepth: 3,
                        mainDepth: 3,
                        removeDevelopmentCode : true
                    }
                }
            }
        },
        shell: {
            options: {
                stderr: false
            },
            generate :{
                command: function(option){
                    return 'node filegenerator.js -path ../test -includeCanjs '+option;
                }
            }
        }
    });
    // http://stealjs.com/docs/steal-tools.grunt.build.html
    /*
     * Register All Necessary Tasks
     */
    grunt.registerTask('steal-build', ['steal-build']);
    grunt.registerTask("default", ["steal-build"]);

    /*
     * Load All Necessary Tasks
     */
    grunt.loadNpmTasks('steal-tools');
    grunt.loadNpmTasks('grunt-shell');
    grunt.registerTask('default', ['shell:generate:true','steal-build']);
    //grunt.loadNpmTasks('documentjs');
};
