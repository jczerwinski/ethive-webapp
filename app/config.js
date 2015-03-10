System.config({
  "baseURL": "/",
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
    }
  }
});

System.config({
  "map": {
    "angular": "github:angular/bower-angular@1.3.14",
    "angular-bootstrap": "github:angular-ui/bootstrap-bower@0.12.1",
    "angular-cookies": "github:angular/bower-angular-cookies@1.3.14",
    "angular-inflector": "github:iobaixas/angular-inflector@0.2.0",
    "angular-restmod": "github:platanus/angular-restmod@1.1.8",
    "angular-ui-router": "github:angular-ui/ui-router@0.2.13",
    "grevory/angular-local-storage": "github:grevory/angular-local-storage@0.1.5",
    "lodash": "npm:lodash@3.4.0",
    "github:angular-ui/bootstrap-bower@0.12.1": {
      "angular": "github:angular/bower-angular@1.2.28"
    },
    "github:angular-ui/ui-router@0.2.13": {
      "angular": "github:angular/bower-angular@1.3.14"
    },
    "github:angular/bower-angular-cookies@1.3.14": {
      "angular": "github:angular/bower-angular@1.3.14"
    },
    "github:jspm/nodelibs-process@0.1.1": {
      "process": "npm:process@0.10.1"
    },
    "npm:lodash@3.4.0": {
      "process": "github:jspm/nodelibs-process@0.1.1"
    }
  }
});

