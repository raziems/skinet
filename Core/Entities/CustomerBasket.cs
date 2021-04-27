using System.Collections.Generic;

namespace Core.Entities
{
    public class CustomerBasket
    {
        //Constructor
        public CustomerBasket()
        {
        }

        
        public CustomerBasket(string id)
        {
            Id = id;
            
        }

        public string Id { get; set; }      
        public List<BasketItem> Items{ get; set; } = new List<BasketItem>(); //create an empty list
    }
}