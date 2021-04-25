using System.Collections;
using System.Collections.Generic;
using System.Linq;
using Product.Api.Domain;

namespace Product.Api.Infrastructure.Seed
{
    public static class Config
    {
        public static IEnumerable<ProductType> ProductTypes =>
            new ProductType[]
            {
                new("Giyim"),
                new("Ayakkabı"),
                new("Saat & Aksesuar"),
                new("Elektronik"),
            };

        public static IEnumerable<Domain.Product> Products =>
            new Domain.Product[]
            {
                new ("Pantolon", "Indigo Erkek Straight Fit Jeans", 1200, "https://images.unsplash.com/photo-1555689502-c4b22d76c56f?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=934&q=80", 1, 100),
                new ("Pantolon", "Antrasit Kemerli Pantolon", 1000, "https://images.unsplash.com/photo-1599447539673-793dc6a4aabd?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=935&q=80", 1, 10),
                new ("Akıllı Cep Telefonu", "X3 NFC 128GB Siyah Cep Telefonu", 500, "https://images.unsplash.com/photo-1579983093084-82213ea15691?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=934&q=80", 4, 30),
                new ("Akıllı Cep Telefonu", "iPhone 11 64GB Beyaz Cep Telefonu", 800, "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=976&q=80", 4, 20),
                new ("Akıllı Cep Telefonu", "Galaxy M11 (Çift SIM) 32GB Siyah", 1500, "https://images.unsplash.com/photo-1557189750-56d1be9e963a?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1574&q=80", 4, 100),
                new ("Akıllı Cep Telefonu", "Redmi Note 9 128GB Gri Cep Telefonu", 2000, "https://images.unsplash.com/photo-1603015269169-225cb700e29a?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80", 4, 8),
                new ("Akıllı Cep Telefonu", "iPhone 12 Pro Max 128GB Mavi Cep", 8500, "https://images.unsplash.com/photo-1568667794947-9e06974eedf6?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1400&q=80", 4, 5),
                new ("Kol Saati", "Unisex Kol Saati", 200, "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=940&q=80", 3, 7),
                new ("Kol Saati", "Metal Erkek Kol Saati", 850, "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1959&q=80", 3, 16),
                new ("Kol Saati", "Daniel Klein T5 Chrono Kol Saati+bileklik Hediye TB2079", 1900, "https://images.unsplash.com/photo-1518131672697-613becd4fab5?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80", 3, 5),
                new ("Günlük Ayakkabı", "Converse Chuck Taylor All Star Unisex Kısa Kırmızı", 1650, "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80", 2, 9),   
                new ("Günlük Ayakkabı", "Derilax Hakiki Deri Tam Ortopedik Erkek Ayakkabı DERİLAX ER01", 900, "https://images.unsplash.com/photo-1491553895911-0055eca6402d?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1400&q=80", 2, 120),
            };
    }
}