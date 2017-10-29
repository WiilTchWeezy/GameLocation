using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Entities
{
    public class Location
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public DateTime LocationDate { get; set; }

        public DateTime? DevolutionDate { get; set; }

        [Required]
        public int FriendId { get; set; }

        [ForeignKey("FriendId")]
        public Friend Friend { get; set; }

        [Required]
        public int GameId { get; set; }

        [ForeignKey("GameId")]
        public Game Game { get; set; }
    }
}
