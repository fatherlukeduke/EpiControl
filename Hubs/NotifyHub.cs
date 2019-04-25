using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EpiControl.Hubs
{
    public class NotifyHub : Hub<ITypeHubClient>
    {
    }
}
