namespace DAL
{
    public abstract class RepositoryBase
    {
        protected IGameLocationDbContext _dbContext;
        public RepositoryBase(IGameLocationDbContext dbContext)
        {
            _dbContext = dbContext;
        }
    }
}
