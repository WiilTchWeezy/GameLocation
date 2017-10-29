using Entities;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL
{
    public interface ILocationRepository
    {
        Task AddAsync(Location location);
        Task EditAsync(Location location);
        Task<Location> GetByIdAsync(int locationId);
        Task<List<Location>> GetLocationByFriendId(int friendId);
        Task<Location> GetValidLocationByGameId(int gameId);
        Task<List<Location>> GetLocationAsync();
    }
    public class LocationRepository : RepositoryBase , ILocationRepository
    {
        public LocationRepository(IGameLocationDbContext dbContext) : base(dbContext)
        {
        }

        public Task AddAsync(Location location)
        {
            return Task.Run(()=> {
                _dbContext.Add(location);
            });
        }

        public Task EditAsync(Location location)
        {
            return Task.Run(() => {
                _dbContext.Edit(location);
            });
        }

        public Task<Location> GetByIdAsync(int locationId)
        {
            return _dbContext.LocationQuery.Where(x => x.Id == locationId).FirstOrDefaultAsync();
        }

        public async Task<List<Location>> GetLocationAsync()
        {
            return await _dbContext.LocationQuery.ToListAsync();
        }

        public Task<List<Location>> GetLocationByFriendId(int friendId)
        {
            return _dbContext.LocationQuery.Where(x => x.FriendId == friendId).ToListAsync();
        }

        public Task<Location> GetValidLocationByGameId(int gameId)
        {
            return _dbContext.LocationQuery.Where(x => x.GameId == gameId && x.DevolutionDate == null).FirstOrDefaultAsync();
        }
    }
}
