/**
 * Created by Allan on 1/26/2015.
 */

function minimal() {
};

minimal.currentViewModule = null;
minimal.bodyElement = null;
minimal.rootViewModulesPath = null;
minimal.attemptedLink = null;

minimal.registerViewModules = function (viewModules) {
    this.viewModules = viewModules;
};

minimal.registerRootViewModulesPath = function (rootViewModulesPath) {
    this.rootViewModulesPath = rootViewModulesPath;
};

minimal.navigateToPage = function (moduleName, addToHistory) {
    var self = this;

    for (var i = 0; i < this.viewModules.length; i++) {

        if (self.viewModules[i].id == moduleName) {

            // unload existing module first

            if (null != this.currentViewModule) {
                this.currentViewModule.Deinitialize();
            }

            // remove all html content from body
            self.bodyElement.empty();

            if (self.viewModules[i].requiressession == true && application.podfolderimport == null) {
                self.attemptedLink = moduleName;
                self.navigateToPage("login", true)
            }
            else {
                // load all html content to body for new view module
                self.bodyElement.load(self.rootViewModulesPath + '/' + self.viewModules[i].path + '.html', function () {

                    // initialize new view module via javascript
                    loadjscssfile(self.rootViewModulesPath + '/' + self.viewModules[i].path + '.js', 'js', function () {

                        self.currentViewModule = ViewModule;
                        self.currentViewModule.Initialize(self);

                        var objectToSend = {};
                        objectToSend.moduleview = {};
                        objectToSend.moduleview.SecurityUserID = application.loggedInUserID;
                        objectToSend.moduleview.Name = moduleName;

                        if (true == addToHistory) {
                            history.pushState({modulename: moduleName}, null, null);
                        }

                        /*var track =  { page: moduleName, title: moduleName };
                        ga('set', track);
                        ga('send', 'pageview');*/
                    });
                });
            }

            break;
        }
    }

};

window.addEventListener("popstate", function(event) {

    minimal.navigateToPage(event.state.modulename, false)
});