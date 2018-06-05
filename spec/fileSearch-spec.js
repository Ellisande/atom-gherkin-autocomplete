'use babel';
import FileSearch from '../lib/fileSearch';
import {
  Directory,
  File
} from 'atom';
import async from 'async';
const rootDirectory = process.cwd();

describe('file search', () => {
  describe('constructor', () => {
    describe('default options', () => {
      let searcher;
      beforeEach(() => searcher = new FileSearch());

      it('should follow symlinks by default', () => {
        expect(searcher.followSymlinks).toEqual(true);
      });

      it('should set max depth to 10', () => {
        expect(searcher.maxDepth).toEqual(10);
      });

      it('should match any term', () => {
        expect(searcher.termPattern).toEqual(/(Given|When|Then|And)/i);
      });

      it('should match only feature files', () => {
        expect(searcher.filePattern).toEqual(/.*\.feature/);
      });

      it('should match lines that start with given, when then, or and', () => {
        expect(searcher.linePattern).toEqual(/(Given|When|Then|And)([^\n\r]+)/);
      });
    });

    describe('settable options', () => {

      it('should allow turning off symlinks', () => {
        const searcher = new FileSearch({
          followSymlinks: false
        });
        expect(searcher.followSymlinks).toEqual(false);
      });

      it('should allow setting of math depth', () => {
        const searcher = new FileSearch({
          maxDepth: 100
        });
        expect(searcher.maxDepth).toEqual(100);
      });
    });
  });

  describe('get entries from directories', () => {
    const directory = new Directory(`${rootDirectory}/spec/features`);
    const searcher = new FileSearch({
      maxDepth: 1
    });
    it('should get all files and directories from the directory', () => {
      return new Promise(resolve => {
        searcher.getDirectoryEntries(directory, (err, entries) => {
          expect(entries.length).toEqual(3);
          resolve();
        });
      });
    });

    it('should throw an error if the file does not exist', () => {
      const fakeDirectory = new Directory(`${rootDirectory}/doesNotExist`);
      return new Promise(resolve => {
        searcher.getDirectoryEntries(fakeDirectory, err => {
          expect(err.code).toEqual('ENOENT');
          resolve();
        })
      });
    });
  });

  describe('separate files and directories', () => {
    it('should give all the files and subdirectories for the directory', () => {
      const directory = new Directory(`${rootDirectory}/spec/features`);
      const searcher = new FileSearch();
      return new Promise((resolve, reject) => {
        async.waterfall([
          next => directory.getEntries(next),
          (entries, next) => searcher.separateFilesAndDirectories(entries, next)
        ], (err, files, directories) => {
          if (err) {
            return reject();
          }
          expect(files.length).toEqual(1);
          expect(directories.length).toEqual(2)
          resolve();
        });
      });
    });
  });

  describe('recurse on subdirectories', () => {
    it('should not recurse if the option is not set', () => {
      const searcher = new FileSearch({
        maxDepth: 1
      });
      const directory = new Directory(`${rootDirectory}/spec/features`);
      return new Promise(resolve => {
        searcher.recurseOnSubdirectories(0, [], [directory], (err, files, promises) => {
          expect(promises.length).toEqual(0);
          return resolve();
        });
      });
    });

    it('should recurse if the option is set', () => {
      const searcher = new FileSearch();
      const directory = new Directory(`${rootDirectory}/spec/features`);
      return new Promise(resolve => {
        searcher.recurseOnSubdirectories(0, [], [directory], (err, files, promises) => {
          expect(promises.length).toEqual(1);
          return resolve();
        });
      });
    });
  });

  describe('read files', () => {
    it('should read the text from files', () => {
      const file = new File(`${rootDirectory}/spec/features/test.feature`);
      const searcher = new FileSearch();
      return new Promise((resolve, reject) => {
        searcher.readFiles([file], [], (err, fileText, promises) => {
          if (err) {
            return reject(err);
          }
          expect(fileText.length).toEqual(1);
          expect(fileText[0].length).toEqual(5);
          resolve();
        });
      })
    });
  });

  describe('flatten lines', () => {
    it('should produce a single array of lines from the files', () => {
      const fileText = [
        ['a', 'b', 'c'],
        ['d', 'e', 'f']
      ];
      const expectedText = ['a', 'b', 'c', 'd', 'e', 'f'];
      const searcher = new FileSearch();
      return new Promise((resolve, reject) => {
        searcher.flattenLines(fileText, [], (err, flatFileText) => {
          if (err) {
            return reject(err);
          }
          expect(flatFileText).toEqual(expectedText);
          resolve();
        });
      })
    });
  });

  describe('filterLines', () => {
    it('should filter valid gherkin lines', () => {
      const fileText = ['Given the things', 'Random stuff'];
      const searcher = new FileSearch();
      return new Promise((resolve, reject) => {
        searcher.filterLines(fileText, [], (err, filteredLines) => {
          if (err) {
            return reject(err);
          }
          expect(filteredLines.length).toEqual(1);
          expect(filteredLines[0].gherkin).toEqual('Given');
          expect(filteredLines[0].text).toEqual('the things');
          resolve();
        });
      });
    });
  });

  describe('filterForTerm', () => {
    const fileText = [{
      gherkin: 'Given',
      text: 'stuff'
    }, {
      gherkin: 'When',
      text: 'things'
    }, {
      gherkin: 'Scenario',
      text: 'more'
    }];
    const searcher = new FileSearch();
    return new Promise((resolve, reject) => {
      searcher.filterForTerm(fileText, [], (err, filteredText) => {
        if (err) {
          return reject(err);
        }
        expect(filteredText.length).toEqual(2);
        resolve();
      });
    });
  });

  describe('search files', () => {
    it('should return all gherkin steps under the directory', () => {
      const searcher = new FileSearch();
      const directory = new Directory(`${rootDirectory}/spec/features`);
      return new Promise((resolve, reject) => {
        searcher.searchFiles(directory).then(snippets => {
          expect(snippets.length).toEqual(6);
          resolve();
        }).catch(reject);
      });
    });
  });
});