/**
 * Created by Allan on 1/26/2015.
 */

application = {};

application.podfoldershare = null;

application.initialize = function(bodyElement) {

    minimal.bodyElement = bodyElement;

    minimal.registerRootViewModulesPath('viewmodules');

    minimal.registerViewModules(
        [
            { id: "home", title: "Home", path: "home", requiressession: false },
            { id: "login", title: "Login", path: "login", requiressession: false },
            { id: "dashboard", title: "Dashboard", path: "dashboard", requiressession: true },
            { id: "loggedout", title: "LoggedOut", path: "loggedout", requiressession: false },


            { id: "privacy", title: "Privacy", path: "privacy", requiressession: true },
            { id: "reportabug", title: "Report a Bug", path: "reportabug", requiressession: true },
            { id: "reportsiteproblem", title: "Report a Site Problem", path: "reportsiteproblem", requiressession: true },
        ]
    );

    minimal.navigateToPage("home", true);

    return application.minimal;
};

application.LogOut = function() {
    application.loggedInUserID = -1;
};

window.onbeforeunload = function() {
    application.LogOut();
}

