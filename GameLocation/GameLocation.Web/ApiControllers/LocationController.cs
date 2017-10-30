using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using GameLocation.Web.UoWs;
using BLL.Exception;
using System.Threading.Tasks;
using Entities;

namespace GameLocation.Web.ApiControllers
{
    public class LocationController : BaseController
    {
        private LocationUoW _uow;
        public LocationController(LocationUoW uoW) : base(uoW)
        {
            _uow = uoW;
        }

        [Route("api/location/getlocations"), HttpGet]
        public async Task<IHttpActionResult> GetLocationAsync()
        {
            try
            {
                return Ok(await _uow.LocationBLL.GetLocationAsync());
            }
            catch (BusinessException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Route("api/location/create"), HttpPost]
        public async Task<IHttpActionResult> CreateAsync([FromBody] Location location)
        {
            try
            {
                await _uow.LocationBLL.AddAsync(location.FriendId, location.GameId);
                return Ok();
            }
            catch (BusinessException ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
