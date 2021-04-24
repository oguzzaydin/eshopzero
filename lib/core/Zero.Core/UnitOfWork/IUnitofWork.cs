using System.Threading;
using System.Threading.Tasks;

namespace Zero.Core.UnitOfWork
{
    public interface IUnitOfWork
    {
        void BeginTransaction();
        void Commit();
        void Rollback();
        bool Save();
        Task<bool> SaveAsync(CancellationToken cancellationToken = default(CancellationToken));
    }
}