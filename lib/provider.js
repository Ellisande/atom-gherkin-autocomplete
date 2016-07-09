'use babel';
import {Directory} from 'atom';
import async from 'async';
import FileSearch from './fileSearch';

const PATH_CONFIG_KEY = 'cucumber-complete.path';
const PROPERTY_PREFIX_PATTERN = /(?:^|\[|\(|,|=|:|\s)\s*((?:And|Given|Then|When)\s(?:[a-zA-Z]+\.?){0,2})$/;


module.exports = {
  selector: '.source.feature, .feature',
  filterSuggestions: true,
  load: function() {},
  getSuggestions: function({bufferPosition, editor}) {
    let line = editor.getTextInRange([[bufferPosition.row, 0], bufferPosition]);
    const options = this.getConfigOptions();
    console.log('The options are', options);
    if(!line.match(PROPERTY_PREFIX_PATTERN)){
      return [];
    }
    const gherkin = line.match(PROPERTY_PREFIX_PATTERN)[1].trim();
    const featuresDirectory = new Directory(`${this.rootDirectory()}${this.featuresDirectory()}`);
    if(options.searchFeatures){
      const searcher = new FileSearch(options);
      return searcher.searchFiles(featuresDirectory);
    } else {
      return new Promise(resolve => resolve([]));
    }

  },
  rootDirectory: function() {
    return atom.project.rootDirectories[0].path;
  },
  featuresDirectory: function(path=PATH_CONFIG_KEY) {
    return atom.config.get(path);
  },
  getConfigOptions: function(){
    return atom.config.getAll('gherkin-autocomplete')[0].value;
  }
};
