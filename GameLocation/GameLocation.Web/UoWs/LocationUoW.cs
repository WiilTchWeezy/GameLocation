using DAL;
using BLL;

namespace GameLocation.Web.UoWs
{
    public class LocationUoW : UoW
    {
        public ILocationBLL LocationBLL { get; set; }
        public LocationUoW(IGameLocationDbContext dbContext, ILocationBLL locationBLL) : base(dbContext)
        {
            LocationBLL = locationBLL;
        }
    }
}