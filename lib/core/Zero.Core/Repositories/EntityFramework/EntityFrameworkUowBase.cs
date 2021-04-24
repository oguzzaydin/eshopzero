using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using Zero.Core.UnitOfWork;

namespace Zero.Core.Repositories.EntityFramework
{
    public class EntityFrameworkUowBase : IUnitOfWork
    {
        private readonly DbContext _context;
        private IDbContextTransaction _transaction;

        public EntityFrameworkUowBase(DbContext context)
        {
            _context = context;
        }
        public virtual void BeginTransaction()
        {
            _transaction = _context.Database.BeginTransaction();
        }

        public virtual void Commit()
        {
            _transaction?.Commit();
        }

        public virtual void Rollback()
        {
            _transaction?.Rollback();
        }

        public virtual bool Save()
        {
            return _context.SaveChanges() > 0;
        }

        public virtual async Task<bool> SaveAsync(CancellationToken cancellationToken = default(CancellationToken))
        {
            return await _context.SaveChangesAsync(cancellationToken) > 0;
        }
    }
}