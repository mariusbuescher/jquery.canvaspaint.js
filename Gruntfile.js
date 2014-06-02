module.exports = function (grunt) {

  grunt.initConfig({

    pkg: grunt.file.readJSON("package.json"),

    coffee : {

      compile : {
        options : {
          sourceMap : true,
          sourceMapDir : "js/build/"
        },

        files : [{
          flatten : true,
          dest : "js/build/canvaspaint.js",
          src : ["coffeescript/src/canvaspaint.coffee"],
        },
        {
          flatten : true,
          dest : "js/build/jQuery.canvaspaint.js",
          src : ["coffeescript/src/*.coffee"]
        }]
      }

    },

    uglify : {
      standalone : {
        options : {
          sourceMap: true,
          sourceMapIn : "js/build/canvaspaint.js.map",
          sourceMapIncludeSources: true
        },
        files : [
          {
            dest : "js/dist/canvaspaint.min.js",
            src : "js/build/canvaspaint.js"
          }
        ]
      },

      jQuery : {
        options : {
          sourceMap: true,
          sourceMapIn : "js/build/jQuery.canvaspaint.js.map",
          sourceMapIncludeSources: true
        },
        files : [
          {
            dest : "js/dist/jQuery.canvaspaint.min.js",
            src : "js/build/jQuery.canvaspaint.js"
          }
        ]
      }
    },

    watch : {
      standalone : {
        files : ["coffeescript/src/*.coffee"],
        tasks : ["coffee", "uglify"]
      }
    }

  });

  grunt.loadNpmTasks("grunt-contrib-coffee");
  grunt.loadNpmTasks("grunt-contrib-uglify");
  grunt.loadNpmTasks("grunt-contrib-watch");

  grunt.registerTask("default", ["coffee", "uglify"])

};
