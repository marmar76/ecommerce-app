import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Items } from './items';
import { Categories, SubCategories } from '../categories/categories';
import { Reviews } from '../reviews/reviews';

function calculateStar(result){
    return +(Math.round(result + "e+2")  + "e-2");
}
Meteor.methods({
    'createItem'(item, models){
        // check(item.name, String)
        // check(item.price, Number)
        // check(item.description, String)
        // check(item.weight, Number)
        // check(item.stock, Number)
        // check(item.condition, String)
        // check(item.subcategoryId, String)
        // check(item.categoryId, String)
        // check(item.categoryName, String)
        // check(item.status, Boolean)
        item.createdAt = new Date()
        item.createdBy = Meteor.userId()
        item.status = true
        const id = Items.insert(item)
        Items.update({_id: id}, {$set: {
            picture: id + item.ext,
            models: models.map(function (x, i) {  
                x.itemId = id + "-" + i
                x.status = true
                return x
            })
        }})
        return id
    },
    async 'getAllItem'(filtering){
        const thisFilter = {}
        const options = {}
        const sort = {}
        options.sort = sort
        if (filtering) {
            if(filtering.limit){
                options.limit = filtering.limit
            }
        // if ((+filtering.sort) === 1) {
        //     sort.price = 1
        // } else if ((+filtering.sort) === 2) {
        //     sort.price = -1
        // } 
        // if(filtering.hargaAwal || filtering.hargaAkhir)
        // {
        //     thisFilter.price = {}
        // }
        // if(filtering.hargaAwal){
        //     thisFilter.price.$gte = filtering.hargaAwal
        // }
        // if(filtering.hargaAkhir){
        //     thisFilter.price.$lte = filtering.hargaAkhir
        // } 
        // if(filtering.dateFrom){
        //     thisFilter.createdAt = {$gte: filtering.dateFrom}
        // } 
            thisFilter.status = true
            // if((filtering.filtercategory) && (+filtering.filtercategory) != -1){
            //     thisFilter.category = filtering.filtercategory.toString();
            //     if((filtering.filtersubcategory)  && (+filtering.filtersubcategory) != -1){
            //         thisFilter.subcategory = filtering.filtersubcategory.toString();
            //     }
            // }
            if(filtering.category){
                console.log(filtering.category);
                thisFilter.category = filtering.category.toString()
            }
            if(filtering.subcategory && filtering.subcategory != -1){
                thisFilter.subcategory = filtering.subcategory.toString() 
            }
        }
        // console.log(thisFilter);
        const item = Items.find(thisFilter, options).fetch();
        const categories = Categories.find().fetch()
        const subcategories = SubCategories.find().fetch()
        // console.log(item);
        let items = item.map(async function (y) {  
            const thisCategory = categories.find((x) => y.category == x._id)
            const thisSubcategory = subcategories.find((x) => y.subcategory == x._id)
            const thisReview = Reviews.find({itemId : y._id }).fetch()
            
            y.star = thisReview.length ? thisReview.reduce(function (prev, next) { 
                return (parseFloat(prev) + parseFloat(next.star)) * 1.0
            }, 0.0) / parseFloat(thisReview.length * 1.0) : 0
            y.star = calculateStar(y.star)
            y.categoryName = thisCategory.name
            y.subcategoryName = thisSubcategory.name
            const lowestPrice = y.models.sort(function (a, b) {  
                return a.price - b.price
            })
            y.lowestPrice = lowestPrice[0].price
            y.price = lowestPrice[0].price
            y.models= y.models.filter((z) => z.status == true)
            if(y.picture){
                try {
                    const itemPicture = await getFireImage('items/picture', y.picture)
                    y.link = itemPicture
                } catch (error) {
                    console.log(error);
                    console.log(y.picture);
                }
            }
            return y
        })
        items = await Promise.all(items)
        if (filtering) {
            return items.filter(function (x) {  
                if(filtering.hargaAwal){
                    if(x.price < filtering.hargaAwal){
                        return false
                    }
                }
                if(filtering.hargaAkhir){
                    if(x.price > filtering.hargaAkhir){
                        return false
                    }
                }
                if(filtering.filter && !x.name.toLowerCase().includes(filtering.filter.toLowerCase())){
                    return false
                }
                return true
            }).sort(function (x, y) { 
                if ((+filtering.sort) == 1) {
                    return x.price - y.price
                }
                if ((+filtering.sort) == 2) {
                    return y.price - x.price 
                } 
            })
            
        }
        return items;
    },
    async 'getOneItem'(id){
        check(id,String);
        const thisItem = Items.findOne({_id: id});
        const thisCategory = Categories.findOne({_id: thisItem.category})
        const thisSubcategory = SubCategories.findOne({_id: thisItem.subcategory})
        const thisReview = Reviews.find({itemId : id }).fetch()
            
        thisItem.star = thisReview.reduce(function (prev, next) { 
            return (parseFloat(prev) + parseFloat(next.star)) * 1.0
        }, 0.0) / parseFloat(thisReview.length * 1.0)
        thisItem.star = calculateStar(thisItem.star)
        if(thisItem.picture){
            try {
                const profilePictureLink = await getFireImage('items/picture', thisItem.picture)
                thisItem.link = profilePictureLink
            } catch (error) {
                console.log(error);
            }
        }
        thisItem.reviewLength = thisReview.length
        thisItem.categoryName = thisCategory.name
        thisItem.subcategoryName = thisSubcategory.name
        let items = thisItem.models.filter((z) => z.status == true).map(function (x) {
            if(!x.specification){
                x.specification = thisSubcategory.specification
            }
            return x
        })
        // items =  await Promise.all(items)
        thisItem.models = items 
        return thisItem
    }, 
    'getOneModel'(id, idmodel){
        const thisItem = Items.findOne({_id: id});
        const model = thisItem.models  
        const spesificmodel = model.find((x) => x.itemId == idmodel)
        return spesificmodel
    },
    'getSpecificItems'(id){
        check(id,String);
        const thisItem = Items.find().fetch(); 
        return thisItem.filter((x) => x.subcategory == id) 
    }, 
    'getOneJenis'(id, idJenis){
        check(id,String);
        check(idJenis,String);
        const thisItem = Items.findOne({_id: id});
        const thisModel = thisItem.models
        let oneModel 
        for (const i of thisModel) {
            if(i.itemId == idJenis) {
                oneModel = i  
                // console.log(oneModel);
            }
        } 
        return oneModel
    }, 
    'deleteItem'(id){
        check(id,String)
        return Items.update({_id: id}, {$set: {
            status: false
        }})
    },
    'updateItem'(id,item){
        item.createdAt = new Date()
        item.createdBy = Meteor.userId()
        item.status = true
        Items.update({_id: id}, {$set: item})
        Items.update({_id: id}, {$set: {
            models: item.models.map(function (x, i) {  
                x.itemId = id + "-" + i
                x.status = true
                return x
            })
        }})
        const thisItem = Items.findOne({_id: id});
        return thisItem
    },
    'deleteModel'(id, idmodel){
        const thisItem = Items.findOne({_id: id});
        const thisModel = thisItem.models.find((x) => x.itemId == idmodel)
        thisModel.status = false
        Items.update({_id: id}, {$set: thisItem})
        return Items.update({_id: id}, {$set: thisItem})
    },
    'updateModel'(id, idmodel, data){
        const thisItem = Items.findOne({_id: id});
        const thisModel = thisItem.models.find((x) => x.itemId == idmodel)
        thisModel.name = data.name
        thisModel.price = data.price
        thisModel.stock = data.stock
        thisModel.specification = data.specification 
        Items.update({_id: id}, {$set: thisItem})
        return Items.update({_id: id}, {$set: thisItem})
    },
    async 'getMyItem'(_id){
        const item = Items.findOne({_id: _id});
        if(item.picture){
            const profilePictureLink = await getFireImage('items/picture', item.picture)
            item.picture = profilePictureLink
        }
        return item
    },
    async 'getItemRecomendation'(itemId){
        const thisItem = Items.findOne({_id: itemId})
        const item = Items.find({
            category: thisItem.category,
            subcategory: {$ne: thisItem.category},
            _id: {$ne: itemId}
        }, {limit: 9}).fetch()
        const categories = Categories.find().fetch()
        const subcategories = SubCategories.find().fetch()
        // console.log(item);
        let items = item.map(async function (y) {  
            const thisCategory = categories.find((x) => y.category == x._id)
            const thisSubcategory = subcategories.find((x) => y.subcategory == x._id)
            const thisReview = Reviews.find({itemId : y._id }).fetch()
            
            y.star = thisReview.length ? thisReview.reduce(function (prev, next) { 
                return (parseFloat(prev) + parseFloat(next.star)) * 1.0
            }, 0.0) / parseFloat(thisReview.length * 1.0) : 0
            y.star = calculateStar(y.star)
            y.categoryName = thisCategory.name
            y.subcategoryName = thisSubcategory.name
            const lowestPrice = y.models.sort(function (a, b) {  
                return a.price - b.price
            })
            y.lowestPrice = lowestPrice[0].price
            y.price = lowestPrice[0].price
            y.models= y.models.filter((z) => z.status == true)
            if(y.picture){
                try {
                    const itemPicture = await getFireImage('items/picture', y.picture)
                    y.link = itemPicture
                } catch (error) {
                    console.log(error);
                    console.log(y.picture);
                }
            }
            return y
        })
        items = await Promise.all(items)
        return items
        
    },
    async 'getSimiliarItem'(itemId){
        const thisItem = Items.findOne({_id: itemId})
        const item = Items.find({
            category: thisItem.category,
            subcategory: thisItem.category
        }).fetch()
        const categories = Categories.find().fetch()
        const subcategories = SubCategories.find().fetch()
        // console.log(item);
        let items = item.map(async function (y) {  
            const thisCategory = categories.find((x) => y.category == x._id)
            const thisSubcategory = subcategories.find((x) => y.subcategory == x._id)
            const thisReview = Reviews.find({itemId : y._id }).fetch()
            
            y.star = thisReview.length ? thisReview.reduce(function (prev, next) { 
                return (parseFloat(prev) + parseFloat(next.star)) * 1.0
            }, 0.0) / parseFloat(thisReview.length * 1.0) : 0
            y.star = calculateStar(y.star)
            y.categoryName = thisCategory.name
            y.subcategoryName = thisSubcategory.name
            const lowestPrice = y.models.sort(function (a, b) {  
                return a.price - b.price
            })
            y.lowestPrice = lowestPrice[0].price
            y.price = lowestPrice[0].price
            y.models= y.models.filter((z) => z.status == true)
            if(y.picture){
                try {
                    const itemPicture = await getFireImage('items/picture', y.picture)
                    y.link = itemPicture
                } catch (error) {
                    console.log(error);
                    console.log(y.picture);
                }
            }
            return y
        })
        items = await Promise.all(items)
        return items
    }
})