import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check'; 
import { Banner, Banners } from './banners';

Meteor.methods({
    'updateBanner'(id,data){
        console.log(data);
        check(data.name, String)
        check(data.description, String)
        // check(data.ext, String)
        check(data.check, Boolean)
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
        check(data.check, Boolean)

        const id = Banners.insert(data) 
        Banners.update({_id: id}, {$set: {
            picture: id + data.ext,
            status: true
        }})
        return id 
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