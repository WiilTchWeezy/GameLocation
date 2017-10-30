using Entities;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;

namespace DAL
{
    public interface IGameRepository
    {
        Task AddAsync(Game game);
        Task EditAsync(Game game);
        Task<Game> GetByIdAsync(int gameId);
        Task<List<Game>> GetGamesAsync();
    }
    public class GameRepository : RepositoryBase, IGameRepository
    {
        public GameRepository(IGameLocationDbContext dbContext) : base(dbContext)
        {
        }

        public async Task AddAsync(Game game)
        {
            await _dbContext.Add(game);
        }

        public async Task EditAsync(Game game)
        {
            await _dbContext.Edit(game);
        }

        public Task<Game> GetByIdAsync(int gameId)
        {
            return _dbContext.GameQuery.Where(x => x.Id == gameId).FirstOrDefaultAsync();
        }

        public async Task<List<Game>> GetGamesAsync()
        {
            return await _dbContext.GameQuery.ToListAsync();
        }
    }
}
