using BLL.Exception;
using BLL.Helpers;
using DAL;
using Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL
{
    public interface IUserBLL
    {
        Task AddAsync(string name, string password);
        Task EditAsync(int id, string name);
        Task<User> LoginAsync(string name, string password);
    }

    public class UserBLL : IUserBLL
    {
        private IGameLocationDbContext _dbContext;
        private IUserRepository _userRepository;
        public UserBLL(IGameLocationDbContext dbContext, IUserRepository userRepository)
        {
            _dbContext = dbContext;
            _userRepository = userRepository;
        }
        public async Task AddAsync(string name, string password)
        {
            var passwordEncrypt = MD5Helper.Encrypt(password);
            await _userRepository.AddAsync(new User { Name = name, Password = passwordEncrypt });
            await _dbContext.SaveChangesAsync();
        }

        public async Task EditAsync(int id, string name)
        {
            var user = await _userRepository.GetById(id);
            if (user == null)
                throw new BusinessException("Usuário não encontrado");
            user.Name = name;
            await _userRepository.EditAsync(user);
            await _dbContext.SaveChangesAsync();
        }

        public async Task<User> LoginAsync(string name, string password)
        {
            var encryptPassword = MD5Helper.Encrypt(password);
            return await _userRepository.GetByNamePassword(name, encryptPassword);
        }
    }
}
