import {
    Meteor
} from 'meteor/meteor';
import {
    Template
} from 'meteor/templating';
import {
    FlowRouter
} from 'meteor/ostrio:flow-router-extra';
import moment from 'moment';
import './reviews.html';


Template.reviewPage.onCreated(function () {
    const self = this;
    this.item = new ReactiveVar();
    this.user = new ReactiveVar()
    this.star = new ReactiveVar()
    const paramId = FlowRouter.current().params._id
    const paramItemIndex = FlowRouter.current().params.itemIndex
    Meteor.call('getOneItemInvoice', paramId, paramItemIndex, function (err, res) {
        if(err){
            failAlert(err)
        }else{
            console.log(res);
            self.item.set(res)
        }
    })
    
    Meteor.call('getMyself', async function (err,res) {  
        if(err){
            console.log(err);
        }else{
            self.user.set(res)
        }
    })

})
Template.reviewPage.helpers({
    item(){
        return Template.instance().item.get()
    },
    user(){
        const user = Template.instance().user.get()
        if(user){
            return user
        }
        
    },
    equals(a, b){
        return a == b
    },
    isYellow(val){
        const star = Template.instance().star.get()
        return star >= val
    }

})

Template.reviewPage.events({
    'click .stars'(e, t){
        const star = $(e.target).attr('value');
        console.log(star);
        console.log(e.target);
        t.star.set(star)
    },
    'click #review'(e, t){
        const star = t.star.get()
        const review = $('#textReview').val();
        if(star && review){
            const item = t.item.get()
            const getItemId = item.id.split('-')
            const itemId = getItemId[0]
            const modelId = item.id
            
            const paramItemIndex = FlowRouter.current().params.itemIndex
            const data = {
                itemId,
                modelId,
                userUsername: item.userUsername,
                userId: item.userId,
                invoiceId: item.invoiceId,
                star,
                review,
                modelIndex: paramItemIndex
            }
            Meteor.call('createReview', data, function (err, res) {  
                if(err){
                    failAlert(err)
                }else{
                    console.log(res);
                    successAlertBack('success review Item')
                }
            })
            console.log(data);
        }else{
            failAlert('Review or Star cannot be empty')
        }
    }
    

})
