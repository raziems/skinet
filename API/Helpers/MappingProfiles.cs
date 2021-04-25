using API.Dtos;
using AutoMapper;
using Core.Entities;

namespace API.Helpers
{
    public class MappingProfiles : Profile
    {
        //To solve the mapping AutoMapper mapping issue because ProductBrand and ProductType
        //is a class in Entities
        public MappingProfiles()
        {
            CreateMap<Product, ProductToReturnDto>()
                .ForMember(d => d.ProductBrand,o=> o.MapFrom(s=> s.ProductBrand.Name))
                .ForMember(d => d.ProductType,o=> o.MapFrom(s=> s.ProductType.Name))
                .ForMember(d => d.PictureUrl,o=> o.MapFrom<ProductUrlResolver>());
        }
    }
}