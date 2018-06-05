'use babel';
import provider from './provider';

module.exports = {
  config: {
    followSymlinks: {
      type: 'boolean',
      order: 0,
      title: 'Follow Symbolic Links',
      default: true,
      description: 'Search directories that are symbolic links'
    },
    maxDepth: {
      type: 'number',
      order: 1,
      title: 'Maximum Search Depth',
      default: 10,
      description: 'How many levels of directories to recursively search'
    },
    featureSettings: {
      type: 'object',
      order: 2,
      properties: {
        enabled: {
          type: 'boolean',
          title: 'Search Features',
          default: true,
          description: 'Search through .feature files to find autocomplete suggestions. Warning: turning this off will disable all suggestions.'
        },
        scanPath: {
          type: 'string',
          title: 'Scan Path',
          default: '/features',
          description: 'This is the relative path (from your project root) to your projects features directory.'
        },
      }
    },
    StepSettings: {
      type: 'object',
      order: 3,
      properties: {
        enabled: {
          type: 'boolean',
          title: 'Search Steps',
          default: true,
          description: 'Search through .py files to find autocomplete suggestions. Warning: turning this off will disable all suggestions.'
        },
        scanPath: {
          type: 'string',
          title: 'Scan Path',
          default: '/steps',
          description: 'This is the relative path (from your project root) to your projects steps directory.'
        },
      }
    }
  },

  activate: function() {
    return provider.load();
  },

  getProvider: function() {
    return provider
  }
};