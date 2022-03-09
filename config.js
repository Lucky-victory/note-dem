SystemJS.config({
  baseURL:'https://unpkg.com/',
  defaultExtension: true,
  packages: {
    ".": {
      main: './.js',
      defaultExtension: 'js'
    }
  },
  meta: {
    '*.js': {
      'babelOptions': {
         // react:false
      }
    }
  },
  map: {
    'plugin-babel': 'systemjs-plugin-babel@latest/plugin-babel.js',
    'systemjs-babel-build': 'systemjs-plugin-babel@latest/systemjs-babel-browser.js',
    'showdown':'showdown/dist/showdown.min.js',
    'html-ent':"html-entities@2.3.2/lib/index.js"
  },
  transpiler: 'plugin-babel'
});

SystemJS.import('./main')
  .catch(console.error.bind(console));
