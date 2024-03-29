System.config({
  "baseURL": "/",
  "transpiler": "traceur",
  "paths": {
    "*": "*.js",
    "github:*": "jspm_packages/github/*.js",
    "npm:*": "jspm_packages/npm/*.js"
  }
});

System.config({
  "map": {
    "Elijen/angular-popover-toggle": "github:Elijen/angular-popover-toggle@0.0.10",
    "OpenBookPrices/country-data": "github:OpenBookPrices/country-data@0.0.19",
    "angular": "github:angular/bower-angular@1.4.3",
    "angular-bootstrap": "github:angular-ui/bootstrap-bower@0.13.0",
    "angular-cookies": "github:angular/bower-angular-cookies@1.4.0",
    "angular-deferred-bootstrap": "github:philippd/bower-angular-deferred-bootstrap@0.1.7",
    "angular-inflector": "github:iobaixas/angular-inflector@0.2.0",
    "angular-restmod": "github:platanus/angular-restmod@1.1.9",
    "angular-restmod-dirty": "github:platanus/angular-restmod@1.1.9/plugins/dirty",
    "angular-ui-router": "github:angular-ui/ui-router@0.2.15",
    "angular-ui-utils": "github:angular-ui/ui-utils@0.2.3",
    "bootstrap": "github:jczerwinski/bootstrap@master",
    "chieffancypants/angular-hotkeys": "github:chieffancypants/angular-hotkeys@1.4.5",
    "clean-css": "npm:clean-css@3.3.7",
    "components/font-awesome": "github:components/font-awesome@4.3.0",
    "css": "github:systemjs/plugin-css@0.1.13",
    "goodeggs/ng-focus-on": "github:goodeggs/ng-focus-on@0.2.2",
    "grevory/angular-local-storage": "github:grevory/angular-local-storage@0.1.5",
    "iobaixas/angular-inflector": "github:iobaixas/angular-inflector@0.2.0",
    "jczerwinski/bootstrap": "github:jczerwinski/bootstrap@master",
    "json": "github:systemjs/plugin-json@0.1.0",
    "lodash": "npm:lodash@3.9.3",
    "luisfarzati/angulartics": "github:luisfarzati/angulartics@0.18.0",
    "luisfarzati/angulartics-ga": "github:luisfarzati/angulartics@0.18.0/src/angulartics-ga",
    "money": "npm:money@0.2.0",
    "ng-focus-on": "github:goodeggs/ng-focus-on@0.2.2",
    "openexchangerates/money.js": "github:openexchangerates/money.js@0.1.3",
    "platanus/angular-restmod": "github:platanus/angular-restmod@1.1.9",
    "spin": "github:fgnass/spin.js@2.3.0",
    "text": "github:systemjs/plugin-text@0.0.2",
    "traceur": "github:jmcriffey/bower-traceur@0.0.88",
    "traceur-runtime": "github:jmcriffey/bower-traceur-runtime@0.0.88",
    "urish/angular-spinner": "github:urish/angular-spinner@0.6.1",
    "github:angular-ui/bootstrap-bower@0.13.0": {
      "angular": "github:angular/bower-angular@1.4.3"
    },
    "github:angular-ui/ui-router@0.2.15": {
      "angular": "github:angular/bower-angular@1.4.3"
    },
    "github:angular-ui/ui-utils@0.2.3": {
      "angular": "github:angular/bower-angular@1.4.3"
    },
    "github:angular/bower-angular-cookies@1.4.0": {
      "angular": "github:angular/bower-angular@1.4.3"
    },
    "github:chieffancypants/angular-hotkeys@1.4.5": {
      "angular": "github:angular/bower-angular@1.4.3"
    },
    "github:jspm/nodelibs-assert@0.1.0": {
      "assert": "npm:assert@1.3.0"
    },
    "github:jspm/nodelibs-buffer@0.1.0": {
      "buffer": "npm:buffer@3.3.1"
    },
    "github:jspm/nodelibs-events@0.1.1": {
      "events": "npm:events@1.0.2"
    },
    "github:jspm/nodelibs-http@1.7.1": {
      "Base64": "npm:Base64@0.2.1",
      "events": "github:jspm/nodelibs-events@0.1.1",
      "inherits": "npm:inherits@2.0.1",
      "stream": "github:jspm/nodelibs-stream@0.1.0",
      "url": "github:jspm/nodelibs-url@0.1.0",
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "github:jspm/nodelibs-https@0.1.0": {
      "https-browserify": "npm:https-browserify@0.0.0"
    },
    "github:jspm/nodelibs-os@0.1.0": {
      "os-browserify": "npm:os-browserify@0.1.2"
    },
    "github:jspm/nodelibs-path@0.1.0": {
      "path-browserify": "npm:path-browserify@0.0.0"
    },
    "github:jspm/nodelibs-process@0.1.1": {
      "process": "npm:process@0.10.1"
    },
    "github:jspm/nodelibs-stream@0.1.0": {
      "stream-browserify": "npm:stream-browserify@1.0.0"
    },
    "github:jspm/nodelibs-url@0.1.0": {
      "url": "npm:url@0.10.3"
    },
    "github:jspm/nodelibs-util@0.1.0": {
      "util": "npm:util@0.10.3"
    },
    "github:philippd/bower-angular-deferred-bootstrap@0.1.7": {
      "angular": "github:angular/bower-angular@1.4.3"
    },
    "github:platanus/angular-restmod@1.1.9": {
      "angular": "github:angular/bower-angular@1.4.3"
    },
    "npm:amdefine@1.0.0": {
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "module": "github:jspm/nodelibs-module@0.1.0",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.1"
    },
    "npm:assert@1.3.0": {
      "util": "npm:util@0.10.3"
    },
    "npm:buffer@3.3.1": {
      "base64-js": "npm:base64-js@0.0.8",
      "ieee754": "npm:ieee754@1.1.6",
      "is-array": "npm:is-array@1.0.1"
    },
    "npm:clean-css@3.3.7": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "commander": "npm:commander@2.8.1",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "http": "github:jspm/nodelibs-http@1.7.1",
      "https": "github:jspm/nodelibs-https@0.1.0",
      "os": "github:jspm/nodelibs-os@0.1.0",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.1",
      "source-map": "npm:source-map@0.4.4",
      "url": "github:jspm/nodelibs-url@0.1.0",
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:commander@2.8.1": {
      "child_process": "github:jspm/nodelibs-child_process@0.1.0",
      "events": "github:jspm/nodelibs-events@0.1.1",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "graceful-readlink": "npm:graceful-readlink@1.0.1",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.1"
    },
    "npm:core-util-is@1.0.1": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0"
    },
    "npm:graceful-readlink@1.0.1": {
      "fs": "github:jspm/nodelibs-fs@0.1.2"
    },
    "npm:https-browserify@0.0.0": {
      "http": "github:jspm/nodelibs-http@1.7.1"
    },
    "npm:inherits@2.0.1": {
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:lodash@3.9.3": {
      "process": "github:jspm/nodelibs-process@0.1.1"
    },
    "npm:os-browserify@0.1.2": {
      "os": "github:jspm/nodelibs-os@0.1.0"
    },
    "npm:path-browserify@0.0.0": {
      "process": "github:jspm/nodelibs-process@0.1.1"
    },
    "npm:punycode@1.3.2": {
      "process": "github:jspm/nodelibs-process@0.1.1"
    },
    "npm:readable-stream@1.1.13": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "core-util-is": "npm:core-util-is@1.0.1",
      "events": "github:jspm/nodelibs-events@0.1.1",
      "inherits": "npm:inherits@2.0.1",
      "isarray": "npm:isarray@0.0.1",
      "process": "github:jspm/nodelibs-process@0.1.1",
      "stream": "github:jspm/nodelibs-stream@0.1.0",
      "stream-browserify": "npm:stream-browserify@1.0.0",
      "string_decoder": "npm:string_decoder@0.10.31",
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:source-map@0.4.4": {
      "amdefine": "npm:amdefine@1.0.0",
      "process": "github:jspm/nodelibs-process@0.1.1"
    },
    "npm:stream-browserify@1.0.0": {
      "events": "github:jspm/nodelibs-events@0.1.1",
      "inherits": "npm:inherits@2.0.1",
      "readable-stream": "npm:readable-stream@1.1.13"
    },
    "npm:string_decoder@0.10.31": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0"
    },
    "npm:url@0.10.3": {
      "assert": "github:jspm/nodelibs-assert@0.1.0",
      "punycode": "npm:punycode@1.3.2",
      "querystring": "npm:querystring@0.2.0",
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:util@0.10.3": {
      "inherits": "npm:inherits@2.0.1",
      "process": "github:jspm/nodelibs-process@0.1.1"
    }
  }
});

