using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Microsoft.Exchange.WebServices.Data;

namespace LightSwitchApplication
{
    public class CalendarController : ApiController
    {

        // GET api/<controller>
        public string Get()
        {
            return "Not implemented";
        }


        // GET api/<controller>/5
        public List<Object> Get(int id)
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




        //### EMAIL senden:
        //EmailMessage mail = new EmailMessage(service);
        //mail.ToRecipients.Add("Aaron@akldev.onmicrosoft.com");
        //mail.Subject = "Email per EWS";
        //mail.Body = new MessageBody("this is the body of the mail..");
        //mail.Send();


        //// GET api/<controller>/5
        //public string Get(int id)
        //{
        //    return "value";
        //}

        //// POST api/<controller>
        //public void Post([FromBody]string value)
        //{
        //}

        //// PUT api/<controller>/5
        //public void Put(int id, [FromBody]string value)
        //{
        //}

        //// DELETE api/<controller>/5
        //public void Delete(int id)
        //{
        //}

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