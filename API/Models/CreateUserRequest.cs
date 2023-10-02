using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace API.Models
{
 public class CreateUserRequest
{
    public string Username { get; set; }
    public string Password { get; set; }
}

}