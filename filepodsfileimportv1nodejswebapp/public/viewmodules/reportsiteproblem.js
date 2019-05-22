/**
 * Created by Allan on 1/27/2015.
 */

function ViewModule() { };

ViewModule.Title = "Leopard Data Title";
ViewModule.minimal = null;

// page vars

// page controls

ViewModule.LinkDashboard = $('#LinkDashboard');

ViewModule.TextProblem = $('#TextProblem');
ViewModule.AlertTextProblem = $('#AlertTextProblem');

ViewModule.ButtonSubmit = $('#ButtonSubmit');

ViewModule.ProblemSubmittedModal = $('#ProblemSubmittedModal');
ViewModule.ParagraphStatus = $("#ParagraphStatus");

ViewModule.Initialize = function(minimal) {
    var self = this;

    self.minimal = minimal;

    // load page control references

    // initialize initial control state

    ViewModule.AlertTextProblem.hide();

    // load up events

    ViewModule.LinkDashboard.click(function() {
        minimal.navigateToPage('dashboard', true);
    });

    ViewModule.ButtonSubmit.click(function(e) {

        //e.preventDefault();

        var validationFailed = false;

        if (ViewModule.TextProblem.val().length == 0) {
            validationFailed = true;
            ViewModule.AlertTextProblem.show();
        } else {
            ViewModule.AlertTextProblem.hide();
        }

        if (false == validationFailed) {

            var objectToSend = {};
            objectToSend.siteproblem = {};

            // services store account
            objectToSend.siteproblem.Reported = new Date().toISOString().slice(0, 19).replace('T', ' ');
            objectToSend.siteproblem.ReportedBySecurityUserID = application.loggedInUserID;
            objectToSend.siteproblem.Problem = ViewModule.TextProblem.val();

            postAjaj('/ajaj/ReportASiteProblem', objectToSend, function (returnObject) {
                if (returnObject.result == true) {
                    ViewModule.ProblemSubmittedModal.modal({
                        keyboard: false
                    });

                    setTimeout(function () {
                        ViewModule.ProblemSubmittedModal.hide();
                        ViewModule.ProblemSubmittedModal.removeData();
                    }, 3000);
                }
                else {
                    // this is bad, for some reason registration failed!
                    ViewModule.ParagraphStatus.text('Submission failed... please call Leopard Data at 806-305-0223 for support!');

                    ViewModule.ProblemSubmittedModal.modal({
                        keyboard: false
                    });

                    setTimeout(function () {
                        ViewModule.ProblemSubmittedModal.hide();
                        ViewModule.ProblemSubmittedModal.removeData();
                    }, 5000);
                }
            });
        }
    });
};

ViewModule.Deinitialize = function() {
    var self = this;
};