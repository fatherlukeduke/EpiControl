using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using EpiControl.Hubs;
using EpiControl.Models;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace EpiControl.Controllers
{
    public class MessageController : Controller
    {
        private IHubContext<NotifyHub, ITypeHubClient> _hubContext;

        public MessageController (IHubContext<NotifyHub, ITypeHubClient> hubContext)
        {
            _hubContext = hubContext;
        }

        [HttpPost]
        [Route("message/send/{msg}")]
        public string Post(string msg)
        {
            string retMessage = string.Empty;
            try
            {
                _hubContext.Clients.All.BroadcastMessage("success", msg);
                retMessage = "Success";
            }
            catch (Exception e)
            {
                retMessage = e.ToString();
            }
            return retMessage;
        }
    }
}
