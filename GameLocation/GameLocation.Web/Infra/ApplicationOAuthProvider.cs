using BLL;
using BLL.Exception;
using DAL;
using Microsoft.Owin.Security;
using Microsoft.Owin.Security.OAuth;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Web;

namespace GameLocation.Web.Infra
{
    public class ApplicationOAuthProvider : OAuthAuthorizationServerProvider
    {
        public readonly string _publicClientId;

        public ApplicationOAuthProvider(string publicClientId)
        {
            if (publicClientId == null)
                throw new ArgumentNullException("publicClientId");

            _publicClientId = publicClientId;
        }

        public override async Task GrantResourceOwnerCredentials(OAuthGrantResourceOwnerCredentialsContext context)
        {
            try
            {
                using (var dbcontext = new GameLocationDbContext())
                {
                    var userBLL = new UserBLL(dbcontext, new UserRepository(dbcontext));
                    var user = await userBLL.LoginAsync(context.UserName, context.Password);
                    if (user != null)
                    {
                        ClaimsIdentity oAuthIdentity = new ClaimsIdentity(OAuthDefaults.AuthenticationType);
                        oAuthIdentity.AddClaim(new Claim(ClaimTypes.NameIdentifier, user.Name));

                        AuthenticationProperties properties = new AuthenticationProperties(new Dictionary<string, string> {
                        {
                            "email","email"
                        }
                    });

                        var ticket = new AuthenticationTicket(oAuthIdentity, properties);
                        context.Validated(ticket);
                    }
                    else
                    {
                        context.SetError("invalid_grant", "Dados inválidos.");
                        return;
                    }
                }
            }
            catch (BusinessException ex)
            {
                context.SetError("invalid_grant", ex.Message);
                return;
            }
        }

        public override Task TokenEndpoint(OAuthTokenEndpointContext context)
        {
            foreach (KeyValuePair<string, string> property in context.Properties.Dictionary)
            {
                context.AdditionalResponseParameters.Add(property.Key, property.Value);
            }
            return Task.FromResult<object>(null);
        }

        public override Task ValidateClientAuthentication(OAuthValidateClientAuthenticationContext context)
        {
            if (context.ClientId == null)
            {
                context.Validated();
            }
            return Task.FromResult<object>(null);
        }

        public override Task ValidateClientRedirectUri(OAuthValidateClientRedirectUriContext context)
        {
            if (context.ClientId == _publicClientId)
            {
                Uri expectedRootUri = new Uri(context.Request.Uri, "/");

                if (expectedRootUri.AbsoluteUri == context.RedirectUri)
                {
                    context.Validated();
                }
            }
            return Task.FromResult<object>(null);

        }
    }
}