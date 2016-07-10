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

    if(!line.match(PROPERTY_PREFIX_PATTERN)){
      return new Promise(resolve => resolve([]));
    }
    const featuresDirectory = new Directory(`${this.rootDirectory()}${options.featurePath}`);
    if(!featuresDirectory.existsSync()){
      const notificationDetails = {
        detail: 'You can change the path for your feature directory in the gherkin-autocomplete settings'
      }
      atom.notifications.addError(`Not directory found at feature path: ${this.rootDirectory()}${options.featurePath}`, notificationDetails);
      return new Promise(resolve => resolve([]));
    }
    if(options.searchFeatures){
      const searcher = new FileSearch(options);
      return searcher.searchFiles(featuresDirectory);
    }

    return new Promise(resolve => resolve([]));
  },
  rootDirectory: function() {
    return atom.project.rootDirectories[0].path;
  },
  getConfigOptions: function(){
    return atom.config.getAll('gherkin-autocomplete')[0].value;
  }
};
