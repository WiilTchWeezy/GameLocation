using DAL;
using System;

namespace GameLocation.Web.UoWs
{
    public class UoW : IDisposable
    {
        private IGameLocationDbContext _dbContext;

        public UoW(IGameLocationDbContext dbContext)
        {
            _dbContext = dbContext;
        }
        public void Dispose()
        {
            _dbContext.Dispose();
        }
    }
}