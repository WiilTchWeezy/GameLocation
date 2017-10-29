using System;
using Unity;
using DAL;
using Unity.Lifetime;
using BLL;

namespace GameLocation.Web.App_Start
{
    public class UnityConfig
    {
        private static Lazy<IUnityContainer> container = new Lazy<IUnityContainer>(() => {
            var container = new UnityContainer();
            RegisterTypes(container);
            return container;
        });

        public static IUnityContainer GetConfiguredContainer()
        {
            return container.Value;
        }

        public static void RegisterTypes(IUnityContainer container)
        {
            container.RegisterType<IGameLocationDbContext, GameLocationDbContext>(new HierarchicalLifetimeManager());

            container.RegisterType<IFriendRepository, FriendRepository>();
            container.RegisterType<IGameRepository, GameRepository>();
            container.RegisterType<ILocationRepository, LocationRepository>();
            container.RegisterType<IUserRepository, UserRepository>();

            container.RegisterType<IFriendBLL, FriendBLL>();
            container.RegisterType<IGameBLL, GameBLL>();
            container.RegisterType<ILocationBLL, LocationBLL>();
            container.RegisterType<IUserBLL, UserBLL>();
        }
    }
}