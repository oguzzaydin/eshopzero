using System;
using Zero.Core.Entity;
using Zero.Core.Sessions;

namespace Zero.Core.Audition
{
    [Serializable]
    public class CreationAuditedEntityBase<TPrimayKey> : EntityBase<TPrimayKey>, ICreationAudited
    {
        public virtual DateTime CreationTime { get; private set; }
        public virtual long? CreatorUserId { get; private set; }

        public virtual void CreationAuditing(ISession session)
        {
            CreationTime = DateTime.UtcNow;
            CreatorUserId = session?.Id is not 0 ? session?.Id : null;
        }
    }
}