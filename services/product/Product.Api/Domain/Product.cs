using System;
using Zero.Core.Audition;
using Zero.Core.Domain;

namespace Product.Api.Domain
{
    public class Product : CreationAuditedEntityBase<int>, IAggregateRoot
    {
        public string Name { get; protected set; }
        public string Description { get; protected set; }
        public decimal Price { get; protected set; }
        public string PictureUrl { get; protected set; }
        public int ProductTypeId { get; protected set; }
        public ProductType ProductType { get; protected set; }
        public int AvailableStock { get; protected set; }

        protected Product()
        {
        }

        public Product(string name, string description, decimal price, string pictureUrl, int productTypeId, int availableStock)
        {
            Name = name;
            Description = description;
            Price = price;
            PictureUrl = pictureUrl;
            ProductTypeId = productTypeId;
            AvailableStock = availableStock;
        }
    }
}