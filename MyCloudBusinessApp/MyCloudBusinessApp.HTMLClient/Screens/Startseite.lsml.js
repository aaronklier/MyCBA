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

    var group = "<div class='tile-group triple firstTileGroup'><span class='groupHeader'>Create & Explore<span></div>";
    $(element).append(group);
    $(".firstTileGroup").append("<div class='tile triple bg-darkBlue' onClick='XYZ()'>" +
                                    "<div class='tile-content icon'>" +
                                       " <i class='icon-calendar'></i>" +
                                    "</div>" +
                                   " <div class='brand bg-darkBlue'>" +
                                        "<span class='label fg-white'>Create Event</span>" +
                                        "<div class='badge bg-teal'>" +
                                        "<i class='icon-plus-2 large'></i>" +
                                        "</div>"+
                                    "</div>" +
                                "</div>");
    $(".firstTileGroup").append("<div class='tile triple bg-darkRed' onClick='XYZ()'>" +
                                    "<div class='tile-content icon'>" +
                                       " <i class='icon-list'></i>" +
                                    "</div>" +
                                      " <div class='brand bg-darkRed'>" +
                                        "<span class='label fg-white'>Create Survey</span>" +
                                        "<div class='badge bg-lightRed'>" +
                                        "<i class='icon-plus-2 large'></i>" +
                                        "</div>" +
                                    "</div>" +
                                "</div>");
    $(".firstTileGroup").append("<div class='tile bg-darker' onClick='showMySurveys()'>" +
                                        "<div class='tile-content icon'>" +
                                           " <i class='icon-user'></i>" +
                                        "</div>" +
                                       " <div class='brand bg-darker'>" +
                                            "<span class='label fg-white'>Administration</span>" +
                                        "</div>" +
                                    "</div>");

    $(".firstTileGroup").append("<div class='tile bg-indigo' onClick='showAllSurveys()'>" +
                                    "<div class='tile-content icon'>" +
                                       " <i class='icon-calendar'></i>" +
                                    "</div>" +
                                   " <div class='brand bg-darkViolet'>" +
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


    myapp.activeDataWorkspace.ApplicationData.SurveysSortedByCreated().execute().then(function (results) {
        var group2 = "<div class='tile-group triple secondTileGroup'><span class='groupHeader'>Recent Surveys<span></div>";
        $(element).append(group2);
            $.each(results.results, function (key, survey) {
                if (key <= 3) {
                    
                    $(".secondTileGroup").append("<div class='tile triple bg-" + GetColor(key) + "' onClick='ViewSurvey(" + survey.Id + ")'>" +
                                                        "<div class='tile-content icon'>" +
                                                           " <i class='icon-" + GetTileIcon(survey)+ "'></i>" +
                                                           " <span>&nbsp"+ survey.Created.toUTCString() +"</span>" +
                                                        "</div>" +
                                                       " <div class='brand bg-darker'>" +
                                                            "<span class='label fg-white'><span style='color:orange;'>" + survey.SurveyName + "</span></br>CreatedBy: <span style='color:lightgray;'>" + survey.CreatedBy + "</span></br>Description: <span style='color:lightgray;'>" + survey.Description + "</span></span>" +
                                                        "</div>" +
                                                    "</div>");
                }
            });

            LoadComments();
    });
                
};


function LoadComments() {
    myapp.activeDataWorkspace.ApplicationData.CommentsSortedByCreated().expand("Survey").execute().then(function (results) {
        var group3 = "<div class='tile-group triple thirdTileGroup'><span class='groupHeader'>Recent Comments<img src='Content/Images/comment.png'><span></div>";
        $(".metro").append(group3);
        $.each(results.results, function (key, comment) {
            if (key <= 3) {
                $(".thirdTileGroup").append("<div class='tile triple bg-" + GetCommentColor(key) + "' onClick='ViewSurvey(" + comment.Survey.Id + ")'>" +
                                                    "<div class='tile-content' style='padding: 10px;'>" +
                                                        "<p style='color: white !important;'><u>" + comment.CreatedBy + "</u> wrote:</br><span style='font-size: 12px;'>" + comment.Message + "</span></p>" +
                                                    "</div>" +
                                                   " <div class='brand bg-darker'>" +
                                                        "<span class='label fg-white'>" + comment.Created.toUTCString() + "</span><span style='float:right;font-size:10px;color:orange;'>Survey: " + comment.Survey.SurveyName + "</span>" +
                                                    "</div>" +
                                                "</div>"); 
            }
        });
    });
}


function GetTileIcon(survey) {
    if (survey.isMeetingSurvey) return "calendar";
    return "list";
}
function GetColor(key) {
    switch (key) {
        case 0: return "olive";
        case 1: return "lightOrange";
        case 2: return "mauve";
        default: return "black";
    }
}
function GetCommentColor(key) {
    switch (key) {
        case 0: return "darkIndigo";
        case 1: return "darkCobalt";
        case 2: return "darkIndigo";
        case 3: return "darkCobalt";
        default: return "darkIndigo";
    }
}


function showMySurveys() {
    myapp.showBrowseSurveys();
}
function showAllSurveys() {
    myapp.showBrowseAllSurveys();
}
function showMyRooms() {
    myapp.showBrowseRooms();
}

function ViewSurvey(id) {
    myapp.activeDataWorkspace.ApplicationData.Surveys_SingleOrDefault(id).execute().then(function (results) {
        myapp.showViewSurveyDetails(results.results[0]);
    });
    
}


