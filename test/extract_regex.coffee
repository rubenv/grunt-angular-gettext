assert = require 'assert'
mkAttrRegex = require('../tasks/extract').mkAttrRegex
mkPluralAttrRegex = require('../tasks/extract').mkPluralAttrRegex

describe 'Extract: Filter regex', ->
    regex = null

    beforeEach () ->
        regex = mkAttrRegex('{{', '}}')

    it 'Matches a simple string', ->
        hit = false
        while matches = regex.exec("{{'Hello'|translate}}")
            assert.equal(matches.length, 3)
            assert.equal(matches[2], 'Hello')
            hit = true
        assert(hit)

    it 'Matches double quotes', ->
        hit = false
        while matches = regex.exec('{{"Hello"|translate}}')
            assert.equal(matches.length, 3)
            assert.equal(matches[2], 'Hello')
            hit = true
        assert(hit)

    it 'Matches multiple strings', ->
        hit = 0
        while matches = regex.exec("{{'Hello'|translate}} {{\"Second\"|translate}}")
            if hit == 0
                assert.equal(matches.length, 3)
                assert.equal(matches[2], 'Hello')
            else if hit == 1
                assert.equal(matches.length, 3)
                assert.equal(matches[2], 'Second')
            hit++

        assert.equal(hit, 2)

    it 'Matches encoded quotes', ->
        hit = 0
        while matches = regex.exec("{{'Hello'|translate}} {{&quot;Second&quot;|translate}}")
            if hit == 0
                assert.equal(matches.length, 3)
                assert.equal(matches[2], 'Hello')
            else if hit == 1
                assert.equal(matches.length, 3)
                assert.equal(matches[2], 'Second')
            hit++

        assert.equal(hit, 2)

    it 'Matches spaces', ->
        hit = false
        while matches = regex.exec('{{ "Hello" | translate }}')
            assert.equal(matches.length, 3)
            assert.equal(matches[2], 'Hello')
            hit = true
        assert(hit)

    it 'Can customize delimiters', ->
        regex = mkAttrRegex('[[', ']]')
        hit = false
        while matches = regex.exec("[['Hello'|translate]]")
            assert.equal(matches.length, 3)
            assert.equal(matches[2], 'Hello')
            hit = true
        assert(hit)

describe 'Extract: Plural filter regex', ->
    regex = null

    beforeEach () ->
        regex = mkPluralAttrRegex('{{', '}}')

    it 'Matches a simple string', ->
        hit = false
        while matches = regex.exec("{{'Hello'|translateN:count:'somePlural'}}")
            assert.equal(matches.length, 5)
            assert.equal(matches[2], 'Hello')
            assert.equal(matches[4], 'somePlural')
            hit = true
        assert(hit)

    it 'Matches double quotes', ->
        hit = false
        while matches = regex.exec('{{"Hello"|translateN:count:"somePlural"}}')
            assert.equal(matches.length, 5)
            assert.equal(matches[2], 'Hello')
            assert.equal(matches[4], 'somePlural')
            hit = true
        assert(hit)

    it 'Matches multiple strings', ->
        hit = 0
        while matches = regex.exec("{{'Hello'|translateN:c:'firstPlural'}} {{\"Second\"|translateN:c:\"secondPlural\"}}")
            if hit == 0
                assert.equal(matches.length, 5)
                assert.equal(matches[2], 'Hello')
                assert.equal(matches[4], 'firstPlural')
            else if hit == 1
                assert.equal(matches.length, 5)
                assert.equal(matches[2], 'Second')
                assert.equal(matches[4], 'secondPlural')
            hit++

        assert.equal(hit, 2)

    it 'Matches encoded quotes', ->
        hit = 0
        while matches = regex.exec("{{'Hello'|translateN:c:'firstPlural'}} {{&quot;Second&quot;|translateN:c:&quot;secondPlural&quot;}}")
            if hit == 0
                assert.equal(matches.length, 5)
                assert.equal(matches[2], 'Hello')
                assert.equal(matches[4], 'firstPlural')
            else if hit == 1
                assert.equal(matches.length, 5)
                assert.equal(matches[2], 'Second')
                assert.equal(matches[4], 'secondPlural')
            hit++

        assert.equal(hit, 2)

    it 'Matches spaces', ->
        hit = false
        while matches = regex.exec('{{ "Hello" | translateN : c : "some" }}')
            assert.equal(matches.length, 5)
            assert.equal(matches[2], 'Hello')
            assert.equal(matches[4], 'some')
            hit = true
        assert(hit)

    it 'Can customize delimiters', ->
        regex = mkPluralAttrRegex('[[', ']]')
        hit = false
        while matches = regex.exec("[['Hello'|translateN:count:'some']]")
            assert.equal(matches.length, 5)
            assert.equal(matches[2], 'Hello')
            assert.equal(matches[4], 'some')
            hit = true
        assert(hit)

    it 'Can get number as count argument', ->
        hit = false
        while matches = regex.exec("{{'Hello'|translateN:2:'somePlural'}}")
            assert.equal(matches.length, 5)
            assert.equal(matches[2], 'Hello')
            assert.equal(matches[4], 'somePlural')
            hit = true
        assert(hit)
