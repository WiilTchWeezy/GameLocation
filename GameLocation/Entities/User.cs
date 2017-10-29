using System.ComponentModel.DataAnnotations;

namespace Entities
{
    public class User
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        public string Name { get; set; }

        [Required]
        [StringLength(300)]
        public string Password { get; set; }

    }
}
