using System;
using System.Collections.Generic;
using System.Linq.Expressions;

namespace Core.Specifications
{
    //To include IQuerable issue because we're using IGenericRepository
    public interface ISpecification<T>
    {
        Expression<Func<T, bool>> Criteria {get;}
        List <Expression<Func<T, object>>> Includes {get;}
        Expression<Func<T, object>> OrderBy{get;}
        Expression<Func<T, object>> OrderByDescending{get;}

        //For pagination
        int Take {get;}
        int Skip{get;}
        bool isPagingEnabled{get;}
        
    }
}