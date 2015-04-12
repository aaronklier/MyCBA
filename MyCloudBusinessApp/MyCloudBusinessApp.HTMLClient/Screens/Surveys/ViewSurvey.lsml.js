/// <reference path="~/GeneratedArtifacts/viewModel.js" />

myapp.ViewSurvey.Details_postRender = function (element, contentItem) {
    // Write code here.
    var name = contentItem.screen.Survey.details.getModel()[':@SummaryProperty'].property.name;
    contentItem.dataBind("screen.Survey." + name, function (value) {
        contentItem.screen.details.displayName = value;
    });
  
}

myapp.ViewSurvey.AddQuestion_postRender = function (element, contentItem) {
    if (contentItem.screen.Survey.isMeetingSurvey) {
        $(element).css("display", "none");
    }
};


var eventArray = new Array();
myapp.ViewSurvey.ScreenContent_render = function (element, contentItem) {
    //$(element).empty();
    //contentItem.handleViewDispose(function () {
    //});
    if (!contentItem.screen.Survey.isMeetingSurvey) return;

    $(element).append("<div id='calendar'></div>");
    $(element).append('<div id="event_edit_container" style="display: none; height: auto; min-height: 42px; width: auto;">' +
     '<form>' +
         '<input type="hidden" />' +
         '<ul>' +
             '<li>' +
                 '<span>Date: </span><span class="date_holder"></span>' +
             '</li>' +
             '<li>' +
                 '<label for="start">Start Time: </label><select name="start"><option value="">Select Start Time</option></select>' +
             '</li>' +
             '<li>' +
                 '<label for="end">End Time: </label><select name="end"><option value="">Select End Time</option></select>' +
             '</li>' +
         '</ul>' +
     '</form>' +
 '</div>');

    var $calendar = $('#calendar');
    var id = 1;
    $calendar.weekCalendar({
        timeslotsPerHour: 4,
        allowCalEventOverlap: true,
        overlapEventsSeparate: true,
        firstDayOfWeek: 1,
        use24Hour: true,
        businessHours: { start: 8, end: 24, limitDisplay: true },
        daysToShow: 7,
        height: function ($calendar) {
            return $(window).height() - $("h1").outerHeight() - 1;
        },
        eventRender: function (calEvent, $event) {
            if (calEvent.end.getTime() < new Date().getTime()) {
                $event.css("backgroundColor", "#aaa");
                $event.find(".wc-time").css({
                    "backgroundColor": "#999",
                    "border": "1px solid #888"
                });
            }
        },
        eventNew: function (calEvent, $event) {
            var $dialogContent = $("#event_edit_container");
            resetForm($dialogContent);
            var startField = $dialogContent.find("select[name='start']").val(calEvent.start);
            var endField = $dialogContent.find("select[name='end']").val(calEvent.end);

            $dialogContent.dialog({
                modal: true,
                title: "New Calendar Event",
                close: function () {
                    $dialogContent.dialog("destroy");
                    $dialogContent.hide();
                    $('#calendar').weekCalendar("removeUnsavedEvents");
                },
                buttons: {
                    save: function () {
                        calEvent.id = id;
                        id++;
                        calEvent.start = new Date(startField.val());
                        calEvent.end = new Date(endField.val());
                        
                        eventArray.push(calEvent);
                        SaveEventToDatabase(calEvent, contentItem.screen);

                        $calendar.weekCalendar("removeUnsavedEvents");
                        $calendar.weekCalendar("updateEvent", calEvent);
                        $dialogContent.dialog("close");
                        $(".wc-title:contains('New Event')").parent(".wc-cal-event").children("div.wc-time").addClass("NewCalEventHeader");
                        $(".wc-title:contains('New Event')").parent(".wc-cal-event").addClass("NewCalEventBody");
                    },
                    cancel: function () {
                        $dialogContent.dialog("close");
                    }
                }
            }).show();

            $dialogContent.find(".date_holder").text($calendar.weekCalendar("formatDate", calEvent.start));
            setupStartAndEndTimeFields(startField, endField, calEvent, $calendar.weekCalendar("getTimeslotTimes", calEvent.start));

        },
        data: function (start, end, callback) {
            callback(getEventData());
        }
    });

    $("#calendar *").attr({ 'data-enhance': 'false', 'data-role': 'none' }); //damit jquery mobile nicht den html code upfucked
    $("#event_edit_container *").attr({ 'data-enhance': 'false', 'data-role': 'none' }); //damit jquery mobile nicht den html code upfucked

    $(".wc-prev").text('<');
    $(".wc-next").text(">");

    GetUserEventsAndFillCalendar();
};


