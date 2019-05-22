/**
 * Created by Allan on 1/27/2015.
 */

function encodeURL(str){
    return str.replace(/\+/g, '-').replace(/\//g, '_').replace(/\=+$/, '');
}

function decodeUrl(str){
    str = (str + '===').slice(0, str.length + (str.length % 4));
    return str.replace(/-/g, '+').replace(/_/g, '/');
}

function ViewModule() { };

ViewModule.Title = "Leopard Data Folder Navigator Dashboard";
ViewModule.minimal = null;

// page vars

// page controls

ViewModule.LinkLogout = $('#LinkLogout');

ViewModule.DivTreeViewFolders = $('#treeviewfolders');
ViewModule.DivGridFolderFiles = $('#gridfolderfiles');
ViewModule.DivGridFolderFileRevisions = $('#gridfolderfilerevisions');
ViewModule.ButtonDownloadFile = $('#buttonDownloadFile');

ViewModule.filesDataSource = [];
ViewModule.podFileRevisionsDataSource = [];
ViewModule.selectedpodfileid = -1;

ViewModule.BuildTreeViewData = function(folders, parentFolderID, parentFolder) {

    parentFolder.items = [];

    for (var i = 0; i < folders.length; i++) {
        if (folders[i].FolderParentID == parentFolderID) {

            childFolder = {};
            childFolder.text = folders[i].Name;
            childFolder.imageUrl = "/images/tree/filepods-folderopen.png";
            childFolder.folder = folders[i];

            parentFolder.items.push(childFolder);

            ViewModule.BuildTreeViewData(folders, folders[i].FolderID, childFolder);
        }
    }

};

ViewModule.Initialize = function(minimal) {
    var self = this;

    self.minimal = minimal;

    // load page control references

    // initialize initial control state

    var objectToSend = {};

    objectToSend.folderid = application.podfoldershare.PodFolderID;

    postAjaj('/ajaj/RetrieveTreeIDByPodFolderID', objectToSend, function(returnObject) {

        objectToSend.treeid = returnObject.outData.treeid;

        postAjaj('/ajaj/RetrieveTreeByTreeID', objectToSend, function(returnObject) {

            var folders = returnObject.outData.folders;

            var parentFolder = {};

            for (var i = 0; i < folders.length; i++) {
                if (folders[i].FolderID == application.podfoldershare.PodFolderID) {
                    parentFolder.text = folders[i].Name;
                    parentFolder.folder = folders[i];
                    parentFolder.imageUrl = "/images/tree/filepods-folderopen.png";
                    break;
                }
            }

            self.BuildTreeViewData(folders, application.podfoldershare.PodFolderID, parentFolder);

            (ViewModule.DivTreeViewFolders).kendoTreeView({
                animation: {
                    collapse: false
                },
                dataSource: [ parentFolder ],
                select: function(e) {
                    console.log("Selecting", e.node);

                    ViewModule.ButtonDownloadFile.attr("disabled", true);

                    var objectToSend = {};

                    objectToSend.parentfolderid = application.podfoldershare.PodFolderID;

                    postAjaj('/ajaj/RetrievePodFilesByPodFolderParentID', objectToSend, function(returnObject) {

                        ViewModule.ButtonDownloadFile.attr('disabled', 'disabled');

                        ViewModule.filesDataSource = [];

                        for (var j = 0; j < returnObject.outData.podfiles.length; j++) {
                            var fileRow = {};
                            fileRow.Filename = returnObject.outData.podfiles[j].Filename;
                            fileRow.podparentfolderid = returnObject.outData.podfiles[j].PodParentFolderID;
                            ViewModule.filesDataSource.push(fileRow);
                        }

                        var grid = $('#gridfolderfiles').data('kendoGrid');

                        var localDataSource = new kendo.data.DataSource({ data: ViewModule.filesDataSource });
                        grid.setDataSource(localDataSource);
                        localDataSource.read();
                        grid.refresh();

                        grid.hideColumn(1);

                        ViewModule.podFileRevisionsDataSource = [];

                        var grid = $('#gridfolderfilerevisions').data('kendoGrid');

                        var localDataSource = new kendo.data.DataSource({ data: ViewModule.podFileRevisionsDataSource });
                        grid.setDataSource(localDataSource);
                        localDataSource.read();
                        grid.refresh();
                    });
                }
            });

        });

    });

    $(ViewModule.DivGridFolderFiles).kendoGrid({
        autobind: true,
        selectable: "row",
        groupable: false,
        scrollable: true,
        sortable: true,
        pageable: true,
        dataSource: {
            pageSize: 10
        },
        change: function(e) {
            var selectedRows = this.select();
            var selectedDataItems = [];

            for (var i = 0; i < selectedRows.length; i++) {
                var dataItem = this.dataItem(selectedRows[i]);
                selectedDataItems.push(dataItem);
            }

            var objectToSend = {};

            objectToSend.filename = selectedDataItems[0].Filename;
            objectToSend.podparentfolderid = selectedDataItems[0].podparentfolderid;

            postAjaj('/ajaj/RetrieveAllPodFileRevisionsByPodFileID', objectToSend, function(returnObject) {

                ViewModule.podFileRevisionsDataSource = [];

                ViewModule.ButtonDownloadFile.attr('disabled', 'disabled');

                for (var x = 0; x < returnObject.outData.podfilerevisions.length; x++) {
                    var revisionRow = {};
                    revisionRow.Revision = returnObject.outData.podfilerevisions[x].Revision;
                    revisionRow.Created = returnObject.outData.podfilerevisions[x].Created;
                    revisionRow.PodFileID = returnObject.outData.podfilerevisions[x].PodFileID;
                    ViewModule.podFileRevisionsDataSource.push(revisionRow);
                }

                var grid = $('#gridfolderfilerevisions').data('kendoGrid');

                var localDataSource = new kendo.data.DataSource({ data: ViewModule.podFileRevisionsDataSource });
                grid.setDataSource(localDataSource);
                localDataSource.read();
                grid.refresh();

                grid.hideColumn(2);
            });
        }
    });

    $(ViewModule.DivGridFolderFileRevisions).kendoGrid({
        autobind: false,
        selectable: "row",
        groupable: false,
        scrollable: true,
        sortable: true,
        pageable: true,
        dataSource: {
            pageSize: 10
        },
        change: function(e) {

            ViewModule.ButtonDownloadFile.removeAttr('disabled');

            var selectedRows = this.select();
            var selectedDataItems = [];

            for (var i = 0; i < selectedRows.length; i++) {
                var dataItem = this.dataItem(selectedRows[i]);
                selectedDataItems.push(dataItem);
            }

            ViewModule.selectedpodfileid = selectedDataItems[0].PodFileID;
        }
    });

    // load up events

    ViewModule.LinkLogout.click(function(event) {
        ViewModule.minimal.navigateToPage('loggedout', true);
        application.LogOut();
    });

    ViewModule.ButtonDownloadFile.click(function(event) {

        window.open('/downloadfile?' + encodeURL(btoa('podfileid=' + ViewModule.selectedpodfileid)), "");

    });

};

ViewModule.Deinitialize = function() {
    var self = this;
};