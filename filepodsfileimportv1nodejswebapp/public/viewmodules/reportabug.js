/**
 * Created by Allan on 1/27/2015.
 */

function ViewModule() { };

ViewModule.Title = "Leopard Data Title";
ViewModule.minimal = null;

// page vars

// page controls

ViewModule.LinkDashboard = $('#LinkDashboard');

ViewModule.SelectService = $('#SelectService');
ViewModule.TextMajorVersion = $('#TextMajorVersion');
ViewModule.TextMinorVersion = $('#TextMinorVersion');
ViewModule.TextProblem = $('#TextProblem');

ViewModule.ButtonSubmit = $('#ButtonSubmit');

ViewModule.AlertSelectService = $('#AlertSelectService');
ViewModule.AlertTextMajorVersion = $('#AlertTextMajorVersion');
ViewModule.AlertTextMinorVersion = $('#AlertTextMinorVersion');
ViewModule.AlertTextProblem = $('#AlertTextProblem');

ViewModule.BugSubmittedModal = $('#BugSubmittedModal');
ViewModule.ParagraphStatus = $("#ParagraphStatus");

ViewModule.Initialize = function(minimal) {
    var self = this;

    self.minimal = minimal;

    // load page control references

    // initialize initial control state

    ViewModule.AlertSelectService.hide();
    ViewModule.AlertTextMajorVersion.hide();
    ViewModule.AlertTextMinorVersion.hide();
    ViewModule.AlertTextProblem.hide();

    // load up events

    ViewModule.LinkDashboard.click(function() {
        minimal.navigateToPage('dashboard', true);
    });

    ViewModule.ButtonSubmit.click(function(e) {

        //e.preventDefault();

        var validationFailed = false;

        if (ViewModule.SelectService.val() === "Select a service") {
            validationFailed = true;
            ViewModule.AlertSelectService.show();
        }
        else {
            ViewModule.AlertSelectService.hide();
        }

        if (ViewModule.TextMajorVersion.val().length == 0) {
            validationFailed = true;
            ViewModule.AlertTextMajorVersion.show();
        } else {
            ViewModule.AlertTextMajorVersion.hide();
        }

        if (ViewModule.TextMinorVersion.val().length == 0) {
            validationFailed = true;
            ViewModule.AlertTextMinorVersion.show();
        } else {
            ViewModule.AlertTextMinorVersion.hide();
        }

        if (ViewModule.TextProblem.val().length == 0) {
            validationFailed = true;
            ViewModule.AlertTextProblem.show();
        } else {
            ViewModule.AlertTextProblem.hide();
        }

        if (false == validationFailed) {

            var objectToSend = {};

            // services store account
            objectToSend.Report = ViewModule.TextProblem.val();
            objectToSend.Created = new Date().toISOString().slice(0, 19).replace('T', ' ');
            objectToSend.SecurityUserID = application.loggedInUserID;
            objectToSend.Service = ViewModule.SelectService.val();
            objectToSend.VersionMajor = ViewModule.TextMinorVersion.val();
            objectToSend.VersionMinor = ViewModule.TextMajorVersion.val();

            postAjaj('/ajaj/ReportABug', objectToSend, function (returnObject) {
                if (returnObject.result == true) {
                    ViewModule.BugSubmittedModal.modal({
                        keyboard: false
                    });

                    setTimeout(function () {
                        ViewModule.BugSubmittedModal.hide();
                        ViewModule.BugSubmittedModal.removeData();
                    }, 3000);
                }
                else {
                    // this is bad, for some reason registration failed!
                    ViewModule.ParagraphLoginCreationStatus.text('Submission failed... please call Leopard Data at 806-305-0223 for support!');

                    ViewModule.BugSubmittedModal.modal({
                        keyboard: false
                    });

                    setTimeout(function () {
                        ViewModule.BugSubmittedModal.hide();
                        ViewModule.BugSubmittedModal.removeData();
                    }, 5000);
                }
            });
        }

    });
};

ViewModule.Deinitialize = function() {
    var self = this;
};