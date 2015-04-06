/// <reference path="~/GeneratedArtifacts/viewModel.js" />

myapp.Startseite.ScreenContent_render = function (element, contentItem) {
    
    $(element).append("<button onClick='showMySurveys()'>Administration</button>");
    $(element).append("<button onClick='showAllSurveys()'>Browse All Surveys</button>");
    $(element).append("<button onClick='showMyRooms()'>Rooms</button>");
};

function showMySurveys() {
    myapp.showBrowseSurveys();
}
function showAllSurveys() {
    myapp.showBrowseAllSurveys();
}
function showMyRooms() {
    myapp.showBrowseRooms();
}