var assert = require("assert");
var po = require("pofile");
var fs = require("fs");
var grunt = require("grunt");

describe("Extract", function () {
    it("Extracts strings from views", function (done) {
        assert(fs.existsSync("tmp/test1.pot"));
        po.load("tmp/test1.pot", function (err, catalog) {
            assert.equal(err, null);
            assert.equal(catalog.items.length, 1);
            assert.equal(catalog.items[0].msgid, "Hello!");
            assert.equal(catalog.items[0].msgstr, "");
            assert.equal(catalog.items[0].references.length, 2);
            assert.equal(catalog.items[0].references[0], "test/fixtures/single.html:3");
            done();
        });
    });

    it("Merges multiple views into one .pot", function (done) {
        assert(fs.existsSync("tmp/test2.pot"));
        po.load("tmp/test2.pot", function (err, catalog) {
            var i;
            assert.equal(err, null);
            i = catalog.items;
            assert.equal(i.length, 2);
            assert.equal(i[0].msgid, "Hello!");
            assert.equal(i[1].msgid, "This is a test");
            done();
        });
    });

    it("Merges duplicate strings with references", function (done) {
        assert(fs.existsSync("tmp/test2.pot"));
        po.load("tmp/test2.pot", function (err, catalog) {
            var i;
            assert.equal(err, null);
            i = catalog.items;
            assert.equal(i.length, 2);
            assert.equal(i[0].msgid, "Hello!");
            assert.equal(i[0].references.length, 3);
            assert.equal(i[0].references[0], "test/fixtures/second.html:3");
            assert.equal(i[0].references[1], "test/fixtures/single.html:3");
            assert.equal(i[1].msgid, "This is a test");
            assert.equal(i[1].references.length, 1);
            assert.equal(i[1].references[0], "test/fixtures/second.html:4");
            done();
        });
    });

    it("Extracts plural strings", function (done) {
        assert(fs.existsSync("tmp/test3.pot"));
        po.load("tmp/test3.pot", function (err, catalog) {
            var i;
            assert.equal(err, null);
            i = catalog.items;
            assert.equal(i.length, 1);
            assert.equal(i[0].msgid, "Bird");
            assert.equal(i[0].msgid_plural, "Birds");
            assert.equal(i[0].msgstr.length, 2);
            assert.equal(i[0].msgstr[0], "");
            assert.equal(i[0].msgstr[1], "");
            done();
        });
    });

    it("Merges singular and plural strings", function (done) {
        assert(fs.existsSync("tmp/test4.pot"));
        po.load("tmp/test4.pot", function (err, catalog) {
            var i;
            assert.equal(err, null);
            i = catalog.items;
            assert.equal(i.length, 1);
            assert.equal(i[0].msgid, "Bird");
            assert.equal(i[0].msgid_plural, "Birds");
            assert.equal(i[0].msgstr.length, 2);
            assert.equal(i[0].msgstr[0], "");
            assert.equal(i[0].msgstr[1], "");
            done();
        });
    });

    it("Warns for incompatible plurals", function (done) {
        grunt.util.spawn({
            cmd: "grunt",
            args: ["nggettext_extract:manual"]
        }, function (err) {
            assert(!fs.existsSync("tmp/test5.pot"));
            done(err);
        });
    });

    it("Extracts filter strings", function (done) {
        assert(fs.existsSync("tmp/test6.pot"));
        po.load("tmp/test6.pot", function (err, catalog) {
            assert.equal(err, null);
            assert.equal(catalog.items.length, 2);
            assert.equal(catalog.items[0].msgid, "Hello");
            assert.equal(catalog.items[0].msgstr, "");
            assert.equal(catalog.items[0].references.length, 1);
            assert.equal(catalog.items[0].references[0], "test/fixtures/filter.html:3");
            assert.equal(catalog.items[1].msgid, "Second");
            assert.equal(catalog.items[1].msgstr, "");
            assert.equal(catalog.items[1].references.length, 1);
            assert.equal(catalog.items[1].references[0], "test/fixtures/filter.html:4");
            done();
        });
    });

    it("Extracts flagged strings from JavaScript source", function (done) {
        assert(fs.existsSync("tmp/test7.pot"));
        po.load("tmp/test7.pot", function (err, catalog) {
            assert.equal(err, null);
            assert.equal(catalog.items.length, 1);
            assert.equal(catalog.items[0].msgid, "Hello");
            assert.equal(catalog.items[0].msgstr, "");
            assert.equal(catalog.items[0].references.length, 1);
            assert.equal(catalog.items[0].references[0], "test/fixtures/source.js:2");
            done();
        });
    });

    it("Extracts strings with quotes", function (done) {
        assert(fs.existsSync("tmp/test8.pot"));
        po.load("tmp/test8.pot", function (err, catalog) {
            assert.equal(err, null);
            assert.equal(catalog.items.length, 1);
            assert.equal(catalog.items[0].msgid, "Hello \"world\"!");
            assert.equal(catalog.items[0].msgstr, "");
            assert.equal(catalog.items[0].references.length, 1);
            assert.equal(catalog.items[0].references[0], "test/fixtures/quotes.html:3");
            done();
        });
    });

    it("Strips whitespace around strings", function (done) {
        assert(fs.existsSync("tmp/test9.pot"));
        po.load("tmp/test9.pot", function (err, catalog) {
            assert.equal(err, null);
            assert.equal(catalog.items.length, 1);
            assert.equal(catalog.items[0].msgid, "Hello!");
            assert.equal(catalog.items[0].msgstr, "");
            assert.equal(catalog.items[0].references.length, 1);
            assert.equal(catalog.items[0].references[0], "test/fixtures/strip.html:3");
            done();
        });
    });

    it("Handles attribute with < or >", function (done) {
        assert(fs.existsSync("tmp/test10.pot"));
        po.load("tmp/test10.pot", function (err, catalog) {
            assert.equal(err, null);
            assert.equal(catalog.items.length, 1);
            assert.equal(catalog.items[0].msgid, "Show {{trackcount}} song...");
            assert.equal(catalog.items[0].msgid_plural, "Show all {{trackcount}} songs...");
            assert.equal(catalog.items[0].msgstr.length, 2);
            assert.equal(catalog.items[0].msgstr[0], "");
            assert.equal(catalog.items[0].msgstr[1], "");
            assert.equal(catalog.items[0].references.length, 1);
            assert.equal(catalog.items[0].references[0], "test/fixtures/ngif.html:3");
            done();
        });
    });

    it("Can customize delimiters", function (done) {
        assert(fs.existsSync("tmp/test11.pot"));
        po.load("tmp/test11.pot", function (err, catalog) {
            assert.equal(err, null);
            assert.equal(catalog.items.length, 1);
            assert.equal(catalog.items[0].msgid, "Hello");
            assert.equal(catalog.items[0].msgstr, "");
            assert.equal(catalog.items[0].references.length, 1);
            assert.equal(catalog.items[0].references[0], "test/fixtures/delim.html:3");
            done();
        });
    });

    it("Can extract from PHP files", function (done) {
        assert(fs.existsSync("tmp/test12.pot"));
        po.load("tmp/test12.pot", function (err, catalog) {
            assert.equal(err, null);
            assert.equal(catalog.items.length, 1);
            assert.equal(catalog.items[0].msgid, "Play");
            assert.equal(catalog.items[0].msgstr, "");
            assert.equal(catalog.items[0].references.length, 1);
            assert.equal(catalog.items[0].references[0], "test/fixtures/php.php:2");
            done();
        });
    });

    it("Sorts strings", function (done) {
        assert(fs.existsSync("tmp/test13.pot"));
        po.load("tmp/test13.pot", function (err, catalog) {
            assert.equal(err, null);
            assert.equal(catalog.items.length, 3);
            assert.equal(catalog.items[0].msgid, "a");
            assert.equal(catalog.items[1].msgid, "b");
            assert.equal(catalog.items[2].msgid, "c");
            done();
        });
    });

    it("Extracts strings concatenation from JavaScript source", function (done) {
        assert(fs.existsSync("tmp/test14.pot"));
        po.load("tmp/test14.pot", function (err, catalog) {
            assert.equal(err, null);
            assert.equal(catalog.items.length, 2);
            assert.equal(catalog.items[0].msgid, "Hello one concat!");
            assert.equal(catalog.items[0].msgstr, "");
            assert.equal(catalog.items[0].references.length, 1);
            assert.equal(catalog.items[0].references[0], "test/fixtures/concat.js:2");
            assert.equal(catalog.items[1].msgid, "Hello two concat!");
            assert.equal(catalog.items[1].msgstr, "");
            assert.equal(catalog.items[1].references.length, 1);
            assert.equal(catalog.items[1].references[0], "test/fixtures/concat.js:3");
            done();
        });
    });

    it("Support data-translate for old-school HTML style", function (done) {
        po.load("tmp/test15.pot", function (err, catalog) {
            assert.equal(err, null);
            assert.equal(catalog.items.length, 1);
            assert.equal(catalog.items[0].msgid, "Hello!");
            assert.equal(catalog.items[0].msgstr, "");
            assert.equal(catalog.items[0].references.length, 1);
            assert.equal(catalog.items[0].references[0], "test/fixtures/data.html:3");
            done();
        });
    });

    it("Extract strings from custom HTML file extensions", function (done) {
        assert(fs.existsSync("tmp/test16.pot"));
        po.load("tmp/test16.pot", function (err, catalog) {
            assert.equal(err, null);
            assert.equal(catalog.items.length, 2);
            assert.equal(catalog.items[0].msgid, "Custom file!");
            assert.equal(catalog.items[0].msgstr, "");
            assert.equal(catalog.items[0].references.length, 1);
            assert.equal(catalog.items[0].references[0], "test/fixtures/custom.extension:3");
            done();
        });
    });

    it("Extract strings from custom JS file extensions", function (done) {
        assert(fs.existsSync("tmp/test17.pot"));
        po.load("tmp/test17.pot", function (err, catalog) {
            assert.equal(err, null);
            assert.equal(catalog.items.length, 1);
            assert.equal(catalog.items[0].msgid, "Hello custom");
            assert.equal(catalog.items[0].msgstr, "");
            assert.equal(catalog.items[0].references.length, 1);
            assert.equal(catalog.items[0].references[0], "test/fixtures/custom.js_extension:2");
            done();
        });
    });

    it("Extracts strings from non-delimited attribute", function (done) {
        assert(fs.existsSync("tmp/test19.pot"));
        po.load("tmp/test19.pot", function (err, catalog) {
            assert.equal(err, null);
            assert.equal(catalog.items.length, 3);
            assert.equal(catalog.items[0].msgid, "Click to upload file");
            assert.equal(catalog.items[0].msgstr, "");
            assert.equal(catalog.items[0].references.length, 1);
            assert.equal(catalog.items[0].references[0], "test/fixtures/no_delimiter.html:3");
            assert.equal(catalog.items[1].msgid, "Selected a file to upload!");
            assert.equal(catalog.items[1].msgstr, "");
            assert.equal(catalog.items[1].references.length, 1);
            assert.equal(catalog.items[1].references[0], "test/fixtures/no_delimiter.html:5");
            done();
        });
    });

    it("Can customize the marker name", function (done) {
        assert(fs.existsSync("tmp/test20.pot"));
        po.load("tmp/test20.pot", function (err, catalog) {
            assert.equal(err, null);
            assert.equal(catalog.items.length, 1);
            assert.equal(catalog.items[0].msgid, "Hello custom");
            assert.equal(catalog.items[0].msgstr, "");
            assert.equal(catalog.items[0].references.length, 1);
            assert.equal(catalog.items[0].references[0], "test/fixtures/custom_marker_name.js:4");
            done();
        });
    });

    it("Can extract tapestry files", function (done) {
        assert(fs.existsSync("tmp/test21.pot"));
        po.load("tmp/test21.pot", function (err, catalog) {
            assert.equal(err, null);
            assert.equal(catalog.items.length, 1);
            assert.equal(catalog.items[0].msgid, "Bonjour from HelloWorld component.");
            assert.equal(catalog.items[0].msgstr, "");
            assert.equal(catalog.items[0].references.length, 1);
            assert.equal(catalog.items[0].references[0], "test/fixtures/tapestry.tml:2");
            done();
        });
    });
});
