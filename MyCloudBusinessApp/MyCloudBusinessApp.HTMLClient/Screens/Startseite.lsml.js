/// <reference path="~/GeneratedArtifacts/viewModel.js" />

myapp.Startseite.ScreenContent_render = function (element, contentItem) {
    
    $(element).append("<button onClick='showMySurveys()'>Surveys</button>");
    $(element).append("<button onClick='showMyRooms()'>Rooms</button>");
};

function showMySurveys() {
    myapp.showBrowseSurveys();
}
function showMyRooms() {
    myapp.showBrowseRooms();
}