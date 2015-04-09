Package.describe({
  name: 'djedi:pres-interactions',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: 'Quizzes for yous slides',
  // URL to the Git repository containing the source code for this package.
  git: 'https://github.com/djedi23/meteor-pres-interactions',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.0.3.2');

  api.use(['djedi:pres-collections@0.0.1',
    'alanning:roles@1.2.13'],
    ['client', 'server']);
  api.use(['templating', 'jquery',
    'djedi:modules@0.1.0',
    'numeral:numeral@1.5.3'],
    ['client']);
  api.use(['mongo'],
    ['server']);

  
  api.addFiles(['client/quizz.html','client/quizz.js'],
    'client');

  api.addFiles(['server/method.js'],
    'server');

});

// Package.onTest(function(api) {
//   api.use('tinytest');
//   api.use('djedi:pres-interactions');
//   api.addFiles('djedi:pres-interactions-tests.js');
// });
