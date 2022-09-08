import { Meteor } from 'meteor/meteor'
import { Template } from 'meteor/templating'
import { ReactiveVar } from 'meteor/reactive-var'
import './forbidden.html'


Template.forbidden.onCreated(function () {  
    const img = [1, 2, 3, 4, 5]
    const random = Math.floor(Math.random() * img.length);
    this.imgUrl = new ReactiveVar(`/img/gtfo/GTFO(${img[random]}).png`)
})
Template.forbidden.helpers({  
    imgUrl(){
        return Template.instance().imgUrl.get()
    }
})
Template.forbidden.events({
    'click .getback'(e, t){
        history.back()
    }
})