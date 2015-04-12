/// <reference path="~/GeneratedArtifacts/viewModel.js" />

var array = [];
var red = "#FF7585";
var orange = "#F2C283";
var green = "#A3F4D2";

myapp.ViewSurveyDetails.created = function (screen) {
    var details = screen.findContentItem("Details")
    details.handleViewDispose(function () {
        array = [];
    });
};


// #################### //
// ##### VOTING #####//

myapp.ViewSurveyDetails.Questions_ItemTap_execute = function (screen) {
    if (screen.Survey.isActive == false) {
        alert("Survey is no longer active!");
        return;
    }
    var id = screen.Questions.selectedItem.Id;
    var answer = $.grep(array, function (item) {
        return item.answer.Question.Id == id;
    });
    SetAnswerAndBackgroundcolor(answer[0].answer, answer[0].domElement);
};

myapp.ViewSurveyDetails.StartDate_postRender = function (element, contentItem) {
    var date = contentItem.value;
    $(element).text(weekday[date.getDay()] + ", " + date.toFormattedDate() + " " + date.toFormattedTime() + " - ");
};

myapp.ViewSurveyDetails.EndDate_postRender = function (element, contentItem) {
    var date = contentItem.value;
    $(element).text(weekday[date.getDay()] + ", " + date.toFormattedDate() + " " + date.toFormattedTime());
};

myapp.ViewSurveyDetails.QuestionsTemplate_postRender = function (element, contentItem) {
    if (contentItem.screen.Survey.isActive == false) return;
    var filter = "(Answer_Question eq " + msls._toODataString(contentItem.data.Id, ":Int32") + ")";
    myapp.activeDataWorkspace.ApplicationData.AnswersFilteredByUser().filter(filter).expand("Question").execute().then(function (results) {
        if (results.results.length < 1) { //array hat eine länge von 0 und ist daher leer == no response yet.
            var response = new myapp.Answer;
            response.Response = 3;
            response.setQuestion(contentItem.value);

            var object = new Object();
            var listItem = $(element).parent("li");
            $(listItem).addClass("surveyText");

            object.answer = response;
            object.domElement = listItem;
            array.push(object);
            SetBackgroundcolor(object.answer, object.domElement);
            SetConflictingEvents(contentItem, object.domElement);
        }
        else { //es gibt bereits eine answer
            var item = results.results[0];

            var object = new Object();
            object.answer = item;

            var listItem = $(element).parent("li");
            $(listItem).addClass("surveyText");
            object.domElement = listItem;
            array.push(object);
            SetBackgroundcolor(object.answer, object.domElement);
            SetConflictingEvents(contentItem, object.domElement);
        }
    },
        function (error) {
            alert(error);
        });
};

function SetConflictingEvents(contentItem, domElement) {
    if (contentItem.screen.Survey.isMeetingSurvey == false) return;
    $.getJSON('/api/Calendar/GetConflicts/' + contentItem.data.Id, function (data) {
        if (data[0] != null) {
            var alertHtml = GetAlertHtml(data[0]);
            $(domElement).append("<img class='alertIcon' src='Content/images/alert.png'>");
            $(domElement).attr("tooltip", "Konflikt mit Termin Subject: " + data[0].subject + " Start: " + data[0].start + " End: " + data[0].end + " Organizer: " + data[0].organizer + " Location: " + data[0].location);
        }
    });

}

function GetIconHtml(answer) {
    switch (answer.Response) {
        case 1: return "<img class='answerIcon votingIcon' src='Content/images/check.png'>";
        case 2: return "<img class='answerIcon votingIcon' src='Content/images/question.png'>";
        case 3: return "<img class='answerIcon votingIcon' src='Content/images/cross.png'>";
        default: return answer.Response;
    }
}
function DoIt(answer, domElement, color) {
    $(domElement).css("background", color);
    $(domElement).find(".votingIcon").remove();
    var iconToAdd = GetIconHtml(answer); //$(GetIconHtml(answer));
    $(domElement).append(iconToAdd);
}
function SetBackgroundcolor(answer, domElement) {
    switch (answer.Response) {
        case 1: //Yes
            DoIt(answer, domElement, green);
            break;
        case 2: //Maybe
            DoIt(answer, domElement, orange);
            break;
        case 3: //No
            DoIt(answer, domElement, red);
            break;
    }
}
function SetAnswerAndBackgroundcolor(answer, domElement) {
    switch (answer.Response) {
        case 1: //Yes
            if (answer.Question.Survey.AllowMaybe == false) {
                answer.Response = 3;
                DoIt(answer, domElement, red); //wird No
            }
            else {
                answer.Response = 2;
                DoIt(answer, domElement, orange); //wird Maybe
            }
            break;
        case 2: //Maybe
            answer.Response = 3;
            SetBackgroundcolor(answer, domElement, red); //wird No
            break;
        case 3: //No
            answer.Response = 1;
            SetBackgroundcolor(answer, domElement, green); //wird Yes
            break;
    }
}



