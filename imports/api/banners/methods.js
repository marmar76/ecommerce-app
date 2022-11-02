import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check'; 
import { Banner, Banners } from './banners';
import moment from 'moment';
Meteor.methods({
    'updateBanner'(id,data){
        console.log(data);
        check(data.name, String)
        check(data.description, String)
        // check(data.ext, String) 
        data.picture = id +data.ext
        console.log(data);
        Banners.update({_id: id},{$set: data})
        return id
    },  
    'deleteBanner'(id){
        return Banners.update({_id: id},{$set: {status: false}})
        
    },  
    'createBanner'(data){
        check(data.name, String)
        check(data.description, String)
        // check(data.ext, String) 

        const id = Banners.insert(data) 
        Banners.update({_id: id}, {$set: {
            picture: id + data.ext,
            status: true
        }})
        return id 
    },
    'refreshAllBanner'(){
        let banner = Banners.find({status: true}).fetch();
        banner = banner.map(function (x) {
            let check 
            if( moment(x.startDate).format('LL') <= moment(new Date()).format('LL') && moment(x.expiredDate).format('LL')  >= moment(new Date()).format('LL') ){
                check = true
            }
            else{
                check = false 
            }
            Banners.update({_id: x._id}, {$set: {
                check
            }})
            return x
        })
        return banner
    },
    async 'getAllBanner'(filtering){
        const thisFilter = {}
        const sort = {}
        if (filtering) {
            thisFilter.status = true
            if ((+filtering.sort) === 1) {
                sort.name = 1
            } else if ((+filtering.sort) === 2) {
                sort.name = -1
            } 
        }
        const banner = Banners.find(thisFilter, {
            sort: sort
        }).fetch();
        // console.log(banner);
        if(filtering){
            let Banners = banner.filter(function (x) {   
              return (x.name.toLowerCase().includes(filtering.filter.toLowerCase()))  
            })
            let gettingImage = Banners.map(async function (x) {
                if(x.picture){
                    const profilePictureLink = await getFireImage('banners/picture', x.picture)
                    x.link = profilePictureLink
                }
                return x
            })
            return await Promise.all(gettingImage)
        }
    },
    async 'getMyBanner'(_id){
        // check(id,String);
        const banner = Banners.findOne({_id: _id});
        if(banner.picture){
            const profilePictureLink = await getFireImage('banners/picture', banner.picture)
            banner.picture = profilePictureLink
        }
        
        return banner
    },
})