using System;
using System.Linq;
using System.Threading.Tasks;
using System.Data.Entity;
using System.Data.Entity.ModelConfiguration.Conventions;
using Entities;

namespace DAL
{

    public interface IGameLocationDbContext : IDisposable
    {
        #region Infra
        Task<int> SaveChangesAsync();
        Task Add<TEntity>(TEntity entity) where TEntity : class;
        Task Edit<TEntity>(TEntity entity) where TEntity : class;
        void Delete<TEntity>(TEntity entity) where TEntity : class;
        #endregion

        IQueryable<Game> GameQuery { get; }
        IQueryable<Friend> FriendQuery { get; }
        IQueryable<Location> LocationQuery { get; }
        IQueryable<User> UserQuery { get; }
    }

    internal class GameLocationDbContextInitializer : IDatabaseInitializer<GameLocationDbContext>
    {
        public void InitializeDatabase(GameLocationDbContext context)
        {

        }
    }


    public class GameLocationDbContext : DbContext, IGameLocationDbContext
    {

        #region Infra
        public GameLocationDbContext() : base("name=WorkScheduleDbContext")
        {
            Database.SetInitializer(new GameLocationDbContextInitializer());
            Configuration.LazyLoadingEnabled = false;
            Configuration.ProxyCreationEnabled = false;
        }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Conventions.Remove<PluralizingTableNameConvention>();
            modelBuilder.Conventions.Remove<StoreGeneratedIdentityKeyConvention>();
        }

        public Task Add<TEntity>(TEntity entity) where TEntity : class
        {
            return Task.Run(() =>
            {
                Set<TEntity>().Attach(entity);
                Entry(entity).State = EntityState.Added;
            });
        }

        public Task Edit<TEntity>(TEntity entity) where TEntity : class
        {
            return Task.Run(() =>
            {
                Set<TEntity>().Attach(entity);
                Entry(entity).State = EntityState.Modified;
            });
        }

        public void Delete<TEntity>(TEntity entity) where TEntity : class
        {
            Set<TEntity>().Attach(entity);
            Entry(entity).State = EntityState.Deleted;
        }
        #endregion

        public DbSet<Game> Game { get; set; }
        public DbSet<Friend> Friend { get; set; }
        public DbSet<Location> Location { get; set; }
        public DbSet<User> User { get; set; }

        public IQueryable<Game> GameQuery { get { return Game; } }
        public IQueryable<Friend> FriendQuery { get { return Friend; } }
        public IQueryable<Location> LocationQuery { get { return Location; } }
        public IQueryable<User> UserQuery { get { return User; } }
    }
}

