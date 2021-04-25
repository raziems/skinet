using Core.Entities;

namespace Core.Specifications
{
    public class ProductWithFiltersForCountSpecification : BaseSpecification<Product>
    {
        public ProductWithFiltersForCountSpecification(ProductSpecParams productParams)
        :base(x=>
            (string.IsNullOrEmpty(productParams.Search) || x.Name.ToLower().Contains
            (productParams.Search)) &&
            (!productParams.BrandId.HasValue|| x.ProductBrandId==productParams.BrandId) && //the left condition is always false because we use !, so the right condition will execute
            (!productParams.TypeId.HasValue || x.ProductTypeId==productParams.TypeId) //the left condition is always false because we use !, so the right condition will execute
            )
        {
        }
    }
}