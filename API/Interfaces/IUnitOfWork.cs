namespace API.Interfaces
{
    public interface IUnitOfWork
    {
        Task<bool> SaveAsync();
    }
}