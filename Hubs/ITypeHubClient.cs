using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EpiControl.Hubs
{
    public interface ITypeHubClient
    {
        Task BroadcastMessage(string type, string payload);
    }
}
