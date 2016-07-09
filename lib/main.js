'use babel';
var provider = require('./provider');

module.exports = {
  config: {
    searchFeatures: {
      type: 'boolean',
      title: 'Search Features',
      default: true,
      description: 'Search through .feature files to find autocomplete suggestions'
    },
    featurePath: {
      type: 'string',
      title: 'Feature Path',
      default: '/features',
      description: 'This is the relative path (from your project root) to your projects features directory.'
    },
    searchSubdirectories: {
      type: 'boolean',
      title: 'Search Feature Sub-Directories',
      default: true,
      description: 'Recursively search directories under the feature directory for other .feature files'
    },
    matchAllGherkinTerms: {
      type: 'boolean',
      title: 'Match All Gherkin Terms',
      deafult: false,
      description: 'Suggest all Given/When/Then steps even if the current gherkin term does not match'
    },
    followSymlinks: {
      type: 'boolean',
      title: 'Follow Symbolic Links',
      default: true,
      description: 'Search directories that are symbolic links'
    },
    maxDepth: {
      type: 'number',
      title: 'Maximum Search Depth',
      default: 10,
      description: 'How many levels of directories to search'
    }
  },
  activate: function() {
    return provider.load();
  },
  getProvider: function() {
    return provider
  }
};
