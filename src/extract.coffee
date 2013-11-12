cheerio = require 'cheerio'
po = require 'node-po'
esprima = require 'esprima'

escapeRegex = /[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g

mkAttrRegex = (startDelim, endDelim) ->
    start = startDelim.replace(escapeRegex, "\\$&")
    end = endDelim.replace(escapeRegex, "\\$&")
    attrRegex = new RegExp(start + '\\s*(\'|"|&quot;)(.*?)\\1\\s*\\|\\s*translate\\s*' + end, 'g')
    return attrRegex

mkPluralAttrRegex = (startDelim, endDelim) ->
    start = startDelim.replace(escapeRegex, "\\$&")
    end = endDelim.replace(escapeRegex, "\\$&")
    attrRegex = new RegExp(start + '\\s*(\'|"|&quot;)(.*?)\\1\\s*\\|\\s*translateN\\s*:(?:.*?):\\s*(\'|"|&quot;)?(.*?)?\\3(?:.*?)' + end, 'g')
    return attrRegex

module.exports = (grunt) ->
    grunt.registerMultiTask 'nggettext_extract', 'Extract strings from views', () ->
        options = @options({
            startDelim: '{{'
            endDelim: '}}'
        })
        attrRegex = mkAttrRegex(options.startDelim, options.endDelim)
        pluralAttrRegex = mkPluralAttrRegex(options.startDelim,
                                            options.endDelim)

        @files.forEach (file) ->
            failed = false
            catalog = new po()

            strings = {}

            escape = (str) ->
                str = str.replace(/\\/g, '\\\\')
                str = str.replace(/"/g, '\\"')
                return str

            addString = (file, string, plural = null) ->
                string = string.trim()
                if !strings[string]
                    strings[string] = new po.Item()
                item = strings[string]
                item.msgid = escape(string)
                item.references.push(file) if file not in item.references
                if plural && plural != ''
                    if item.msgid_plural && item.msgid_plural != plural
                        grunt.log.error "Incompatible plural definitions for #{string}: #{item.msgid_plural} / #{plural} (in: #{item.references.join(", ")})"
                        failed = true
                    item.msgid_plural = escape(plural)
                    item.msgstr = ["", ""]

            extractHtml = (filename) ->
                src = grunt.file.read(filename)
                $ = cheerio.load(src)
                $('*').each (index, n) ->
                    node = $(n)
                    if typeof node.attr('translate') != 'undefined'
                        str = node.html()
                        plural = node.attr('translate-plural')
                        addString(filename, str, plural)

                while matches = attrRegex.exec(src)
                    addString(filename, matches[2])

                while matches = pluralAttrRegex.exec(src)
                    addString(filename, matches[2], matches[4])

            walkJs = (node, fn) ->
                fn(node)
                for key, obj of node
                    walkJs(obj, fn) if typeof obj == 'object'

            extractJs = (filename) ->
                src = grunt.file.read(filename)
                syntax = esprima.parse(src, { tolerant: true })

                walkJs syntax, (node) ->
                    if node?.type == 'CallExpression' && node.callee?.name == 'gettext'
                        str = node.arguments?[0].value
                        addString(filename, str) if str

            file.src.forEach (input) ->
                extractHtml(input) if input.match /\.(htm(|l)|php|phtml)$/
                extractJs(input) if input.match /\.js$/

            catalog.headers =
                "Content-Type": "text/plain; charset=UTF-8"
                "Content-Transfer-Encoding": "8bit"

            for key, string of strings
                catalog.items.push(string)

            if !failed
                grunt.file.write(file.dest, catalog.toString())

module.exports.mkAttrRegex = mkAttrRegex
module.exports.mkPluralAttrRegex = mkPluralAttrRegex
