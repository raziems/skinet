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
using API.Errors;
using Microsoft.AspNetCore.Http;
using API.Helpers;

namespace API.Controllers
{
    //[ApiController]
    //[Route("api/[controller]")]
    public class ProductsController : BaseApiController //ControllerBase
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
        public async Task<ActionResult<Pagination<ProductToReturnDto>>> GetProducts(
            [FromQuery]ProductSpecParams productParams) //FromQuery because we use object ProductSpecParams
        {
            //var products = await _repo.GetProductsAsync();
            //var products = await _productsRepo.ListAllAsync();

            var spec = new ProductsWithTypesAndBrandsSpecification(productParams); //sort - for sorting the result

            var countSpec = new ProductsWithTypesAndBrandsSpecification(productParams); // for pagination
            var totalItems = await _productsRepo.CountAsync(countSpec);
           

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

            var data=_mapper
                .Map<IReadOnlyList<Product>, IReadOnlyList<ProductToReturnDto>>
                (products);

            //Using AutoMapper
            return Ok(new Pagination<ProductToReturnDto>(productParams.PageIndex,
            productParams.PageSize, totalItems,data));
        }

        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)] //For swagger to return specific reponse type
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]//For swagger to return specific reponse type
        public async Task<ActionResult<ProductToReturnDto>> GetProduct(int id)
        {
            //return await _repo.GetProductByIdAsync(id);

            //return await _productsRepo.GetByIdAsync(id);
             var spec = new ProductsWithTypesAndBrandsSpecification(id);

             //return await _productsRepo.GetEntityWithSpec(spec);

             //Dto
             var product = await _productsRepo.GetEntityWithSpec(spec);

             if (product==null) return NotFound(new ApiResponse (404));

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