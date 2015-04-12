using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Microsoft.Exchange.WebServices.Data;
using System.Text;
using System.Net.Mime;
using System.IO;

namespace LightSwitchApplication
{
    public class CalendarController : ApiController
    {
        // GET api/<controller>/5
        public string GetClosePollAndSendMail(int id)
        {
            Question question;
            Survey survey;
            Microsoft.LightSwitch.Framework.Server.O365PersonInfo currentSPuser;
            var surveyParticipants = new List<String>();
            using (ServerApplicationContext context = ServerApplicationContext.CreateContext())
            {
                question = context.DataWorkspace.ApplicationData.Questions_SingleOrDefault(id);
                survey = context.DataWorkspace.ApplicationData.Surveys_SingleOrDefault(question.Survey.Id);
                survey.isActive = false;
                context.DataWorkspace.ApplicationData.SaveChanges();
                currentSPuser = context.Application.User;
                var allAnswers = context.DataWorkspace.ApplicationData.Answers.GetQuery().Execute().Where(a => a.Question.Survey.Id == survey.Id); //Where(a => a.Question.Survey.Id == survey.Id).Select(a => a.PersonInfo.Email);
                foreach (var person in allAnswers.Select(a => a.CreatedBy).Distinct())
                {
                    //if CreatedBy == eine Email !
                    surveyParticipants.Add(person);
                }
            }

            if(!survey.isMeetingSurvey) return "Sucessfully closed poll and informed participants per Email!";
            
            //CREATE iCALENDAR EMAIL
                try
                {
                    ExchangeService service = new ExchangeService(ExchangeVersion.Exchange2013);
                    service.Credentials = new WebCredentials("Aaron@akldev.onmicrosoft.com", "Wienerfeld27");
                    service.AutodiscoverUrl(currentSPuser.PersonId, RedirectionUrlValidationCallback);

                    //### EMAIL senden ###
                    EmailMessage mail = new EmailMessage(service);
                    mail.ToRecipients.AddRange(surveyParticipants);
                    mail.Subject = "Survey closed: " + survey.SurveyName;
                    mail.Body = new MessageBody("Hi,\n\nthis is an auto-generated Email.\nThe survey '" + survey.SurveyName + "' is closed and the final option is chosen.\nPlease find enclosed the attached iCalendar file.");

                    var str = GetiCalendarString(question, survey, mail);
                    string memString = str;
                    // convert string to stream
                    byte[] buffer = Encoding.ASCII.GetBytes(memString);
                    MemoryStream ms = new MemoryStream(buffer);
                    mail.Attachments.AddFileAttachment("Event.ics", ms);                  

                    mail.Send();
                }
                catch (Exception ex)
                {
                    return ex.Message;
                }

           return "Successfully closed poll and send iCalendar files to the participants!";
            
        }

        private static String GetiCalendarString(Question question, Survey survey, EmailMessage mail)
        {
            // Now Contruct the ICS file using string builder
            StringBuilder str = new StringBuilder();
            str.AppendLine("BEGIN:VCALENDAR");
            str.AppendLine("PRODID:-//Schedule a Meeting");
            str.AppendLine("VERSION:2.0");
            str.AppendLine("METHOD:REQUEST");
            str.AppendLine("BEGIN:VEVENT");
            str.AppendLine(string.Format("DTSTART:{0:yyyyMMddTHHmmss}", question.StartDate));
            str.AppendLine(string.Format("DTSTAMP:{0:yyyyMMddTHHmmss}", DateTime.UtcNow));
            str.AppendLine(string.Format("DTEND:{0:yyyyMMddTHHmmss}", question.EndDate));
            str.AppendLine("LOCATION: " + survey.GeoLocationName);
            str.AppendLine(string.Format("UID:{0}", Guid.NewGuid()));
            str.AppendLine(string.Format("DESCRIPTION:{0}", survey.Description));
            str.AppendLine(string.Format("X-ALT-DESC;FMTTYPE=text/html:{0}", mail.Body));
            str.AppendLine(string.Format("SUMMARY:{0}", survey.SurveyName));
            str.AppendLine(string.Format("ORGANIZER:MAILTO:{0}", survey.CreatedBy));

            str.AppendLine(string.Format("ATTENDEE;CN=\"{0}\";RSVP=TRUE:mailto:{1}", mail.ToRecipients.First().Name, mail.ToRecipients.First().Address));

            str.AppendLine("BEGIN:VALARM");
            str.AppendLine("TRIGGER:-PT15M");
            str.AppendLine("ACTION:DISPLAY");
            str.AppendLine("DESCRIPTION:Reminder");
            str.AppendLine("END:VALARM");
            str.AppendLine("END:VEVENT");
            str.AppendLine("END:VCALENDAR");

            return str.ToString();
        }

        // GET api/<controller>/5
        public List<Object> GetConflicts(int id)
        {

            Microsoft.LightSwitch.Framework.Server.O365PersonInfo currentSPuser;
            Question question;
            using (ServerApplicationContext ctx = ServerApplicationContext.CreateContext())
            {
                currentSPuser = ctx.Application.User;

                //if user is external user  || null : return;

                question = ctx.DataWorkspace.ApplicationData.Questions_SingleOrDefault(id);
            }

            ExchangeService service = new ExchangeService(ExchangeVersion.Exchange2013);
            service.Credentials = new WebCredentials("Aaron@akldev.onmicrosoft.com", "Wienerfeld27");
            service.AutodiscoverUrl(currentSPuser.PersonId, RedirectionUrlValidationCallback);

            var start = question.StartDate;  //new DateTime(2015, 4, 9, 16, 50, 00);
            var end = question.EndDate;  //new DateTime(2015, 4, 9, 17, 30, 00);
            var calendar = CalendarFolder.Bind(service, WellKnownFolderName.Calendar, new PropertySet());

            // Set the start and end time and number of appointments to retrieve.
            var view = new CalendarView(start.Value, end.Value, 3); //new CalendarView(start, end, 10); 

            // Limit the properties returned to the appointment's subject, start time, and end time.
            view.PropertySet = new PropertySet(AppointmentSchema.Subject, AppointmentSchema.Start, AppointmentSchema.End, AppointmentSchema.Organizer, AppointmentSchema.Location);

            var appointments = calendar.FindAppointments(view);
            var list = new List<Object>();
            foreach(var appointment in appointments){
                list.Add(new { 
                            start = appointment.Start.ToString("f"),
                            end = appointment.End.ToString("f"),
                            subject = appointment.Subject, 
                            organizer = appointment.Organizer.Name,
                            location = appointment.Location
                });
            }

            return list;
        }

        private static bool RedirectionUrlValidationCallback(string redirectionUrl)
        {
            // The default for the validation callback is to reject the URL.
            bool result = false;

            Uri redirectionUri = new Uri(redirectionUrl);

            // Validate the contents of the redirection URL. In this simple validation
            // callback, the redirection URL is considered valid if it is using HTTPS
            // to encrypt the authentication credentials. 
            if (redirectionUri.Scheme == "https")
            {
                result = true;
            }
            return result;
        }
    }
}