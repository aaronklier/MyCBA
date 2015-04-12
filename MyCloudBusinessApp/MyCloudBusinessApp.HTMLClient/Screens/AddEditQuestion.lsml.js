/// <reference path="~/GeneratedArtifacts/viewModel.js" />

// To-Do: vorheriges Schwestern Element (Div) : Label ebenfalls ausblenden
myapp.AddEditQuestion.QuestionName_postRender = function (element, contentItem) {
    if (contentItem.screen.Question.Survey.isMeetingSurvey) {
        $(element).css("display","none");
    }
};
myapp.AddEditQuestion.StartDate_postRender = function (element, contentItem) {
    if (!contentItem.screen.Question.Survey.isMeetingSurvey) {
        $(element).css("display", "none");
    }
};
myapp.AddEditQuestion.EndDate_postRender = function (element, contentItem) {
    if (!contentItem.screen.Question.Survey.isMeetingSurvey) {
        $(element).css("display", "none");
    }
};

myapp.AddEditQuestion.ClosePoll_execute = function (screen) {
    if (!screen.Question.Survey.isActive) {
        alert("Survey is already closed!");
        return;
    }
    $.getJSON('/api/Calendar/GetClosePollAndSendMail/' + screen.Question.Id, function (message) {
        alert(message);
    });

};