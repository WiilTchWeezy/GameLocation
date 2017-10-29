using BLL.Exception;
using DAL;
using Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BLL
{
    public interface IGameBLL
    {
        Task AddAsync(string name);
        Task EditAsync(int gameId, string name);
        Task<List<Game>> GetGamesAsync();
    }
    public class GameBLL : IGameBLL
    {
        private IGameRepository _gameRepository;
        private IGameLocationDbContext _dbContext;
        public GameBLL(IGameRepository gameRepository, IGameLocationDbContext dbContext)
        {

        }

        public async Task AddAsync(string name)
        {
            await _gameRepository.AddAsync(new Game { Name = name });
            await _dbContext.SaveChangesAsync();
        }

        public async Task EditAsync(int gameId, string name)
        {
            var game = await _gameRepository.GetByIdAsync(gameId);
            if (game == null)
                throw new BusinessException("Jogo não encontrado");
            game.Name = name;
            await _gameRepository.EditAsync(game);
            await _dbContext.SaveChangesAsync();
        }

        public async Task<List<Game>> GetGamesAsync()
        {
            return await _gameRepository.GetGamesAsync();
        }
    }
}
