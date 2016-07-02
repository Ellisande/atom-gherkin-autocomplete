'use babel';
var fs = require('fs');
var path = require('path');
import {Directory} from 'atom';

const PATH_CONFIG_KEY = 'cucumber-complete.path';
const CUCUMBER_STEP_DEF_PATTERN = /(Given|And|When|Then)\(\/\^(.*?)\$/g;
const CUCUMBER_KEYWORDS_PATTERN = /(Given|And|When|Then)(.*)/g;
const PROPERTY_PREFIX_PATTERN = /(?:^|\[|\(|,|=|:|\s)\s*((?:And|Given|Then|When)\s(?:[a-zA-Z]+\.?){0,2})$/;


module.exports = {
  selector: '.source.feature, .feature',
  filterSuggestions: true,
  load: function() {},
  getSuggestions: function({bufferPosition, editor}) {
    console.log(arguments);
    let file = editor.getText();
    let line = editor.getTextInRange([[bufferPosition.row, 0], bufferPosition]);
    const directory = new Directory(this.rootDirectory());
    return [{snippet: directory.getBaseName()}];
  },
  rootDirectory: function() {
    return atom.project.rootDirectories[0].path;
  },
  featuresDirectory: function(path=PATH_CONFIG_KEY) {
    return atom.config.get(path);
  }
};
