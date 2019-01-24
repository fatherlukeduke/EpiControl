using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;


namespace EpiControl.Models
{
    public class EpiVoteControlContext : DbContext
    {
        public EpiVoteControlContext(DbContextOptions<EpiVoteControlContext> options)
        : base(options)
        { }

        public DbSet<Patient>  Patient { get; set; }
    }
}