function GetUserEventsAndFillCalendar() {

    $.getJSON('/api/Calendar/GetUserEvents', function (data) {
        $.each(data, function (key, event) {
            var calEvent = new Object();
            calEvent.id = event.itemId;
            calEvent.title = event.subject;
            calEvent.start = event.start;
            calEvent.end = event.end;

            eventArray.push(calEvent);

            $('#calendar').weekCalendar("removeUnsavedEvents");
            $('#calendar').weekCalendar("updateEvent", calEvent);
        });
        alert("Successfully imported Exchange Online Calendar items.");
    });

}

function SaveEventToDatabase(calEvent, screen) {
    var question = new myapp.Question;
    question.setSurvey(screen.Survey);
    question.StartDate = calEvent.start;
    question.EndDate = calEvent.end;
    
    return myapp.activeDataWorkspace.ApplicationData
    .saveChanges().then(function () {
        // Refresh the Questions
        screen.getSurveyQuestions();
    });
}

function resetForm($dialogContent) {
    $dialogContent.find("input").val("");
    $dialogContent.find("textarea").val("");
}

function displayMessage(message) {
    $('#message').html(message).fadeIn();
}

function setupStartAndEndTimeFields($startTimeField, $endTimeField, calEvent, timeslotTimes) {

    for (var i = 0; i < timeslotTimes.length; i++) {
        var startTime = timeslotTimes[i].start;
        var endTime = timeslotTimes[i].end;
        var startSelected = "";
        if (startTime.getTime() === calEvent.start.getTime()) {
            startSelected = "selected=\"selected\"";
        }
        var endSelected = "";
        if (endTime.getTime() === calEvent.end.getTime()) {
            endSelected = "selected=\"selected\"";
        }
        $startTimeField.append("<option value=\"" + startTime + "\" " + startSelected + ">" + timeslotTimes[i].startFormatted + "</option>");
        $endTimeField.append("<option value=\"" + endTime + "\" " + endSelected + ">" + timeslotTimes[i].endFormatted + "</option>");

    }
    $endTimeOptions = $endTimeField.find("option");
    $startTimeField.trigger("change");
}

function getEventData() {
    return eventArray;
}


String.prototype.padLeft = function (length, character) {
    return new Array(length - this.length + 1).join(character || ' ') + this;
};
Date.prototype.toFormattedTime = function () {
    return  [String(this.getHours()).padLeft(2, '0'),
            String(this.getMinutes()).padLeft(2, '0')].join(":");
};
Date.prototype.toFormattedDate = function () {
    return [String(this.getDate()).padLeft(2, '0'),
            String(this.getMonth() + 1).padLeft(2, '0'),
            String(this.getFullYear()).substr(2, 2)].join(".");
};

function GetFormattedDate(start, end) {
    return weekday[start.getDay()] + ", " + start.toFormattedDate() + " " + start.toFormattedTime() + " - " + end.toFormattedTime();
}

myapp.ViewSurvey.QuestionsTemplate_postRender = function (element, contentItem) {
    contentItem.dataBind("value", function (value) {
        if (contentItem.screen.Survey.isMeetingSurvey) {
            $(element).text(GetFormattedDate(contentItem.data.StartDate, contentItem.data.EndDate));
        }
        else {
            $(element).text(contentItem.data.TextQuestion);
        }
    });
};

var weekday = new Array(7);
weekday[0] = "Sonntag";
weekday[1] = "Montag";
weekday[2] = "Dienstag";
weekday[3] = "Mittwoch";
weekday[4] = "Donnerstag";
weekday[5] = "Freitag";
weekday[6] = "Samstag";

