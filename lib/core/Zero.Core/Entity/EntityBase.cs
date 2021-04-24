using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Reflection;
using MediatR;

namespace Zero.Core.Entity
{
    public abstract class EntityBase<TPrimaryKey> : IEntity<TPrimaryKey>
    {
        [Key]
        public virtual TPrimaryKey Id { get; protected set; }
        public IEnumerable<INotification> Events => _events.Values;

        private readonly IDictionary<Type, INotification> _events = new Dictionary<Type, INotification>();
        public void AddEvent(INotification @event) => _events[@event.GetType()] = @event;
        public void ClearEvents() => _events.Clear();

        public virtual bool IsTransient()
        {
            if (EqualityComparer<TPrimaryKey>.Default.Equals(Id, default(TPrimaryKey)))
            {
                return true;
            }
            if (typeof(TPrimaryKey) == typeof(int))
            {
                return Convert.ToInt32(Id) <= 0;
            }

            if (typeof(TPrimaryKey) == typeof(long))
            {
                return Convert.ToInt64(Id) <= 0;
            }

            return false;
        }
        public override bool Equals(object obj)
        {
            if (obj == null || !(obj is EntityBase<TPrimaryKey>))
            {
                return false;
            }

            //Same instances must be considered as equal
            if (ReferenceEquals(this, obj))
            {
                return true;
            }

            //Transient objects are not considered as equal
            var other = (EntityBase<TPrimaryKey>)obj;
            if (IsTransient() && other.IsTransient())
            {
                return false;
            }

            //Must have a IS-A relation of types or must be same type
            var typeOfThis = GetType();
            var typeOfOther = other.GetType();
            if (!typeOfThis.GetTypeInfo().IsAssignableFrom(typeOfOther) && !typeOfOther.GetTypeInfo().IsAssignableFrom(typeOfThis))
            {
                return false;
            }

            return Id.Equals(other.Id);
        }
        public override int GetHashCode()
        {
            return Id.GetHashCode();
        }
        public static bool operator ==(EntityBase<TPrimaryKey> left, EntityBase<TPrimaryKey> right)
        {
            if (Equals(left, null))
            {
                return Equals(right, null);
            }

            return left.Equals(right);
        }
        public static bool operator !=(EntityBase<TPrimaryKey> left, EntityBase<TPrimaryKey> right)
        {
            return !(left == right);
        }
        public override string ToString()
        {
            return $"[{GetType().Name} {Id}]";
        }
        public virtual object GetPrimaryKey()
        {
            return Id;
        }
    }
}