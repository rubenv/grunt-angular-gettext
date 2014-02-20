var compile = require('angular-gettext-tools').compile;
var po = require('pofile');

module.exports = function (grunt) {
    grunt.registerMultiTask('nggettext_compile', 'Compile strings from .po files', function () {
        var options = this.options({
            format: 'javascript',
            module: 'gettext'
        });

        if (!compile.hasFormat(options.format)) {
            throw new Error('There is no "' + options.format + '" output format.');
        }


        this.files.forEach(function (file) {
            var inputs = file.src.map(function (input) {
                return grunt.file.read(input);
            });

            grunt.file.write(file.dest, compile.convertPo(inputs, options));
        });
    });
};
