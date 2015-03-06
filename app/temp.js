Original app-level dependencies
    'ngCookies',
        'ngResource',
        'ngSanitize',
        'ui.router',
        'LocalStorageModule',
        'focusOn',
        'ui.bootstrap',
        'ui.validate',
        'restangular',
        'restmod',
        'ngAutocomplete',
        'ui.select'
    ])

index.html scripts
    <!-- build:js scripts/vendor.js -->
    <!-- bower:js -->
    <script src="bower_components/jquery/jquery.js"></script>
    <script src="bower_components/angular/angular.js"></script>
    <script src="bower_components/angular-resource/angular-resource.js"></script>
    <script src="bower_components/angular-cookies/angular-cookies.js"></script>
    <script src="bower_components/angular-sanitize/angular-sanitize.js"></script>
    <script src="bower_components/angular-route/angular-route.js"></script>
    <script src="bower_components/angular-ui-router/release/angular-ui-router.js"></script>
    <script src="bower_components/angular-local-storage/angular-local-storage.js"></script>
    <script src="bower_components/ng-focus-on/ng-focus-on.js"></script>
    <script src="bower_components/angular-bootstrap/ui-bootstrap-tpls.js"></script>
    <script src="bower_components/angular-ui-utils/ui-utils.js"></script>
    <script src="bower_components/lodash/dist/lodash.compat.js"></script>
    <script src="bower_components/restangular/dist/restangular.js"></script>
    <script src="bower_components/angular-inflector/dist/angular-inflector.min.js"></script>
    <script src="bower_components/angular-restmod/dist/angular-restmod-bundle.min.js"></script>
    <script src="bower_components/ngAutocomplete/src/ngAutocomplete.js"></script>
    <script src="bower_components/angular-ui-select/dist/select.js"></script>
    <!-- endbower -->
    <script src="bower_components/angular-restmod/dist/plugins/dirty.js"></script>
    <script src="nodemongo.js"></script>
    <script type="text/javascript" src="//maps.googleapis.com/maps/api/js?libraries=places&sensor=false"></script>
    <script type="text/javascript" src="bower_components/money.js/money.js"></script>
    <!-- endbuild -->

        <!-- build:js({.tmp,app}) scripts/scripts.js -->
        <script src="app.js"></script>
        <script src="views/home/home.js"></script>
        <script src="views/provider/provider.js"></script>
        <script src="views/service/service.js"></script>
        <script src="views/service/new/new.js"></script>
        <script src="views/service/edit/edit.js"></script>
        <script src="views/service/serviceSelector/serviceSelector.js"></script>
        <script src="models/user.js"></script>
        <script src="views/login/login.js"></script>
        <script src="views/offer/offer.js"></script>
        <script src="views/signup/signup.js"></script>
        <script src="views/signup/signup.failure.js"></script>
        <script src="views/http500errorHandler/http500errorHandler.js"></script>
        <script src="views/not-found/not-found.js"></script>
        <script src="views/account/account.js"></script>
        <script src="views/provider/new/new.js"></script>
        <script src="views/offer/new/new.js"></script>
        <!-- endbuild -->


disabled wiredep in gruntfile