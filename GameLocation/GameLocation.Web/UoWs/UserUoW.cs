using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using DAL;
using BLL;

namespace GameLocation.Web.UoWs
{
    public class UserUoW : UoW
    {
        public IUserBLL UserBLL { get; set; }
        public UserUoW(IGameLocationDbContext dbContext, IUserBLL userBLL) : base(dbContext)
        {
            UserBLL = userBLL;
        }
    }
}