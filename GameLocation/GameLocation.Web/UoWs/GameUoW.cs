using DAL;
using BLL;

namespace GameLocation.Web.UoWs
{
    public class GameUoW : UoW
    {
        public IGameBLL GameBLL { get; set; }
        public GameUoW(IGameLocationDbContext dbContext, IGameBLL gameBLL) : base(dbContext)
        {
            GameBLL = gameBLL;
        }
    }
}