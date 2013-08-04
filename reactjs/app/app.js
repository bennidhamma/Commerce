require.config({
  deps: ["app"],
  paths: {
      jquery: "../lib/jquery",
      react: "../lib/react",
      jsx: "../lib/jsx",
      JSXTransformer: '../lib/JSXTransformer'
  },

  shim: {
      JSXTransformer: {
          exports: "JSXTransformer"
      }
  }
});
require(['main', 'react', 'jsx!views/game'], 
    function (Plus, React, Game) {

});
