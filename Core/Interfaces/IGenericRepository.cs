using System.Collections.Generic;
using System.Threading.Tasks;
using Core.Entities;
using Core.Specifications;

namespace Core.Interfaces
{
    public interface IGenericRepository<T> where T: BaseEntity // T - template/types
    {
        Task<T> GetByIdAsync (int id);
        Task<IReadOnlyList<T>> ListAllAsync();

        Task<T> GetEntityWithSpec (ISpecification<T> spec);
        Task <IReadOnlyList<T>> ListAsync (ISpecification<T> spec);
    }
}