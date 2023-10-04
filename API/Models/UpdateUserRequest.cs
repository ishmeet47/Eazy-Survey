public class UpdateUserRequest
{
    public string Username { get; set; }
    public string Password { get; set; }
    public List<int> GroupIds { get; set; } = new List<int>();
}
