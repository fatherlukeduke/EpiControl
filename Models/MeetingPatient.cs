using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EpiControl.Models
{
    public class MeetingPatient
    {
  
            public int MeetingPatientID { get; set; }
            public int MeetingID { get; set; }
            public int PatientNumber { get; set; }
            public bool VotingOpen { get; set; }

        
    }
}
