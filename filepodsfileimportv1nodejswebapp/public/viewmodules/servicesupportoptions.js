/**
 * Created by Allan on 1/27/2015.
 */

function ViewModule() { };

ViewModule.Title = "Leopard Data Services Support";
ViewModule.minimal = null;

// page vars

ViewModule.ServiceSupportOptions = null;

// page controls

ViewModule.LinkDashboard = $('#LinkDashboard');

ViewModule.SupportItemsTableBodyElement = $('#SupportItemsTableBodyElement');

ViewModule.loadProductSupportInformation = function(productId) {
    var self = this;

    var htmlToDisplay = ''

    for (var i = 0; i < ViewModule.ServiceSupportOptions.length; i++) {

        if (ViewModule.ServiceSupportOptions[i].ServiceOfferingID == productId) {

            htmlToDisplay += '  <tr>';
            htmlToDisplay += '      <td data-title=\"URL\" class="text-center"><a href=\"' + ViewModule.ServiceSupportOptions[i].URL + '\"">' + ViewModule.ServiceSupportOptions[i].URL + '</a></td>';
            htmlToDisplay += '      <td data-title=\"Name\" class="text-center">' + ViewModule.ServiceSupportOptions[i].SupportName + '</td>';
            htmlToDisplay += '      <td data-title=\"Description\" class="text-center">' + ViewModule.ServiceSupportOptions[i].SupportDescription + '</td>';
            htmlToDisplay += '  </tr>'

        }
    }

    ViewModule.SupportItemsTableBodyElement.html(htmlToDisplay);
};


ViewModule.Initialize = function(minimal) {
    var self = this;

    self.minimal = minimal;

    // load page control references

    // initialize initial control state

    // load up events

    ViewModule.LinkDashboard.click(function() {
        minimal.navigateToPage('dashboard', true);
    });

    postAjaj('/ajaj/RetrieveServiceOfferingSupportURLs', objectToSend, function (returnObject) {
        if (returnObject.result == true) {
            ViewModule.ServiceSupportOptions = returnObject.outData.serviceofferingsupporturls;

            $('input:radio[name="product"]').filter('[value="1"]').attr('checked', true);
            self.loadProductSupportInformation(1);
        }

    });

    $('input:radio[name="product"]').change(
        function(){

            if (fileLock == $("input[name='product']:checked").val()) {
                self.loadProductSupportInformation(1);
            }
            else if (fileShare == $("input[name='product']:checked").val()) {
                self.loadProductSupportInformation(2);
            }
            else if (fileVault == $("input[name='product']:checked").val()) {
                self.loadProductSupportInformation(3);
            }
        });
};

ViewModule.Deinitialize = function() {
    var self = this;
};