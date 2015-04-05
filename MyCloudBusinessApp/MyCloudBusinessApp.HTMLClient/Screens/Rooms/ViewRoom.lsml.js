/// <reference path="~/GeneratedArtifacts/viewModel.js" />

myapp.ViewRoom.Details_postRender = function (element, contentItem) {
    // Write code here.
    var name = contentItem.screen.Room.details.getModel()[':@SummaryProperty'].property.name;
    contentItem.dataBind("screen.Room." + name, function (value) {
        contentItem.screen.details.displayName = value;
    });
}

