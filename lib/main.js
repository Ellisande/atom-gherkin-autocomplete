'use babel';
import provider from './provider';

module.exports = {
  config: {
    searchFeatures: {
      type: 'boolean',
      title: 'Search Features',
      default: true,
      description: 'Search through .feature files to find autocomplete suggestions. Warning: turning this off will disable all suggestions.'
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
