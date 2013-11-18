var langTemplate, po, template;

po = require('node-po');
var path = require('path');

template = function(module, body) {
  return "angular.module(\"" + module + "\").run(['gettextCatalog', function (gettextCatalog) {\n" + body + "\n}]);";
};

langTemplate = function(language, strings) {
  return "    gettextCatalog.setStrings('" + language + "', " + (JSON.stringify(strings)) + ");\n";
};

module.exports = function(grunt) {
  return grunt.registerMultiTask('nggettext_compile', 'Compile strings from .po files', function() {
    var options;
    options = this.options({
      module: 'gettext'
    });
    return this.files.forEach(function(file) {
      var body;
      body = '';
      file.src.forEach(function(input) {
        var catalog, data, item, strings, _i, _len, _ref;
        data = grunt.file.read(input);
        catalog = po.parse(data);
        if (!catalog.headers.Language) {
          throw new Error('No Language header found!');
        }
        strings = {};
        _ref = catalog.items;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          item = _ref[_i];
          strings[item.msgid] = item.msgstr.length === 1 ? item.msgstr[0] : item.msgstr;
        }
        return body += langTemplate(catalog.headers.Language, strings);
      });

      grunt.file.write(file.dest, template(options.module, body));

      if (options.concat) {
        var targets = Array.isArray(options.concat) ? options.concat : [ options.concat ];
        var concat  = grunt.config('concat') || {};

        targets.forEach(function(target) {
          target = path.normalize(target);
          var task = concat[target];

          if (!task) {
            grunt.log.error('Unknown concat target: ' + target);
            return;
          }

          if (task.src) {
            task.src = Array.isArray(task.src) ? task.src : [ task.src ];
            task.src.push(file.dest);
          } else if (task.files) {
            var files = task.files;

            for (var key in files) {
              files[key] = Array.isArray(files[key]) ? files[key] : [ files[key] ];
              files[key].push(file.dest);
            }
          } else if (Array.isArray(task)) {
              task.push(file.dest);
          } else {
            grunt.log.error('Could not find src or files in concat target: ' + target);
          }

          grunt.log.writeln('Added ' + file.dest.cyan + ' to ' + ('concat.' + target).cyan);

          grunt.config('concat', concat);
        });
      }
    });
  });
};
