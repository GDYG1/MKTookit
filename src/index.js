console.log("Hello, world! This is index.js");
import lazy from "./lazy";

lazy();
let _dynamic = "dynamic";
(function () {
  setTimeout(() => {
    import(/* webpackPrefetch: true */ `./${_dynamic}.js`).then((module) => {
      module.default();
    });
  }, 10000);
})();
