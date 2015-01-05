module.exports = function (grunt) {
    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks("grunt-mocha-cli");
    grunt.loadNpmTasks("grunt-bump");
    grunt.loadTasks("tasks");

    grunt.initConfig({
        jshint: {
            all: ["tasks/*.js"],
            options: {
                jshintrc: ".jshintrc"
            }
        },

        clean: {
            tmp: ["tmp"]
        },

        watch: {
            test: {
                files: ["tasks/**.js", "test/**/*.js"],
                tasks: ["test"]
            }
        },

        mochacli: {
            options: {
                files: "test/*_test.js",
            },

            spec: {
                options: {
                    reporter: "spec"
                }
            }
        },

        nggettext_extract: {
            auto: {
                files: {
                    "tmp/test1.pot": "test/fixtures/single.html",
                    "tmp/test2.pot": ["test/fixtures/single.html", "test/fixtures/second.html", "test/fixtures/custom.extension"],
                    "tmp/test3.pot": "test/fixtures/plural.html",
                    "tmp/test4.pot": "test/fixtures/merge.html",
                    "tmp/test6.pot": "test/fixtures/filter.html",
                    "tmp/test7.pot": "test/fixtures/source.js",
                    "tmp/test8.pot": "test/fixtures/quotes.html",
                    "tmp/test9.pot": "test/fixtures/strip.html",
                    "tmp/test10.pot": "test/fixtures/ngif.html",
                    "tmp/test12.pot": "test/fixtures/php.php",
                    "tmp/test13.pot": "test/fixtures/sort.html",
                    "tmp/test14.pot": "test/fixtures/concat.js",
                    "tmp/test15.pot": "test/fixtures/data.html",
                    "tmp/test19.pot": "test/fixtures/no_delimiter.html",
                    "tmp/test21.pot": "test/fixtures/tapestry.tml"
                }
            },

            manual: {
                files: {
                    "tmp/test5.pot": "test/fixtures/corrupt.html"
                }
            },

            custom: {
                options: {
                    startDelim: "[[",
                    endDelim: "]]"
                },

                files: {
                    "tmp/test11.pot": "test/fixtures/delim.html"
                }
            },

            custom_extensions: {
                options: {
                    extensions: {
                        extension: "html",
                        js_extension: "js"
                    }
                },

                files: {
                    "tmp/test16.pot": "test/fixtures/custom.extension",
                    "tmp/test17.pot": "test/fixtures/custom.js_extension",
                    "tmp/test18.pot": "test/fixtures/single.html"
                }
            },

            custom_marker_name: {
                options: {
                    markerName: "__"
                },

                files: {
                    "tmp/test20.pot": "test/fixtures/custom_marker_name.js"
                }
            }
        },

        nggettext_compile: {
            test1: {
                files: {
                    "tmp/test1.js": "test/fixtures/nl.po"
                }
            },

            test2: {
                options: {
                    module: "myApp"
                },
                files: {
                    "tmp/test2.js": "test/fixtures/nl.po"
                }
            },

            test3: {
                files: {
                    "tmp/test3.js": "test/fixtures/{nl,fr}.po"
                }
            },

            test4: {
                options: {
                    format: "json"
                },
                files: {
                    "tmp/test4.json": "test/fixtures/{nl,fr}.po"
                }
            },

            test5: {
                options: {
                    format: "json"
                },
                files: {
                    "tmp/test5.json": ["test/fixtures/fr.po", "test/fixtures/fr1.po"]
                }
            }
        },

        bump: {
            options: {
                files: ['package.json'],
                commitFiles: ['-a'],
                pushTo: 'origin'
            }
        }
    });

    grunt.registerTask("default", ["test"]);
    grunt.registerTask("build", ["clean", "jshint"]);
    grunt.registerTask("test", ["build", "nggettext_extract:auto", "nggettext_extract:custom", "nggettext_extract:custom_extensions", "nggettext_extract:custom_marker_name", "nggettext_compile", "mochacli"]);
};
