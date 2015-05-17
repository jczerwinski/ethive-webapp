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
  "meta": {
    "angular": {
      "format": "global",
      "exports": "angular"
    },
    "github:platanus/angular-restmod@1.1.8": {
      "deps": [
        "angular",
        "angular-inflector"
      ]
    },
    "github:platanus/angular-restmod@1.1.8/plugins/dirty": {
      "deps": [
        "angular-restmod"
      ]
    }
  }
});

System.config({
  "map": {
    "OpenBookPrices/country-data": "github:OpenBookPrices/country-data@0.0.19",
    "angular": "github:angular/bower-angular@1.3.15",
    "angular-bootstrap": "github:angular-ui/bootstrap-bower@0.12.1",
    "angular-cookies": "github:angular/bower-angular-cookies@1.3.14",
    "angular-deferred-bootstrap": "github:philippd/bower-angular-deferred-bootstrap@0.1.7",
    "angular-inflector": "github:iobaixas/angular-inflector@0.2.0",
    "angular-restmod": "github:platanus/angular-restmod@1.1.8",
    "angular-restmod-dirty": "github:platanus/angular-restmod@1.1.8/plugins/dirty",
    "angular-ui-router": "github:angular-ui/ui-router@0.2.13",
    "angular-ui-utils": "github:angular-ui/ui-utils@0.2.3",
    "angulartics": "github:luisfarzati/angulartics@0.17.2",
    "angulartics-ga": "github:luisfarzati/angulartics@0.17.2/src/angulartics-ga",
    "bootstrap": "github:jczerwinski/bootstrap@master",
    "goodeggs/ng-focus-on": "github:goodeggs/ng-focus-on@0.2.2",
    "grevory/angular-local-storage": "github:grevory/angular-local-storage@0.1.5",
    "iobaixas/angular-inflector": "github:iobaixas/angular-inflector@0.2.0",
    "json": "github:systemjs/plugin-json@0.1.0",
    "lodash": "npm:lodash@3.4.0",
    "luisfarzati/angulartics": "github:luisfarzati/angulartics@0.17.2",
    "money": "npm:money@0.2.0",
    "ng-focus-on": "github:goodeggs/ng-focus-on@0.2.2",
    "ngAutocomplete": "github:wpalahnuk/ngAutocomplete@1.0.0",
    "openexchangerates/money.js": "github:openexchangerates/money.js@0.1.3",
    "platanus/angular-restmod": "github:platanus/angular-restmod@1.1.8",
    "spin": "github:fgnass/spin.js@2.1.0",
    "text": "github:systemjs/plugin-text@0.0.2",
    "traceur": "github:jmcriffey/bower-traceur@0.0.88",
    "traceur-runtime": "github:jmcriffey/bower-traceur-runtime@0.0.88",
    "urish/angular-spinner": "github:urish/angular-spinner@0.6.1",
    "wpalahnuk/ngAutocomplete": "github:wpalahnuk/ngAutocomplete@1.0.0",
    "github:angular-ui/bootstrap-bower@0.12.1": {
      "angular": "github:angular/bower-angular@1.2.28"
    },
    "github:angular-ui/ui-router@0.2.13": {
      "angular": "github:angular/bower-angular@1.3.15"
    },
    "github:angular-ui/ui-utils@0.2.3": {
      "angular": "github:angular/bower-angular@1.3.15"
    },
    "github:angular/bower-angular-cookies@1.3.14": {
      "angular": "github:angular/bower-angular@1.3.15"
    },
    "github:jspm/nodelibs-process@0.1.1": {
      "process": "npm:process@0.10.1"
    },
    "github:philippd/bower-angular-deferred-bootstrap@0.1.7": {
      "angular": "github:angular/bower-angular@1.3.15"
    },
    "github:platanus/angular-restmod@1.1.8": {
      "angular": "github:angular/bower-angular@1.3.15"
    },
    "npm:lodash@3.4.0": {
      "process": "github:jspm/nodelibs-process@0.1.1"
    }
  }
});

