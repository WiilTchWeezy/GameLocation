using Entities;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL
{
    public interface IGameRepository
    {
        Task AddAsync(Game game);
        Task EditAsync(Game game);
        Task<Game> GetByIdAsync(int gameId);
    }
    public class GameRepository : RepositoryBase, IGameRepository
    {
        public GameRepository(IGameLocationDbContext dbContext) : base(dbContext)
        {
        }

        public Task AddAsync(Game game)
        {
            return Task.Run(() => {
                _dbContext.Add(game);
            });
        }

        public Task EditAsync(Game game)
        {
            return Task.Run(() => {
                _dbContext.Edit(game);
            });
        }

        public Task<Game> GetByIdAsync(int gameId)
        {
            return _dbContext.GameQuery.Where(x => x.Id == gameId).FirstOrDefaultAsync();
        }
    }
}
