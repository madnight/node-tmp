var
  vows   = require('vows'),
  assert = require('assert'),

  path   = require('path'),
  fs     = require('fs'),

  tmp    = require('../lib/tmp.js'),
  Test   = require('./base.js');


function _testDir(mode) {
  return function _testDirGenerated(err, name) {
    assert.ok(path.existsSync(name), 'Should exists');

    var stat = fs.statSync(name);
    assert.ok(stat.isDirectory(), 'Should be a directory');

    Test.testStat(stat, mode);
  };
}


vows.describe('Directory creation').addBatch({
  'when using without parameters': {
    topic: function () {
      tmp.dir(this.callback);
    },

    'should be a directory': _testDir(040700),
    'should have the default prefix': Test.testPrefix('tmp-')
  },

  'when using with prefix': {
    topic: function () {
      tmp.dir({ prefix: 'something' }, this.callback);
    },

    'should be a directory': _testDir(040700),
    'should have the provided prefix': Test.testPrefix('something')
  },

  'when using with postfix': {
    topic: function () {
      tmp.dir({ postfix: '.txt' }, this.callback);
    },

    'should be a directory': _testDir(040700),
    'should have the provided postfix': Test.testPostfix('.txt')

  },

  'when using multiple options': {
    topic: function () {
      tmp.dir({ prefix: 'foo', postfix: 'bar', mode: 0750 }, this.callback);
    },

    'should be a directory': _testDir(040750),
    'should have the provided prefix': Test.testPrefix('foo'),
    'should have the provided postfix': Test.testPostfix('bar')
  },

  'when using multiple options and mode': {
    topic: function () {
      tmp.dir({ prefix: 'complicated', postfix: 'options', mode: 0755 }, this.callback);
    },

    'should be a directory': _testDir(040755),
    'should have the provided prefix': Test.testPrefix('complicated'),
    'should have the provided postfix': Test.testPostfix('options')
  }
}).export(module);