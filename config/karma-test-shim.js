require('reflect-metadata');

require('../sampleSrc/script.ts');
var testContext = require.context('../src',true,/\.spec\.ts$/);

testContext.keys().forEach(testContext);