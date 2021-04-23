using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Infrastructure.Data;
using Core.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Core.Interfaces;
using Core.Specifications;
using API.Dtos;
using AutoMapper;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController : ControllerBase
    {
        //private readonly IProductRepository _repo;

        // public ProductsController(IProductRepository repo)
        // {
        //     _repo = repo;
        // }
        private readonly IGenericRepository<Product> _productsRepo;
        private readonly IGenericRepository<ProductBrand> _productBrandRepo;
        private readonly IGenericRepository<ProductType> _productTypeRepo;
        private readonly IMapper _mapper;


        //Apply GenericRepository
        public ProductsController(IGenericRepository<Product> productsRepo,
            IGenericRepository<ProductType> productTypeRepo,
            IGenericRepository<ProductBrand> productBrandRepo,
            IMapper mapper
            )
        {
            _productTypeRepo = productTypeRepo;
            _productBrandRepo = productBrandRepo;
            _productsRepo = productsRepo;
            _mapper=mapper;

        }



        [HttpGet]
        public async Task<ActionResult<IReadOnlyList<ProductToReturnDto>>> GetProducts()
        {
            //var products = await _repo.GetProductsAsync();
            //var products = await _productsRepo.ListAllAsync();

            var spec = new ProductsWithTypesAndBrandsSpecification();

            var products = await _productsRepo.ListAsync(spec);

            //return Ok(products);
            // return products.Select(product=> new ProductToReturnDto
            // {
            //     Id=product.Id,
            //      Name=product.Name,
            //      Description = product.Description,
            //      PictureUrl=product.PictureUrl,
            //      Price=product.Price,
            //      ProductBrand=product.ProductBrand.Name,
            //      ProductType=product.ProductType.Name
            // }).ToList();

            //Using AutoMapper
            return Ok(_mapper
                .Map<IReadOnlyList<Product>, IReadOnlyList<ProductToReturnDto>>
                (products));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ProductToReturnDto>> GetProduct(int id)
        {
            //return await _repo.GetProductByIdAsync(id);

            //return await _productsRepo.GetByIdAsync(id);
             var spec = new ProductsWithTypesAndBrandsSpecification(id);

             //return await _productsRepo.GetEntityWithSpec(spec);

             //Dto
             var product = await _productsRepo.GetEntityWithSpec(spec);

            //  return new ProductToReturnDto
            //  {
            //      Id=product.Id,
            //      Name=product.Name,
            //      Description = product.Description,
            //      PictureUrl=product.PictureUrl,
            //      Price=product.Price,
            //      ProductBrand=product.ProductBrand.Name,
            //      ProductType=product.ProductType.Name
            //  };

            //Using AutoMapper
            return _mapper.Map<Product, ProductToReturnDto>(product);


        }

        [HttpGet("brands")]
        public async Task<ActionResult<IReadOnlyList<ProductBrand>>> GetProductBrands()
        {
            //return Ok(await _repo.GetProductBrandsAsync());//need to return Ok() because directly return the value due to IReadOnlyList
            return Ok(await _productBrandRepo.ListAllAsync());
        }

        [HttpGet("types")]
        public async Task<ActionResult<IReadOnlyList<ProductType>>> GetProductTypes()
        {
            //return Ok(await _repo.GetProductTypesAsync());//need to return Ok() because directly return the value due to IReadOnlyList
            return Ok(await _productTypeRepo.ListAllAsync());
        }


    }
}