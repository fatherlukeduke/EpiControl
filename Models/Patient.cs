using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace EpiControl.Models
{
    [Table("Patients")]
    public class Patient
    { 
        public int PatientID { get; set; }
        public string Firstname { get; set; }
        public string Surname { get; set; }
        public DateTime DOB { get; set; }
        public int HospitalNumber { get; set; }
        public string PatientDetails { get; set; }
        public int MeetingID { get; set; }
        public int MeetingPatientID { get; set; }
        public int? PatientNumber { get; set; }
        
        [NotMapped]
        public string Age { get; set; }

    }
}
