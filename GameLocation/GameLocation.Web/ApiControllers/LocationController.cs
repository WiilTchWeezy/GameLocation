using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using GameLocation.Web.UoWs;
using BLL.Exception;
using System.Threading.Tasks;

namespace GameLocation.Web.ApiControllers
{
    public class LocationController : BaseController
    {
        private LocationUoW _uow;
        public LocationController(LocationUoW uoW) : base(uoW)
        {
            _uow = uoW;
        }

        [Route("api/location/getlocations")]
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
    }
}
