﻿using System;
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
using Microsoft.Extensions.Configuration;
using System.Net.Http.Headers;

namespace EpiControl.Controllers
{
    

    public class HomeController : Controller
    {
        private EpiVoteControlContext db;
        private IConfiguration _configuration;

        public HomeController(EpiVoteControlContext context, IConfiguration configuration)
        {
            db = context;
            _configuration = configuration;
        }

        public IActionResult Index()
        {
            HomeView view = new HomeView() { ApiUrl = _configuration["ApiUrl"] };
            return View("Index", view);
        }

        [Route("home/GetPatients/{meetingID}")]
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

        [Route("home/GetPatientDetails/{patientID}")]
        public async Task<ActionResult<Patient>> GetPatientDetails(int patientID)
        {
            try
            {
                Patient patient = await db.Patient.FindAsync(patientID);

                if (patient == null)
                {
                    return NotFound("no-patient");
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
        [Route("home/AddPatient")]
        public async Task<ActionResult<Patient>> AddPatient(string token, int hospitalNumber, string surname, string firstname, DateTime DOB, int meetingID)
        {

            string url = _configuration["apiUrl"];

            try
            {
                
                HttpClient client = new HttpClient();
                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

                var response = await client.PostAsync(url + "/vote/AddPatient/" + meetingID.ToString(), null);
                
                response.EnsureSuccessStatusCode();
                string responseBody = await response.Content.ReadAsStringAsync();

                MeetingPatient meetingPatient = JsonConvert.DeserializeObject<MeetingPatient>(responseBody);

                try
                {
                    Patient localPatient = new Patient()
                    {
                        HospitalNumber = hospitalNumber,
                        Surname = surname,
                        Firstname = firstname,
                        DOB = DOB,
                        MeetingID = meetingID,
                        MeetingPatientID = meetingPatient.MeetingPatientID,
                        PatientNumber = meetingPatient.PatientNumber
                    };

                    localPatient.MeetingPatientID = meetingPatient.MeetingPatientID;

                    db.Patient.Add(localPatient);
                    db.SaveChanges();

                    return localPatient;
                }

                catch (Exception ex)
                {
                    return StatusCode(500,"Database error: " +  ex.Message);
                }
             

            }
            catch (Exception ex)
            {
                return StatusCode(500, "API error: " + url + " " + ex.Message );
            }
        }

        [HttpPost]
        [Route("home/AddLocalPatient")]
        public IActionResult AddLocalPatient(int meetingPatientID, int hospitalNumber, 
                                                string surname, string firstname, DateTime DOB, 
                                                int meetingID, int patientNumber)
        {
            try
            {
                Patient localPatient = new Patient()
                {
                    HospitalNumber = hospitalNumber,
                    Surname = surname,
                    Firstname = firstname,
                    DOB = DOB,
                    MeetingID = meetingID,
                    MeetingPatientID = meetingPatientID,
                    PatientNumber = patientNumber
                };

                db.Patient.Add(localPatient);
                db.SaveChanges();

                return Ok();
            }
            catch(Exception ex)
            {
                return StatusCode(500, "There was an issue updating the local database: " + ex.Message);
            }
        }

        //public class JsonContent : StringContent
        //{
        //    public JsonContent(object obj) :
        //        base(JsonConvert.SerializeObject(obj), Encoding.UTF8, "application/json")
        //    { }
        //}

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
