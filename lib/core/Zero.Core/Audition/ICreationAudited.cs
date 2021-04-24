using Zero.Core.Sessions;

namespace Zero.Core.Audition
{
    public interface ICreationAudited : IHasCreationTime
    {
        long? CreatorUserId { get; }
        void CreationAuditing(ISession session);
    }
}