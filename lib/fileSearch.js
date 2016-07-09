'use babel';
import async from 'async';
import _ from 'lodash';
const defaultFileSearchPattern = /.*\.feature/;
const defaultLineSearchPattern = /(Given|When|Then|And)([^\n\r]+)/;
const defaultMaxDepth = 20;

class FileSearch {
  constructor(options = {}){
    this.searchSubdirectories = _.get(options, 'searchSubdirectories', true);
    this.followSymlinks = _.get(options, 'followSymlinks', true);
    this.maxDepth = options.maxDepth || defaultMaxDepth;
    this.termPattern = /(Given|When|Then|And)/i;
    this.filePattern = defaultFileSearchPattern;
    this.linePattern = defaultLineSearchPattern;
  }
  getDirectoryEntries(directory, next){
    return directory.getEntries(next);
  }
  separateFilesAndDirectories(entries, next){
    const files = entries.filter(entry => entry.isFile());
    const filesWeCareAbout = files.filter(file => this.filePattern.test(file.getBaseName()));
    let subDirectories = entries.filter(entry => entry.isDirectory());
    if(!this.followSymlinks){
      subDirectories = entries.filter(entry => !entry.isSymbolicLink());
    }
    return next(null, filesWeCareAbout, subDirectories);
  }
  recurseOnSubdirectories(depth, files, subDirectories, next){
    if(!this.searchSubdirectories){
      return next(null, files, []);
    }
    const promises = subDirectories.map(subDirectory => this.searchFiles(subDirectory, ++depth));
    return next(null, files, promises);
  }
  readFiles(files, promises, next){
    const readFiles = (file, done) => file.read().then(text => done(null, text.split(/\r\n|\r|\n/g)));
    return async.map(files, readFiles, (err, fileText) => next(err, fileText, promises));
  }
  flattenLines(fileTextArrays, promises, next){
    const flatFileText = fileTextArrays.reduce((result, currentArray) => [...result, ...currentArray], []);
    return next(null, flatFileText, promises);
  }
  filterLines(fileText, promises, next){
    const filteredText = fileText.map(text => {
      const matches = text.match(this.linePattern);
      return matches && {
        gherkin: matches[1],
        text: matches[2].trim()
      };
    }).filter(i=>i);
    return next(null, filteredText, promises);
  }
  filterForTerm(fileText, promises, next){
    const filteredForTerm = fileText.filter(text => this.termPattern.test(text.gherkin));
    return next(null, filteredForTerm, promises);
  }
  searchFiles(directory, depth = 0){
    if(depth > this.maxDepth){
      return new Promise(resolve => resolve([]));
    }
    return new Promise((resolve, reject) => {
      async.waterfall([
        this.getDirectoryEntries.bind(this, directory),
        this.separateFilesAndDirectories.bind(this),
        this.recurseOnSubdirectories.bind(this, depth),
        this.readFiles.bind(this),
        this.flattenLines.bind(this),
        this.filterLines.bind(this),
        this.filterForTerm.bind(this)
      ], (err, fileText, promises) => {
        if(err){
          return reject(err);
        }
        const snippets = fileText.map(text => {
          return {text: text.text}
        });
        const addToSnippets = (promise, done) => {
          promise.then(newSnippets => {
            snippets.push(...newSnippets);
            return done();
          });
        };
        return async.each(promises, addToSnippets, () => resolve(snippets));
      });
    });
  }
};

module.exports = FileSearch;
