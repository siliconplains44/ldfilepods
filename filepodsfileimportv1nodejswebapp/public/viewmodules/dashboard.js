/**
 * Created by Allan on 1/27/2015.
 */

function base64ArrayBuffer(arrayBuffer) {
    var base64    = ''
    var encodings = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'

    var bytes         = new Uint8Array(arrayBuffer)
    var byteLength    = bytes.byteLength
    var byteRemainder = byteLength % 3
    var mainLength    = byteLength - byteRemainder

    var a, b, c, d
    var chunk

    // Main loop deals with bytes in chunks of 3
    for (var i = 0; i < mainLength; i = i + 3) {
        // Combine the three bytes into a single integer
        chunk = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2]

        // Use bitmasks to extract 6-bit segments from the triplet
        a = (chunk & 16515072) >> 18 // 16515072 = (2^6 - 1) << 18
        b = (chunk & 258048)   >> 12 // 258048   = (2^6 - 1) << 12
        c = (chunk & 4032)     >>  6 // 4032     = (2^6 - 1) << 6
        d = chunk & 63               // 63       = 2^6 - 1

        // Convert the raw binary segments to the appropriate ASCII encoding
        base64 += encodings[a] + encodings[b] + encodings[c] + encodings[d]
    }

    // Deal with the remaining bytes and padding
    if (byteRemainder == 1) {
        chunk = bytes[mainLength]

        a = (chunk & 252) >> 2 // 252 = (2^6 - 1) << 2

        // Set the 4 least significant bits to zero
        b = (chunk & 3)   << 4 // 3   = 2^2 - 1

        base64 += encodings[a] + encodings[b] + '=='
    } else if (byteRemainder == 2) {
        chunk = (bytes[mainLength] << 8) | bytes[mainLength + 1]

        a = (chunk & 64512) >> 10 // 64512 = (2^6 - 1) << 10
        b = (chunk & 1008)  >>  4 // 1008  = (2^6 - 1) << 4

        // Set the 2 least significant bits to zero
        c = (chunk & 15)    <<  2 // 15    = 2^4 - 1

        base64 += encodings[a] + encodings[b] + encodings[c] + '='
    }

    return base64
}

