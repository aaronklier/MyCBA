/// <reference path="~/GeneratedArtifacts/viewModel.js" />

myapp.Startseite.ScreenContent_render = function (element, contentItem) {
    $(element).addClass("metro");
    //var area = $(element).append("<div class='tile-area tile-area-dark' style='width: 1774px;'>");

            //$(titleArea).append("<div class='user-id'>" +
            //"<div class='user-id-image'>" +
            //"<span class='icon-user no-display1'></span>" +
            //"<img class='no-display' src='images/Battlefield_4_Icon.png'>" +
            //"</div>" +
            //"<div class='user-id-name'>" +
            //"<span class='first-name'>Sergey</span>" +
            //"<span class='last-name'>Pimenov</span>" +
            //"</div>" +
    //"</div>");

    var group = "<div class='tile-group triple firstTileGroup'></div>";
    $(element).append(group);
    $(".firstTileGroup").append("<div class='tile triple bg-cobalt' onClick='XY()'>" +
                                    "<div class='tile-content icon'>" +
                                       " <i class='icon-calendar'></i>" +
                                    "</div>" +
                                   " <div class='brand bg-darkCobalt myOwnOpacity'>" +
                                        "<span class='label fg-white'>Create Event</span>" +
                                        "<div class='badge bg-darkIndigo'>" +
                                        "<i class='icon-plus-2 large'></i>" +
                                        "</div>"+
                                    "</div>" +
                                "</div>");
    $(".firstTileGroup").append("<div class='tile triple bg-green' onClick='XY()'>" +
                                    "<div class='tile-content icon'>" +
                                       " <i class='icon-list'></i>" +
                                    "</div>" +
                                      " <div class='brand bg-darkEmerald myOwnOpacity'>" +
                                        "<span class='label fg-white'>Create Survey</span>" +
                                        "<div class='badge bg-darkIndigo'>" +
                                        "<i class='icon-plus-2 large'></i>" +
                                        "</div>" +
                                    "</div>" +
                                "</div>");
    $(".firstTileGroup").append("<div class='tile bg-indigo' onClick='showMySurveys()'>" +
                                        "<div class='tile-content icon'>" +
                                           " <i class='icon-user'></i>" +
                                        "</div>" +
                                       " <div class='brand bg-darkViolet'>" +
                                            "<span class='label fg-white'>Administration</span>" +
                                        "</div>" +
                                    "</div>");

    $(".firstTileGroup").append("<div class='tile bg-lightRed' onClick='showAllSurveys()'>" +
                                    "<div class='tile-content icon'>" +
                                       " <i class='icon-calendar'></i>" +
                                    "</div>" +
                                   " <div class='brand bg-crimson'>" +
                                        "<span class='label fg-white' style='font-size:12px;'>Browse Surveys</span>" +
                                    "</div>" +
                                "</div>");

    $(".firstTileGroup").append("<div class='tile bg-magenta' onClick='showMyRooms()'>" +
                                    "<div class='tile-content icon'>" +
                                       " <i class='icon-grid-view'></i>" +
                                    "</div>" +
                                   " <div class='brand bg-darkMagenta'>" +
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


