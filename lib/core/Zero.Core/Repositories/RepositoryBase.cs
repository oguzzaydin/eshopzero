using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using Zero.Core.Entity;

namespace Zero.Core.Repositories
{
    public abstract class RepositoryBase<TEntity> : RepositoryBase<TEntity, int>, IRepository<TEntity>
        where TEntity : class, IEntity<int>
    {
    }

    public abstract class RepositoryBase<TEntity, TPrimaryKey> : IRepository<TEntity, TPrimaryKey>
        where TEntity : class, IEntity<TPrimaryKey>
        where TPrimaryKey : struct
    {
        public abstract IEnumerable<TEntity> Query();
        public abstract IQueryable<TEntity> Queryable(Expression<Func<TEntity, bool>> predicate);
        public abstract TEntity Insert(TEntity entity);
        public abstract TEntity Update(TEntity entity);
        public abstract void Delete(TEntity entity, bool force = false);

        public abstract TEntity Get(TPrimaryKey id);
        public virtual Task<TEntity> GetAsync(TPrimaryKey id) => Task.FromResult(Get(id));
        public abstract IEnumerable<TEntity> Query(Expression<Func<TEntity, bool>> predicate);
        public virtual Task<IEnumerable<TEntity>> QueryAsync(Expression<Func<TEntity, bool>> predicate) => Task.FromResult(Query(predicate));
        public abstract IQueryable<TEntity> Queryable();
        public abstract int Count(Expression<Func<TEntity, bool>> predicate);
        public virtual Task<int> CountAsync(Expression<Func<TEntity, bool>> predicate) => Task.FromResult(Count(predicate));
        public virtual Task<TEntity> InsertAsync(TEntity entity) => Task.FromResult(Insert(entity));
        public virtual Task<TEntity> UpdateAsync(TEntity entity) => Task.FromResult(Update(entity));
        public abstract void Delete(Expression<Func<TEntity, bool>> predicate, bool force = false);
        public virtual Task DeleteAsync(Expression<Func<TEntity, bool>> predicate) => Task.Run(() => Delete(predicate));
    }
}