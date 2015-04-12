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
        partial void Comments_Inserting(Comment entity)
        {
                entity.Person = Application.Current.User.Email;
        }
    }
}
