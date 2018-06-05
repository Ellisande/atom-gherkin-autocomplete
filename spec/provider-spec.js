'use babel';
import provider from '../lib/provider';
import {
  mockFunction
} from 'mockolate';
describe("provider", () => {
  describe("config options", () => {
    let options;
    beforeEach(() => {
      atom.config.set('gherkin-autocomplete.followSymlinks', true);
      atom.config.set('gherkin-autocomplete.maxDepth', 100);

      atom.config.set('gherkin-autocomplete.featureSettings.scanPath', '/features');
      atom.config.set('gherkin-autocomplete.featureSettings.enabled', true);
      options = provider.getConfigOptions();
    });

    it('should be able to retreive the feature path', () => {
      expect(options.featureSettings.scanPath).toEqual('/features');
    });

    it('should be able to get the option for following symbolic links', () => {
      expect(options.followSymlinks).toEqual(true);
    });

    it('should be able to get the option for searching features', () => {
      expect(options.featureSettings.enabled).toEqual(true);
    });

    it('should be able to get the maximum search depth', () => {
      expect(options.maxDepth).toEqual(100);
    });
  });

  describe("rootDirectory", function() {
    it("gets the root directory", function() {
      expect(provider.rootDirectory()).toEqual(atom.project.rootDirectories[0].path);
    });
  });

});