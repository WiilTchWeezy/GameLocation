using System.ComponentModel.DataAnnotations;

namespace Entities
{
    public class Friend
    {
        [Key]
        public int Id { get; set; }

        [StringLength(100)]
        [Required]
        public string Name { get; set; }

        [StringLength(100)]
        public string Phone { get; set; }
    }
}
