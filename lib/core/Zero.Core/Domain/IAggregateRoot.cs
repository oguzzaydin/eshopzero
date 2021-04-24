using Zero.Core.Entity;

namespace Zero.Core.Domain
{
    public interface IAggregateRoot : IAggregateRoot<int>
    {

    }

    public interface IAggregateRoot<out TPrimaryKey> : IEntity<TPrimaryKey>
    {

    }
}