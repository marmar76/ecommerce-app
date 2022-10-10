import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import { Promotions } from './promotions';

Meteor.methods({
    'createPromotion'(promotion){
        check(promotion.name, String)
        check(promotion.code, String)
        check(promotion.discount, Number)
        check(promotion.description, String)
        check(promotion.status, Boolean)
        check(promotion.startDate, Date)
        check(promotion.expiredDate, Date)
        return Promotions.insert(promotion)
    },
    'getAllPromotion'(filtering){
        const thisFilter = {}
        const sort = {} 
        if(filtering){
              
              if((+filtering.sort) === 3){ 
                sort.startDate = 1
              }
              else if((+filtering.sort) === 4){ 
                sort.startDate = -1
              }
              else if((+filtering.sort) === 5){ 
                sort.expiredDate = 1
              }
              else if((+filtering.sort) === 6){ 
                sort.expiredDate = -1
              } 
            if(filtering.filterstartdate || filtering.filterexpireddate){
              thisFilter[filtering.dateOption] = {}
            }
            if(filtering.filterstartdate){
              thisFilter[filtering.dateOption]["$gte"] = filtering.filterstartdate
            }
            if(filtering.filterexpireddate){
              thisFilter[filtering.dateOption]["$lte"] = filtering.filterexpireddate
            }
            thisFilter.status = true;
        } 
        const promotion = Promotions.find(thisFilter, {
            sort: sort
          }).fetch();
          if(filtering){
            return promotion.filter(function (x) {  
              return (x.name.toLowerCase().includes(filtering.filter.toLowerCase()))  
            }).sort(function (a,b) {
                if((+filtering.sort) == 1){
                  return a.name.toLowerCase().localeCompare(b.name.toLowerCase())
                }
                else if((+filtering.sort) == 2){
                  return b.name.toLowerCase().localeCompare(a.name.toLowerCase())
                }
            })
            
          }

        return promotion;
    },
    'getOnePromotion'(id){
        return Promotions.findOne({_id: id});
    },
    'editPromotion'(promotion, id){
        check(id, String)
        check(promotion, Object)
        check(promotion.name, String)
        check(promotion.code, String)
        check(promotion.discount, Number)
        check(promotion.description, String) 
        check(promotion.startDate, Date)
        check(promotion.expiredDate, Date)
        return Promotions.update({_id: id},{
            $set:promotion
        });
    },    
    'deletePromotion'(id){
        return Promotions.update({_id:id},{ $set:{
            status: false
        }});
    },
    
  'getTodayPromotion'(currentDt){
    check(currentDt, Date) 
    const promotions = Promotions.find({
      startDate: {
        $lte: currentDt
      },
      expiredDate: {
        $gte: currentDt
      }
    }).fetch(); 
    return promotions;
  },
})