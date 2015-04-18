using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace LightSwitchApplication
{
    public class SurveyInfoController : ApiController
    {
        // GET api/<controller>/5
        public List<List<string>> GetSurveyResults(int id)
        {
            if (id == 0 || id < 1) return null;

            using (var context = ServerApplicationContext.CreateContext())
            {
                var allAnswersForSurvey = context.DataWorkspace.ApplicationData.Answers.GetQuery().Execute().Where(s => s.Question.Survey.Id == id).ToList();
                var distinctPersons = (from p in allAnswersForSurvey select p.CreatedBy).Distinct().ToList();
                var votingList = new List<List<string>>();

                //header
                var header = new List<string>();
                header.Add("Nr.");
                header.Add("Person");
                header.AddRange(context.DataWorkspace.ApplicationData.Questions.GetQuery().Execute().Where(q => q.Survey.Id == id).OrderBy(q => q.Id).Select(q => q.StartDate.HasValue ? q.StartDate + " - " + q.EndDate : q.TextQuestion).ToList());
                votingList.Add(header);
                //votings per Person
                var rowCounter = 1;
                foreach (var person in distinctPersons)
                {
                    var list = new List<string>();
                    //new TR (HTML)
                    list.Add(rowCounter.ToString());
                    list.Add(person);
                    var answers = allAnswersForSurvey.Where(a => a.CreatedBy == person).OrderBy(a => a.Question.Id).Select(a => a.Response).ToList();
                    foreach (var answer in answers)
                    {
                        list.Add(GetAnswer(answer));
                    }
                    votingList.Add(list);
                    rowCounter++;
                }

                return votingList;

            }
        }

        public string GetAnswer(int numberToConvert)
        {
            switch (numberToConvert)
            {
                case 1: return "Yes";
                case 2: return "Maybe";
                case 3: return "No";
                default: return "Error";
            };
        }

        public Object GetSurveyResultForChart(int id)
        {
            
            using (var context = ServerApplicationContext.CreateContext())
            {
                var questions = context.DataWorkspace.ApplicationData.Questions.GetQuery().Execute().Where(q => q.Survey.Id == id).OrderBy(q => q.Id).ToList();

                int count = 1;
                var myData = new Object[questions.Count+1];
                var labels = new string[4];
                labels[0] = "Questions";
                labels[1] = "Yes";
                labels[2] = "Maybe";
                labels[3] = "No";
                foreach (var question in questions)
                {
                    var answersYes = context.DataWorkspace.ApplicationData.Answers.GetQuery().Execute().Where(a => a.Question.Id == question.Id && a.Response == 1).Count();
                    var answersMaybe = context.DataWorkspace.ApplicationData.Answers.GetQuery().Execute().Where(a => a.Question.Id == question.Id && a.Response == 2).Count();
                    var answersNo = context.DataWorkspace.ApplicationData.Answers.GetQuery().Execute().Where(a => a.Question.Id == question.Id && a.Response == 3).Count();
                    var labelText = question.TextQuestion ?? question.StartDate.Value.ToString("g") + " - " + question.EndDate.Value.ToString("g");
                    var row = new Object[4];
                    row[0] = labelText;
                    row[1] = answersYes;
                    row[2] = answersMaybe;
                    row[3] = answersNo;
                    myData[count] = row;

                    count++;

                }//foreach

                myData[0] = labels;

                return myData;
            }//using
        }

    }
}