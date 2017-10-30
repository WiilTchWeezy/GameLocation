using GameLocation.Web.Infra;
using Microsoft.Owin.Security.OAuth;
using Owin;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace GameLocation.Web
{
    public partial class Startup
    {
        public static OAuthAuthorizationServerOptions OAuthOptions { get; private set; }

        public static string PublicClientId { get; private set; }

        public void ConfigureAuth(IAppBuilder app)
        {
            PublicClientId = "self";

            OAuthOptions = new OAuthAuthorizationServerOptions
            {
                TokenEndpointPath = new Microsoft.Owin.PathString("/token"),
                Provider = new ApplicationOAuthProvider(PublicClientId),
                AccessTokenExpireTimeSpan = TimeSpan.FromHours(12),
                AllowInsecureHttp = true
            };

            app.UseOAuthBearerTokens(OAuthOptions);
        }
    }
}