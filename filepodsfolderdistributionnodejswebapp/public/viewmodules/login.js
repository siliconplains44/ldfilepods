/**
 * Created by Allan on 1/27/2015.
 */

function ViewModule() { };

ViewModule.Title = "Leopard Data Services Store Login";
ViewModule.minimal = null;

// page vars

// page controls

ViewModule.SignInButton = $('#SignInButton');
ViewModule.LinkHome = $('#LinkHome');
ViewModule.TextUsername = $('#TextUsername');
ViewModule.TextPassword = $('#TextPassword');
ViewModule.LoginModal = $('#LoginModal');
ViewModule.ParagraphLoginStatus = $('#ParagraphLoginStatus');

ViewModule.Initialize = function(minimal) {
    var self = this;

    self.minimal = minimal;

    // load page control references

    // initialize initial control state

    ViewModule.TextUsername.focus();

    // load up events

    self.SignInButton.click(function(e) {

        e.preventDefault();

        var objectToSend = {};

        objectToSend.username = ViewModule.TextUsername.val();
        objectToSend.password = ViewModule.TextPassword.val();

        postAjaj('/ajaj/LoginSystemUser', objectToSend, function(returnObject) {

            if (returnObject.result == true) {
                if (returnObject.outData.accountexists == true) {
                    application.podfoldershare = returnObject.outData.podfoldershare;

                    ViewModule.ParagraphLoginStatus.text('You have successfully logged in, we are now redirecting you to your home page!');

                    ViewModule.LoginModal.modal({
                        keyboard: false
                    });

                    setTimeout(function () {
                        ViewModule.LoginModal.hide();
                        ViewModule.LoginModal.removeData();

                        if (minimal.attemptedLink != null) {
                            self.minimal.navigateToPage(minimal.attemptedLink, true);
                        }
                        else {
                            self.minimal.navigateToPage('dashboard', true);
                        }
                    }, 3000);
                }
                else {
                    // this is bad, for some reason registration failed!
                    ViewModule.ParagraphLoginStatus.text('Login failed... please call Leopard Data at 806-305-0223 for support!');

                    ViewModule.LoginModal.modal({
                        keyboard: false
                    });

                    setTimeout(function () {
                        ViewModule.LoginModal.hide();
                        ViewModule.LoginModal.removeData();
                    }, 5000);
                }
            }

        });
    });

    self.LinkHome.click(function() {
        minimal.navigateToPage('home', true);
    });


};

ViewModule.Deinitialize = function() {
    var self = this;
};
