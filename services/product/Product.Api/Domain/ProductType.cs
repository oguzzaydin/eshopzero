using Zero.Core.Audition;

namespace Product.Api.Domain
{
    public class ProductType : CreationAuditedEntityBase<int>
    {
        public string Name  { get; protected set; }

        protected ProductType()
        {
            
        }
    }
}