using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using GameLocation.Web.UoWs;
using System.Threading.Tasks;
using BLL.Exception;

namespace GameLocation.Web.ApiControllers
{
    public class FriendController : BaseController
    {
        private FriendUoW _uow;
        public FriendController(FriendUoW uoW) : base(uoW)
        {
            _uow = uoW;
        }

        [Route("api/friend/getfriends")]
        public async Task<IHttpActionResult> GetLocationAsync()
        {
            try
            {
                return Ok(await _uow.FriendBLL.GetFriendsAsync());
            }
            catch (BusinessException ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
