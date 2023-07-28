const {defaults} = require('jest-config')

module.exports = {
  preset: '@vue/cli-plugin-unit-jest',
  transform: {
    '^.+\\.vue$': 'vue-jest',
    '^.+\\.(js|jsx)?$': 'babel-jest'
  },
  testMatch: ['**/(*.)unit.js'],
  snapshotSerializers: [
    'jest-serializer-vue'
  ],
  transformIgnorePatterns: ['<rootDir>/node_modules/'],
  moduleFileExtensions: [...defaults.moduleFileExtensions, 'vue']
}
