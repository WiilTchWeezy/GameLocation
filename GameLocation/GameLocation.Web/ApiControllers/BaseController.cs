using GameLocation.Web.UoWs;
using System.Web.Http;

namespace GameLocation.Web.ApiControllers
{
    [Authorize]
    public class BaseController : ApiController
    {
        private UoW _uoW;
        public BaseController(UoW uoW)
        {
            _uoW = uoW;
        }

        protected override void Dispose(bool disposing)
        {
            base.Dispose(disposing);
            if (disposing == true)
                _uoW.Dispose();
        }
    }

}