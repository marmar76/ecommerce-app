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
        const thisDistricts  = Districts.find({ name : { "$regex" : keyword , "$options" : "i"}}, {
            limit: 400
        }).fetch()
        const thisResult = thisDistricts.map(function (x, i) {  
            // const thisRegency = Regencies.findOne({code: x.regencyCode})
            // const thisProvince = Provinces.findOne({code: thisRegency.provinceCode})
            return {
                id: i,
                label: `${x.name}, ${x.type} ${x.city}, ${x.province}`,
                city_id: x.city_id,
                province_id: x.province_id,
                districtCode: x.subdistrict_id
                // id: i,
                // label: `${x.name}, ${thisRegency.name}, ${thisProvince.name}`,
                // city_id: thisRegency.city_id,
                // province_id: thisProvince.province_id,
                // districtCode: x.code
            }
        })
        // const additionResult = Regencies.find({ name : { "$regex" : keyword , "$options" : "i"}}).fetch()
        // additionResult.map(function (x) {  
        //     const thisDistricts = Districts.find({code: x.regencyCode}).fetch()
        //     const thisProvince = Provinces.findOne({code: x.provinceCode})
        //     thisDistricts.map(function (y) {  
        //         const isOnResult = thisResult.find((z) => z.districtCode == y.districtCode)
        //         if(!isOnResult){
        //             thisResult.push( {
        //                 id: thisResult.length,
        //                 // district - regency - province
        //                 label: `${y.name.initCap()}, ${x.name.initCap()}, ${thisProvince.name.initCap()}`,
        //                 city_id: x.city_id,
        //                 province_id: thisProvince.province_id,
        //                 districtCode: y.code
        //             } )
        //         }
        //     })
        // })
        return thisResult.map(function (x) {  
            x.thisVal = JSON.stringify({
                label: x.label,
                city_id: x.city_id,
                province_id: x.province_id
            })
            return x
        })
    }
})




