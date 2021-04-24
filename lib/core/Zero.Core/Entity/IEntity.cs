using System.Collections.Generic;
using MediatR;

namespace Zero.Core.Entity
{
    public interface IEntity
    {
        IEnumerable<INotification> Events { get; }
        void ClearEvents();
        void AddEvent(INotification @event);
        bool IsTransient();
        object GetPrimaryKey();
    }

    public interface IEntity<out TPrimaryKey> : IEntity
    {
        TPrimaryKey Id { get; }
    }
}