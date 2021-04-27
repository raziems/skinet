using System;
using System.Text.Json;
using System.Threading.Tasks;
using Core.Entities;
using Core.Interfaces;
using StackExchange.Redis;

namespace Infrastructure.Data
{
    public class BasketRepository : IBasketRepository
    {
        private readonly IDatabase _database;
        public BasketRepository(IConnectionMultiplexer redis)
        {
            _database=redis.GetDatabase();
        }

        public async Task<bool> DeleteBasketAsync(string basketId)
        {
            return await _database.KeyDeleteAsync(basketId);
        }

        public async Task<CustomerBasket> GetBasketAsync(string baskerId)
        {
            var data = await _database.StringGetAsync(baskerId);

            return data.IsNullOrEmpty? null: JsonSerializer.Deserialize<CustomerBasket>(data); //if have data, deserializa data into customerbasker, if empty, return null
        }

        public async Task<CustomerBasket> UpdateBasketAsync(CustomerBasket basket)
        {
            var created = await _database.StringSetAsync(basket.Id, JsonSerializer.Serialize(basket), 
            TimeSpan.FromDays(30));

            if (!created) return null; //if basket not created, return null

            return await GetBasketAsync(basket.Id);
        }
    }
}