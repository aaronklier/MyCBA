using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Microsoft.LightSwitch;
using Microsoft.LightSwitch.Security.Server;
namespace LightSwitchApplication
{
    public partial class ApplicationDataService
    {
        public Microsoft.LightSwitch.Framework.Server.O365PersonInfo GetSPUser(){

            using (ServerApplicationContext ctx = ServerApplicationContext.CreateContext())
            {
                var currUser = ctx.Application.User;
                return currUser;
            }

        }
    }
}
