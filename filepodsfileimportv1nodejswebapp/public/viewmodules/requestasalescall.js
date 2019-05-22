/**
 * Created by Allan on 1/27/2015.
 */

function ViewModule() { };

ViewModule.Title = "Leopard Data Request Sales Call";
ViewModule.minimal = null;

// page vars

// page controls

ViewModule.LinkDashboard = $('#LinkDashboard');
ViewModule.TextName = $("#TextName");
ViewModule.AlertTextName = $('#AlertTextName');
ViewModule.TextPhoneNumber = $('#TextPhoneNumber');
ViewModule.AlertTextPhoneNumber = $('#AlertTextPhoneNumber');
ViewModule.SubmitSalesCallRequest = $('#SubmitSalesCallRequest');

ViewModule.SalesRequestSentModal = $('#SalesRequestSentModal');

ViewModule.Initialize = function(minimal) {
    var self = this;

    self.minimal = minimal;

    // load page control references

    // initialize initial control state

    ViewModule.AlertTextName.hide();
    ViewModule.AlertTextPhoneNumber.hide();

    // load up events

    ViewModule.LinkDashboard.click(function() {
        minimal.navigateToPage('dashboard', true);
    });

    ViewModule.SubmitSalesCallRequest.click(function(e) {

        e.preventDefault();

        var validationFailed = false;

        if (ViewModule.TextName.val().length == 0) {
            validationFailed = true;
            ViewModule.AlertTextName.show();
        } else {
            ViewModule.AlertTextName.hide();
        }

        if (ViewModule.TextPhoneNumber.val().length == 0) {
            validationFailed = true;
            ViewModule.AlertTextPhoneNumber.show();
        } else {
            ViewModule.AlertTextPhoneNumber.hide();
        }

        if (false == validationFailed) {

            var objectToSend = {};

            objectToSend.salescallrequest = {};

            // security service
            objectToSend.salescallrequest.SecurityUserID = application.loggedInUserID;
            objectToSend.salescallrequest.RequestDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
            objectToSend.salescallrequest.Name = ViewModule.TextName.val();
            objectToSend.salescallrequest.PhoneNumber = ViewModule.TextPhoneNumber.val();

            postAjaj('/ajaj/RequestASalesCall', objectToSend, function (returnObject) {
                if (returnObject.result == true) {
                    ViewModule.SalesRequestSentModal.modal({
                        keyboard: false
                    });

                    setTimeout(function () {
                        ViewModule.SalesRequestSentModal.hide();
                        ViewModule.SalesRequestSentModal.removeData();
                    }, 4000);
                }
            });
        }

    });
};

ViewModule.Deinitialize = function() {
    var self = this;
};