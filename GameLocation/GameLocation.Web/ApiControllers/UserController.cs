using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using GameLocation.Web.UoWs;
using System.Threading.Tasks;
using BLL.Exception;
using Entities;

namespace GameLocation.Web.ApiControllers
{
    public class UserController : BaseController
    {
        private UserUoW _uow;
        public UserController(UserUoW uoW) : base(uoW)
        {
            _uow = uoW;
        }

        [AllowAnonymous]
        [Route("api/user/create"), HttpPost]
        public async Task<IHttpActionResult> CreateAsync([FromBody] User user)
        {
            try
            {
                await _uow.UserBLL.AddAsync(user.Name, user.Password);
                return Ok();
            }
            catch (BusinessException ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
