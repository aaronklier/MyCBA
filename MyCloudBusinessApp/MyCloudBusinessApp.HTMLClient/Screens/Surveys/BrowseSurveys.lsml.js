/// <reference path="~/GeneratedArtifacts/viewModel.js" />


myapp.BrowseSurveys.ImageURL_postRender = function (element, contentItem) {

    if (contentItem.data.isMeetingSurvey) {
        $(element).html("<div class='metro'><div class='tile half bg-darkBlue'>" +
                        "<div class='tile-content icon'>" +
                        "<i class='icon-calendar'></i>" +
                        "</div>" +
                        "</div></div>");
    }
    else {
        $(element).html("<div class='metro'><div class='tile half bg-darkRed'>" +
                        "<div class='tile-content icon'>" +
                        "<i class='icon-list'></i>" +
                        "</div>" +
                        "</div></div>");
    }

};