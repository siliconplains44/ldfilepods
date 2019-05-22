/**
 * Created by Allan on 1/27/2015.
 */

function ViewModule() { };

ViewModule.Title = "Leopard Data Title";
ViewModule.minimal = null;

// page vars

// page controls

//ViewModule.LoginLink = null;

var LinkDashboard = $('#LinkDashboard');

ViewModule.Initialize = function(minimal) {
    var self = this;

    self.minimal = minimal;

    // load page control references

    //self.LoginLink = $('#LoginLink');

    // initialize initial control state

    // load up events

    /*self.LoginLink.click(function(event) {
     self.minimal.navigateToPage('login');
     });*/

    LinkDashboard.click(function() {
        minimal.navigateToPage('dashboard', true);
    });
};

ViewModule.Deinitialize = function() {
    var self = this;
};