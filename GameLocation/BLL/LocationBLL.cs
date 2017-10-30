using BLL.Exception;
using DAL;
using Entities;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BLL
{
    public interface ILocationBLL
    {
        Task AddAsync(int friendId,  int gameId);
        Task ReturnGame(int locationId);
        Task<List<Location>> GetLocationAsync();
    }
    public class LocationBLL : ILocationBLL
    {
        private IGameLocationDbContext _dbContext;
        private ILocationRepository _locationRepository;
        public LocationBLL(IGameLocationDbContext dbContext, ILocationRepository locationRepository)
        {
            _dbContext = dbContext;
            _locationRepository = locationRepository;
        }

        public async Task AddAsync(int friendId, int gameId)
        {
            await _locationRepository.AddAsync( new Location {
                FriendId = friendId,
                GameId = gameId,
                LocationDate = DateTime.UtcNow
            });
            await _dbContext.SaveChangesAsync();
        }

        public async Task<List<Location>> GetLocationAsync()
        {
            return await _locationRepository.GetLocationAsync();
        }

        public async Task ReturnGame(int locationId)
        {
            var location = await _locationRepository.GetByIdAsync(locationId);
            if (location == null)
                throw new BusinessException("Locação não encontrada");
            location.DevolutionDate = DateTime.UtcNow;
            await _locationRepository.EditAsync(location);
            await _dbContext.SaveChangesAsync();
        }
    }
}