// #################### //
// ##### COMMENTS #####//

myapp.ViewSurveyDetails.ScreenContent_render = function (element, contentItem) {
    $(element).append("<input type='text' value='' id='newMessage'/>")
};

myapp.ViewSurveyDetails.SendMessage_execute = function (screen) {
    var surveyId = screen.Survey.Id;
    var text = $('#newMessage').val();
    if (text == null || text.length < 1) {
        return;
    }
    var newComment = new myapp.Comment;
    newComment.Message = text;
    newComment.setSurvey(screen.Survey);
    return myapp.activeDataWorkspace.ApplicationData.saveChanges().then(function () {
        $('#newMessage').val('');
        //screen.getComments();
        screen.Comments.load();
    });
};
myapp.ViewSurveyDetails.Comments_postRender = function (element, contentItem) {
    var surveyId = contentItem.screen.Survey.Id;
    setInterval(function () {
        var filter = "(Comment_Survey eq " + msls._toODataString(surveyId, ":Int32") + ")";
        myapp.activeDataWorkspace.ApplicationData.Comments.filter(filter).execute().then(function (results) {
            var currentComments = contentItem.screen.Comments.count;
            if (results.results.length != currentComments) {
                contentItem.screen.Comments.load();
            }
        });
    }, 3000);
};
myapp.ViewSurveyDetails.CreatedBy1_postRender = function (element, contentItem) {
    $(element).css("font-weight", "bold");
};
myapp.ViewSurveyDetails.CommentsTemplate_postRender = function (element, contentItem) {
    $(element).parent("li").addClass("SurveyComment");
};
myapp.ViewSurveyDetails.Created_postRender = function (element, contentItem) {
    date = contentItem.value;
    $(element).text(weekday[date.getDay()] + ", " + date.toFormattedDate() + " " + date.toFormattedTime())
};





// #################### //
// ##### TAB 2 RESULTS #####//

function GetBackgroundColorForAnswer(answer) {
    switch (answer) {
        case "Yes": return green;
        case "Maybe": return orange;
        case "No": return red;
        default: return null;
    }
}
function GetIconForResultTable(value) {
    switch (value) {
        case "Yes": return "<img class='answerIcon' src='Content/images/check.png'>";
        case "Maybe": return "<img class='answerIcon' src='Content/images/question.png'>";
        case "No": return "<img class='answerIcon' src='Content/images/cross.png'>";
        default: return value;
    }
}

myapp.ViewSurveyDetails.ResultTable_render = function (element, contentItem) {

    $(element).append('<table id="votingTable" class="msls-table ui-responsive table-stripe msls-hstretch ui-table ui-table-reflow"><thead></thead><tbody></tbody');
    $.getJSON('/api/SurveyInfo/GetSurveyResults/' + contentItem.screen.Survey.Id, function (data) {
        $.each(data, function (key, row) {
            if (key == 0) {
                $.each(row, function (key, value) {
                    if (key == 0) { $("#votingTable thead").append('<th class="msls-table-header" style="width:25px !important;">' + value + '</th>'); return; }
                    $("#votingTable thead").append('<th class="msls-table-header">' + value + '</th>');
                });
                return;
            }
            //else
            $("#votingTable tbody").append('<tr></tr>');
            $.each(row, function (key, value) {
                $("#votingTable tbody tr:last").append('<td class="msls-column" style="background:' + GetBackgroundColorForAnswer(value) + ' ">' + GetIconForResultTable(value) + '</td>');
            });
        });
    });
    $(element).append('</table>');
};