function encodeURL(str){
    return str.replace(/\+/g, '-').replace(/\//g, '_').replace(/\=+$/, '');
}

function decodeUrl(str){
    str = (str + '===').slice(0, str.length + (str.length % 4));
    return str.replace(/-/g, '+').replace(/_/g, '/');
}

function ViewModule() { };

ViewModule.Title = "Leopard Data filePODS Folder Files Dashboard";
ViewModule.minimal = null;

// page vars

// page controls

ViewModule.LinkLogout = $('#LinkLogout');

ViewModule.ButtonUploadFile = $('#buttonuploadfile');
ViewModule.UploadaFileButton = $('#uploadaFileButton');
ViewModule.DivGridFolderFiles = $('#gridfolderfiles');
ViewModule.CloseButton = $('#CloseButton');

ViewModule.filesDataSource = [];


ViewModule.Initialize = function(minimal) {
    var self = this;

    self.minimal = minimal;

    // load page control references

    // initialize initial control state

    var objectToSend = {};

    objectToSend.folderid = application.podfolderimport.PodFolderID;

    $(ViewModule.DivGridFolderFiles).kendoGrid({
        autobind: true,
        selectable: "row",
        groupable: false,
        scrollable: true,
        sortable: true,
        pageable: true,
        dataSource: {
            pageSize: 10
        }
    });

    ViewModule.CloseButton.click(function(event) {

        ViewModule.UploadaFileButton.show();
        progress.html("");
        document.getElementById('file').val('');

    });

    // load up events

    ViewModule.LinkLogout.click(function(event) {
        ViewModule.minimal.navigateToPage('loggedout', true);
        application.LogOut();
    });

    ViewModule.ButtonUploadFile.click(function(event) {

        $('#uploadFileModal').modal({keyboard: false});

    });

    $('#file').change(function() {
        var file = document.getElementById('file').files[0];

        if (file) {
            $('#uploadaFileButton').removeAttr('disabled');
        }
    });

    ViewModule.loadFolderFiles = function() {

        var objectToSend = {};

        objectToSend.parentfolderid = application.podfolderimport.PodFolderID;
        objectToSend.podid = application.podfolderimport.PodID;

        postAjaj('/ajaj/RetrieveFilePodFilesByParentFolderID', objectToSend, function(returnObject) {

            ViewModule.filesDataSource = [];

            returnObject = JSON.parse(returnObject);

            for (var j = 0; j < returnObject.outData.podfolderfiles.length; j++) {
                var fileRow = {};
                fileRow.Filename = returnObject.outData.podfolderfiles[j].Filename;
                fileRow.podparentfolderid = returnObject.outData.podfolderfiles[j].PodParentFolderID;
                ViewModule.filesDataSource.push(fileRow);
            }

            var grid = $('#gridfolderfiles').data('kendoGrid');

            var localDataSource = new kendo.data.DataSource({ data: ViewModule.filesDataSource });
            grid.setDataSource(localDataSource);
            localDataSource.read();
            grid.refresh();

            grid.hideColumn(1);
        });

    };

    ViewModule.loadFolderFiles();

    ViewModule.UploadaFileButton.click(function(event) {

        var file = document.getElementById('file').files[0];
        var progress = $('#progress');
        var podfileid = -1;
        var fileid = -1;

        if (file) {

            ViewModule.UploadaFileButton.hide();
            progress.html(' please wait... your upload will start shortly! ');

            var reader = new FileReader();
            var size = file.size;
            var chunk_size = 1024 * 64;
            var chunks = [];

            var totalchunks = parseInt(size / chunk_size);

            if ((size % chunk_size) > 0)
                totalchunks += 1;

            var offset = 0;
            var bytes = 0;

            reader.onloadend = function(e) {
                if (e.target.readyState == FileReader.DONE) {
                    var chunk = e.target.result;
                    bytes += chunk.byteLength;

                    chunks.push(chunk);

                    var partorigsizeinbytes = chunk.byteLength;

                    chunk = pako.deflateRaw(chunk, {windowBits:15});

                    var partcompressedsizeinbytes = chunk.byteLength;

                    var base64BufferToTransmit = base64ArrayBuffer(chunk.buffer);

                    var jsonObjectToSend = {};
                    jsonObjectToSend.fileid = fileid;
                    jsonObjectToSend.partindex = chunks.length - 1;
                    jsonObjectToSend.partcontent = base64BufferToTransmit;
                    jsonObjectToSend.partoriginalsizeinbytes = partorigsizeinbytes;
                    jsonObjectToSend.partcompressedsizeinbytes = partcompressedsizeinbytes;
                    jsonObjectToSend.securityuserid = application.podfolderimport.OwnerSecurityUserID;

                    progress.html(chunks.length - 1 + ' chunks of ' + parseInt(totalchunks) + ' total chunks... ' + bytes + ' bytes...');

                    if ((offset < size)) {
                        $.post('/ajaj/uploadFilePart', jsonObjectToSend, function(data) {
                            offset += chunk_size;

                            var blob = file.slice(offset, offset + chunk_size);
                            reader.readAsArrayBuffer(blob);
                        });
                    }
                    else {

                        var jsonObjectToSend = {};
                        jsonObjectToSend.podfileid = podfileid;
                        jsonObjectToSend.securityuserid = application.podfolderimport.OwnerSecurityUserID;

                        $.post('/ajaj/flagUploadComplete', jsonObjectToSend, function(data) {
                            progress.html("file was uploaded! (press close button to upload another file), " + bytes + ' bytes processed...');
                            //initializeDhtmlSharesGrid(); reload this grid
                            ViewModule.loadFolderFiles();
                         });
                    };
                }
            };

            var jsonObjectToSend = {};
            jsonObjectToSend.filename = file.name;
            jsonObjectToSend.filesizeinbytes = size;
            jsonObjectToSend.folderparentid = application.podfolderimport.PodFolderID;
            jsonObjectToSend.podid = application.podfolderimport.PodID;

            $.post('/ajaj/startUpload', jsonObjectToSend, function(data) {

                var jsonObjectReceieved = JSON.parse(data);

                podfileid = jsonObjectReceieved.outData.podfileid;
                fileid = jsonObjectReceieved.outData.fileid;
                var blob = file.slice(offset, offset + chunk_size);
                reader.readAsArrayBuffer(blob);
            });
        }
    });

};

ViewModule.Deinitialize = function() {
    var self = this;
};