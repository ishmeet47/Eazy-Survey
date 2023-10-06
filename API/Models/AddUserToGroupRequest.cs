public class AddUserToGroupRequest
{
    public int UserId { get; set; }
    public List<int> GroupIds { get; set; } = new List<int>();
}
