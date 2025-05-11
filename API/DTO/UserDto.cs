using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.DTO
{
    public class UserDto
    {
        public string Username { get; set; }
        public string UserType { get; set; }
        // Add other fields you want to return here...
        public List<GroupDto> Groups { get; set; }
    }

    public class GroupDto
    {
        public string Name { get; set; }
    }
}

