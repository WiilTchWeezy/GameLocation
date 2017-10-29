using BLL.Exception;
using DAL;
using Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BLL
{
    public interface IFriendBLL
    {
        Task AddAsync(string name, string phone);
        Task EditAsync(int friendId, string name, string phone);
        Task<List<Friend>> GetFriendsAsync();
    }
    public class FriendBLL : IFriendBLL
    {
        private IFriendRepository _friendRepository;
        private IGameLocationDbContext _dbContext;
        public FriendBLL(IFriendRepository friendRepository, IGameLocationDbContext dbContext)
        {
            _friendRepository = friendRepository;
            _dbContext = dbContext;
        }

        public async Task AddAsync(string name, string phone)
        {
            await _friendRepository.AddAsync(new Entities.Friend
            {
                Name = name,
                Phone = phone
            });
            await _dbContext.SaveChangesAsync();
        }

        public async Task EditAsync(int friendId, string name, string phone)
        {
            var friend = await _friendRepository.GetById(friendId);
            if (friend == null)
                throw new BusinessException("Amigo não encontrado");
            friend.Name = name;
            friend.Phone = phone;
            await _friendRepository.EditAsync(friend);
            await _dbContext.SaveChangesAsync();
        }

        public async Task<List<Friend>> GetFriendsAsync()
        {
            return await _friendRepository.GetFriends();
        }
    }
}
