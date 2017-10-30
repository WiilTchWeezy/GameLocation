using System;
using System.Security.Cryptography;
using System.Text;

namespace BLL.Helpers
{
    public static class MD5Helper
    {
        public static string Encrypt(string data)
        {
            if (String.IsNullOrWhiteSpace(data))
                return data;

            MD5 md5 = new MD5CryptoServiceProvider();

            byte[] hash = md5.ComputeHash(Encoding.ASCII.GetBytes(data));

            StringBuilder stringBuilder = new StringBuilder();

            foreach (byte b in hash)
                stringBuilder.AppendFormat("{0:x2}", b);

            return stringBuilder.ToString();
        }
    }
}
