using DAL;
using BLL;

namespace GameLocation.Web.UoWs
{
    public class FriendUoW : UoW
    {
        public IFriendBLL FriendBLL { get; set; }
        public FriendUoW(IGameLocationDbContext dbContext, IFriendBLL friendBLL) : base(dbContext)
        {
            FriendBLL = friendBLL;
        }
    }
}