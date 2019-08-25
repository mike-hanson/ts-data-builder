module.exports = function(w) {
  return {
    files: ['src/*.ts'],

    tests: ['spec/*.spec.ts'],

    env: {
      type: 'node'
    },

    testFramework: 'jasmine'
  };
};
