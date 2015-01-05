var assert = require("assert");
var fs = require("fs");
var vm = require("vm");

// Fake Angular environment
function makeEnv(mod, catalog) {
    return {
        angular: {
            module: function (modDefined) {
                assert.equal(modDefined, mod);
                return {
                    run: function (block) {
                        assert.equal(block[0], "gettextCatalog");
                        block[1](catalog);
                    }
                };
            }
        }
    };
};

describe("Compile", function () {
    it("Compiles a .po file into a .js catalog", function () {
        assert(fs.existsSync("tmp/test1.js"));
        var catalog = {
            setStrings: function (language, strings) {
                assert.equal(language, "nl");
                assert.equal(strings["Hello!"], "Hallo!");
                assert.equal(strings["This is a test"], "Dit is een test");
                assert.deepEqual(strings["Bird"], ["Vogel", "Vogels"]);
                assert.deepEqual(strings["Hello \"world\""], "Hallo \"wereld\"");
            }
        };
        var context = vm.createContext(makeEnv("gettext", catalog));
        vm.runInContext(fs.readFileSync("tmp/test1.js", "utf8"), context);
    });

    it("Accepts a module parameter", function () {
        assert(fs.existsSync("tmp/test2.js"));
        var catalog = {
            setStrings: function (language, strings) {}
        };
        var context = vm.createContext(makeEnv("myApp", catalog));
        vm.runInContext(fs.readFileSync("tmp/test2.js", "utf8"), context);
    });

    it("Allows merging multiple languages", function () {
        assert(fs.existsSync("tmp/test3.js"));
        var languages = 0;
        var catalog = {
            setStrings: function (language, strings) {
                assert(language === "nl" || language === "fr");
                languages++;
            }
        };
        var context = vm.createContext(makeEnv("gettext", catalog));
        vm.runInContext(fs.readFileSync("tmp/test3.js", "utf8"), context);
        assert.equal(languages, 2);
    });

    it("Can output to JSON", function () {
        assert(fs.existsSync("tmp/test4.json"));
        var data = JSON.parse(fs.readFileSync("tmp/test4.json"));
        assert.deepEqual(data.fr, {
            "Hello!": "Bonjour!",
            "This is a test": "Ceci est un test",
            "Bird": ["Oiseau", "Oiseaux"]
        });
        assert.deepEqual(data.nl, {
            "Hello!": "Hallo!",
            "This is a test": "Dit is een test",
            "Bird": ["Vogel", "Vogels"],
            "Hello \"world\"": "Hallo \"wereld\""
        });
    });

    it("Can output multiple files to single JSON", function () {
        assert(fs.existsSync("tmp/test5.json"));
        var data = JSON.parse(fs.readFileSync("tmp/test5.json"));
        assert.deepEqual(data.fr, {
            "Hello!": "Bonjour!",
            "This is a test": "Ceci est un test",
            "Bird": ["Oiseau", "Oiseaux"],
            "Goodbye!": "Au revoir!"
        });
    });
});
