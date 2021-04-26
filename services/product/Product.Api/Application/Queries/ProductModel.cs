namespace Product.Api.Application.Queries
{
    public record ProductModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public decimal Price { get; set; }
        public string PictureUrl { get; set; }
        public ProductTypeModel ProductType { get; set; }
        public int AvailableStock { get; set; }
    }

    public record ProductTypeModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
    }
}