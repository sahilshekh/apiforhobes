class  ApiFeatures {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }
    search(){
        const keyword =this.queryString.keyword
        ?
        {
            name:{
                $regex:this.queryString.keyword,
                $options:'i'
            },
        }:
        {};

        console.log(keyword);

        this.query=this.query.find({...keyword});
        return this;
    }
   filter(){
       const queryCopy ={...this.queryString};
       //remove the page and limit from query
         const excludedFields = ['page','limit','keyword'];
            excludedFields.forEach((key)=>delete queryCopy[key]);

        //sort for the rating and price
       // console.log(queryCopy);
        let queryString = JSON.stringify(queryCopy);
        queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, (key) => `$${key}`);
        this.query = this.query.find(JSON.parse(queryString));

 // console.log(queryString)
        return this;
   }
    pagination(resultPerPage){
        const currentPage = Number(this.queryString.page ) || 1;
        const skip = resultPerPage * (currentPage-1);

        this.query = this.query.skip(skip).limit(resultPerPage);
        console.log(currentPage)
        return this;
    }

 }
module.exports = ApiFeatures;