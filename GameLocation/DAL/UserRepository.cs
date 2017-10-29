using Entities;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;

namespace DAL
{
    public interface IUserRepository
    {
        Task AddAsync(User user);
        Task EditAsync(User user);
        Task<User> GetByNamePassword(string name, string password);
    }
    public class UserRepository : RepositoryBase, IUserRepository
    {
        public UserRepository(IGameLocationDbContext dbContext) : base(dbContext)
        {
        }

        public Task AddAsync(User user)
        {
            return Task.Run(()=> {
                _dbContext.Add(user);
            });
        }

        public Task EditAsync(User user)
        {
            return Task.Run(() => {
                _dbContext.Edit(user);
            });
        }

        public Task<User> GetByNamePassword(string name, string password)
        {
            return _dbContext.UserQuery.Where(x => x.Name == name && x.Password == password).FirstOrDefaultAsync();
        }
    }
}
