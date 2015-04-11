/// <reference path="~/GeneratedArtifacts/viewModel.js" />

myapp.Startseite.ScreenContent_render = function (element, contentItem) {
    $(element).addClass("metro");
    $(element).append("<div class='tile double bg-crimson' onClick='showMySurveys()'>" +
                            "<div class='tile-content icon'>" +
                               " <i class='icon-user'></i>" +
                            "</div>" +
                           " <div class='brand bg-black'>" +
                                "<span class='label fg-white'>Administration</span>" +
                            "</div>" +
                        "</div>");

    $(element).append("<div class='tile double bg-orange' onClick='showAllSurveys()'>" +
                        "<div class='tile-content icon'>" +
                           " <i class='icon-calendar'></i>" +
                        "</div>" +
                       " <div class='brand bg-black'>" +
                            "<span class='label fg-white'>Browse All Surveys</span>" +
                        "</div>" +
                    "</div>");

    $(element).append("<div class='tile double bg-lightBlue' onClick='showMyRooms()'>" +
                        "<div class='tile-content icon'>" +
                           " <i class='icon-grid-view'></i>" +
                        "</div>" +
                       " <div class='brand bg-black'>" +
                            "<span class='label fg-white'>Rooms</span>" +
                        "</div>" +
                    "</div>");
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


