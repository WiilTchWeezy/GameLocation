﻿using Entities;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;

namespace DAL
{
    public interface IFriendRepository
    {
        Task AddAsync(Friend friend);
        Task EditAsync(Friend friend);
        Task<Friend> GetById(int friendId);
        Task<List<Friend>> GetFriends();
    }
    public class FriendRepository : RepositoryBase, IFriendRepository
    {
        public FriendRepository(IGameLocationDbContext dbContext) : base(dbContext)
        {
        }

        public Task AddAsync(Friend friend)
        {
            return Task.Run(() => {
                _dbContext.Add(friend);
            });
        }

        public Task EditAsync(Friend friend)
        {
            return Task.Run(()=> {
                _dbContext.Edit(friend);
            });
        }

        public Task<Friend> GetById(int friendId)
        {
            return _dbContext.FriendQuery.Where(x => x.Id == friendId).FirstOrDefaultAsync();
        }

        public Task<List<Friend>> GetFriends()
        {
            return _dbContext.FriendQuery.ToListAsync();
        }
    }
}
