var Compiler = require('angular-gettext-tools').Compiler;

module.exports = function (grunt) {
    grunt.registerMultiTask('nggettext_compile', 'Compile strings from .po files', function () {
        var options = this.options();

        if (options.format && !Compiler.hasFormat(options.format)) {
            throw new Error('There is no "' + options.format + '" output format.');
        }

        this.files.forEach(function (file) {
            var inputs = file.src.map(function (input) {
                return grunt.file.read(input);
            });

            var compiler = new Compiler(options);

            grunt.file.write(file.dest, compiler.convertPo(inputs));
        });
    });
};
