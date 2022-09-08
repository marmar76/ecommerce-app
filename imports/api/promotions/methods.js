import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import { Promotions } from './promotions';

Meteor.methods({
    'createPromotion'(param){
        check(param.name, String)
        check(param.description, String)
        check(param.status, Boolean)
        check(param.startDate, Date)
        check(param.expiredDate, Date)
        return Promotions.insert(param)
    }
})