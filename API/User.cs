using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API
{
    public class User
{
    public int Id { get; set; }
    public string Type { get; set; }  // "ADMIN" or "USER"
    public string Username { get; set; }
    public string Password { get; set; }
    //... other fields as necessary
}

}