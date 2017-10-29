using System;

namespace Entities
{
    public class Location
    {
        public int Id { get; set; }
        public DateTime LocationDate { get; set; }
        public DateTime? DevolutionDate { get; set; }
        public int FriendId { get; set; }
        public DateTime Friend { get; set; }
        public int GameId { get; set; }
        public Game Game { get; set; }
    }
}
