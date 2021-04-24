using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;
using Zero.Core.Audition;
using Zero.Core.Entity;
using Zero.Core.Sessions;

namespace Zero.Core.Repositories.EntityFramework
{
    public class EntityFrameworkRepository<TEntity> : EntityFrameworkRepository<TEntity, int>, IRepository<TEntity> where TEntity : class, IEntity<int>
    {
        public EntityFrameworkRepository(DbContext context, ISession session) : base(context, session)
        {
        }
    }

    public class EntityFrameworkRepository<TEntity, TPrimaryKey> : RepositoryBase<TEntity, TPrimaryKey> where TEntity : class, IEntity<TPrimaryKey> where TPrimaryKey : struct
    {
        private readonly ISession _session;
        protected DbSet<TEntity> Table { get; }

        public EntityFrameworkRepository(DbContext context, ISession session)
        {
            _session = session;
            Table = context.Set<TEntity>();
        }

        public override void Delete(TEntity entity, bool force = false)
        {
            Table.Remove(entity);
        }

        public override TEntity Get(TPrimaryKey id) => Table.Find(id);
        public override IEnumerable<TEntity> Query(Expression<Func<TEntity, bool>> predicate) => Table.Where(predicate);
        public override IEnumerable<TEntity> Query() => Table;
        public override IQueryable<TEntity> Queryable() => Table.AsQueryable();
        public override IQueryable<TEntity> Queryable(Expression<Func<TEntity, bool>> predicate) => Table.Where(predicate).AsQueryable();

        public override TEntity Insert(TEntity entity)
        {
            if (entity is ICreationAudited creationEntity)
                creationEntity.CreationAuditing(_session);
            Table.Add(entity);
            return entity;
        }

        public override TEntity Update(TEntity entity)
        {
            Table.Update(entity);
            return entity;
        }
        public override int Count(Expression<Func<TEntity, bool>> predicate) => Table.Where(predicate).Count();
        public override void Delete(Expression<Func<TEntity, bool>> predicate, bool force = false)
        {
            //TODO : Force aktif değil
            var entities = Table.Where(predicate);
            Table.RemoveRange(entities);
        }
    }
}