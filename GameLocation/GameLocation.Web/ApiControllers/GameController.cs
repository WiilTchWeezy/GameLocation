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
    public class GameController : BaseController
    {
        private GameUoW _uow;
        public GameController(GameUoW uoW) : base(uoW)
        {
            _uow = uoW;
        }

        [Route("api/game/getgames")]
        public async Task<IHttpActionResult> GetGameAsync()
        {
            try
            {
                return Ok(await _uow.GameBLL.GetGamesAsync());
            }
            catch (BusinessException ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
