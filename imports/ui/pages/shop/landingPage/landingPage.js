import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import moment from 'moment';
import './landingPage.html'; 


Template.landingPage.onCreated(function () {
    // const self = this;
    // self.filtering = new ReactiveVar({
    //     filter: '',
    //     sort: 1,
    // })
    // this.banner = new ReactiveVar();
    // this.index = new ReactiveVar(1);
    // this.now = new ReactiveVar(-1);
    // Meteor.call('getAllBanner', self.filtering.get(), function (err, res) {  
    //     self.banner.set(res.filter((x) => x.check == true).map(function (x) {  
    //         x.index = +self.index.get()
    //         self.index.set(+self.index.get() + 1)
    //         return x 
    //     }))
    // }) 
    
})
  
Template.landingPage.helpers({
    // banners(){
    //     const banner = Template.instance().banner.get()
    //     if(banner && banner.length > 0){
    //         console.log(banner);
    //         return banner
    //     }
    //     return false
    // },
    // equals(a, b){
    //     return a == b
    // },
    // minus(a){ 
    //     return a-1
    // }
})

Template.landingPage.events({

})