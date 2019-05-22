/**
 * Created by Allan on 1/27/2015.
 */

function ViewModule() { };

ViewModule.Title = "Leopard Data Folder Distributor Store Home";

ViewModule.minimal = null;

// page vars

// page controls

ViewModule.AnchorLogin = $('#AnchorLogin');

ViewModule.Initialize = function(minimal) {
    var self = this;

    self.minimal = minimal;

    // load page control references

    // initialize initial control state

    // load up events

    self.AnchorLogin.click(function(event) {
        self.minimal.navigateToPage('login');
    });

};

ViewModule.Deinitialize = function() {
    var self = this;
};




