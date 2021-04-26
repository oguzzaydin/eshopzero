using System.Collections.Generic;
using Newtonsoft.Json;

namespace Gateway.Models
{
    public record OrderModel
    {
        public int Id { get; set; }
        public string MailAddress { get; set; }
        public List<OrderItemModel> OrderItems { get; set; }
    }
    public class OrderItemModel
    {
        public int ProductId { get; set; }
        public ProductModel Product { get; set; }
        public int Quantity { get; set; }
    }
}