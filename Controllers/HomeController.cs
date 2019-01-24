using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using EpiControl.Models;
using EpiControl.Common;
using System.Net.Http;
using Newtonsoft.Json;
using System.Collections.Specialized;
using System.Text;
using Newtonsoft.Json.Linq;

namespace EpiControl.Controllers
{
    

    public class HomeController : Controller
    {
        private EpiVoteControlContext db;

        public HomeController(EpiVoteControlContext context)
        {
            db = context;
        }

        public IActionResult Index()
        {
            var test = db.Patient.ToList();
            return View();
        }

        [Route("GetPatients/{meetingID}")]
        public ActionResult<List<Patient>> GetPatients(int meetingID)
        {

            List<Patient> patients= db.Patient.Where(m => m.MeetingID == meetingID).ToList();

            if (patients == null)
            {
                return NotFound("nopatients");
            }
            else
            {
                return patients;
            }
        }

        [Route("GetPatientDetails/{patientID}")]
        public async Task<ActionResult<Patient>> GetPatientDetails(int patientID)
        {
            try
            {
                Patient patient = await db.Patient.FindAsync(patientID);

                if (patient == null)
                {
                    return NotFound("nopatient");
                }
                else
                {
                    //get the voting status of teh patient from the API
                    //HttpClient client = new HttpClient();
                    //var response = await client.GetStringAsync("https://api.epivote.uk/GetPatient/" + patient.MeetingPatientID);

                    //MeetingPatient meetingPatient = JsonConvert.DeserializeObject<MeetingPatient>(response);
                    //patient.VotingOpen = meetingPatient.VotingOpen;

                    patient.Age = patient.DOB.ToAgeString();
                    return patient;
                }
            }
            catch (Exception e)
            {
                return StatusCode(500, e.Message);
            }

           
        }

        [HttpPost]
        [Route("AddQuestion")]
        public async Task<ActionResult<Patient>> AddPatient(string hospitalNumber, string surname, string firstname, DateTime DOB, int meetingID)
        {
            try
            {
                
                HttpClient client = new HttpClient();
                var response = await client.PostAsync("https://api.epivote.uk/AddPatient", new JsonContent(new { meetingID = meetingID }));
                response.EnsureSuccessStatusCode();
                string responseBody = await response.Content.ReadAsStringAsync();

                MeetingPatient meetingPatient = JsonConvert.DeserializeObject<MeetingPatient>(responseBody);

                Patient localPatient = new Patient();

                return localPatient;

            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        public class JsonContent : StringContent
        {
            public JsonContent(object obj) :
                base(JsonConvert.SerializeObject(obj), Encoding.UTF8, "application/json")
            { }
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
