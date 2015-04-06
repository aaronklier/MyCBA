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