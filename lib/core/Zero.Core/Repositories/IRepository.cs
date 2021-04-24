using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using Zero.Core.Entity;

namespace Zero.Core.Repositories
{
    public interface IRepository<TEntity> : IRepository<TEntity, int> where TEntity : class, IEntity<int>
    { }
    public interface IRepository<TEntity, TPrimaryKey>
        where TEntity : class, IEntity<TPrimaryKey>
        where TPrimaryKey : struct
    {
        IEnumerable<TEntity> Query();
        IEnumerable<TEntity> Query(Expression<Func<TEntity, bool>> predicate);
        Task<IEnumerable<TEntity>> QueryAsync(Expression<Func<TEntity, bool>> predicate);

        IQueryable<TEntity> Queryable();
        IQueryable<TEntity> Queryable(Expression<Func<TEntity, bool>> predicate);

        TEntity Insert(TEntity entity);
        TEntity Update(TEntity entity);
        void Delete(TEntity entity, bool force = false);

        TEntity Get(TPrimaryKey id);
        Task<TEntity> GetAsync(TPrimaryKey id);

        int Count(Expression<Func<TEntity, bool>> predicate);
        Task<int> CountAsync(Expression<Func<TEntity, bool>> predicate);

        Task<TEntity> InsertAsync(TEntity entity);
        Task<TEntity> UpdateAsync(TEntity entity);
        void Delete(Expression<Func<TEntity, bool>> predicate, bool force = false);
        Task DeleteAsync(Expression<Func<TEntity, bool>> predicate);
    }
}