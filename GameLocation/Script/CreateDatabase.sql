create table [User] (
Id int primary key identity,
[Name] varchar(100) not null,
[Password] varchar(300) not null);

create table Game (
Id int primary key identity,
[Name] varchar(100) not null);

create table Friend (
Id int primary key identity,
[Name] varchar(100) not null,
Phone varchar(100));

create table [Location](
Id int primary key identity,
LocationDate DateTime not null,
DevolutionDate DateTime,
FriendId int not null,
GameId int not null,
Foreign key (FriendId) references Friend(Id),
Foreign key (GameId) references Game(Id)
);