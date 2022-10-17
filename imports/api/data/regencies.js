import { Meteor } from 'meteor/meteor'; 
import { Mongo } from 'meteor/mongo';


export const Regencies = new Mongo.Collection('regencies')
export const Provinces = new Mongo.Collection('provinces')
export const Villages = new Mongo.Collection('villages')
export const Districts = new Mongo.Collection('districts')

Meteor.methods({
    'search-regencies'(keyword){
        String.prototype.initCap = function () {
            return this.toLowerCase().replace(/(?:^|\b)[a-z]/g, function (m) {
               return m.toUpperCase();
            });
         };
        const thisDistricts  = Districts.find({ name : { "$regex" : keyword , "$options" : "i"}}).fetch()
        const thisResult = thisDistricts.map(function (x, i) {  
            const thisRegency = Regencies.findOne({code: x.regencyCode})
            const thisProvince = Provinces.findOne({code: thisRegency.provinceCode})
            return {
                id: i,
                label: `${x.name.initCap()}, ${thisRegency.name.initCap()}, ${thisProvince.name.initCap()}`,
                city_id: thisRegency.city_id,
                province_id: thisProvince.province_id
            } 
            
        })
        return thisResult
    }
})




