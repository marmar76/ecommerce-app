import {
    Meteor
} from 'meteor/meteor';
import {
    check
} from 'meteor/check';
import {
    Invoices
} from './invoices';
import { fetch, Headers } from 'meteor/fetch';
import moment from 'moment';
import { Items } from '../items/items';
import { Promotions } from '../promotions/promotions';
moment.locale('id'); 
const origin = "444" //surabaya
const BASE_URL = 'https://api.sandbox.midtrans.com'

const midtransClient = require('midtrans-client');
const kurir = [
    {
        name: 'jne',
        label: "JNE",
        getDate: function (x) {
            function showEstimation(param) {  
                const day = param.split('-')
                const early = moment().add({days: day[0]}).format('LL')
                const latest = moment().add({days: day[1]}).format('LL')
                return {label: early + "-" + latest, jsDate: moment().add({days: day[0]}).toDate()}
            }
            const thisCourier = []  
            for (const i of x.rajaongkir.results) {
                for (const j of i.costs) {
                    for (const k of j.cost) {
                        const estimation = showEstimation(k.etd)
                        thisCourier.push({
                            code: j.service,
                            desc: j.description,
                            value: k.value,
                            estimation: estimation.label,
                            jsDate: estimation.jsDate
                        })
                        
                    }
                }
            }
            return thisCourier
        },
        
    },{
        name: 'pos',
        label: "Pos Indonesia",
        getDate: function (x) {
            function showEstimation(param) {  
                let day = param.split(' ')[0]
                if(day.includes('-')){
                    day = day.split('-')
                    const early = moment().add({days: day[0]}).format('LL')
                    const latest = moment().add({days: day[1]}).format('LL')

                    const jsDate = moment().add({days: day[0]}).toDate()
                    // return early + "-" + latest
                    return {label: early + "-" + latest, jsDate}
                    return {label: early + "-" + latest, jsDate: moment().add({days: day[0]})}
                }
                else{
                    return {label: moment().add({days: day}).format('LL'), jsDate: moment().add({days: day}).toDate()}
                    return {label: moment().add({days: day}).format('LL'), jsDate: null}
                    // return moment().add({days: day}).format('LL')
                }
            }
            const thisCourier = []  
            for (const i of x.rajaongkir.results) {
                for (const j of i.costs) {
                    for (const k of j.cost) {
                        const estimation = showEstimation(k.etd)
                        thisCourier.push({
                            // code: j.service,
                            desc: j.service,
                            value: k.value,
                            estimation: estimation.label,
                            jsDate: estimation.jsDate
                        })   
                    }
                }
            }
            return thisCourier
        }
    },{
        name: 'tiki',
        label: "Tiki",
        getDate: function (x) {
            function showEstimation(param) {
                return {label:moment().add({days: param}).format('LL'), jsDate: moment().add({days: param}).toDate()}
                return moment().add({days: param}).format('LL') 
                // const day = param.split(' ')[0]
                // if(day.includes('-')){
                //     const early = moment().add({days: day[0]}).format('LL')
                //     const latest = moment().add({days: day[0]}).format('LL')
                //     return early + " - " + latest
                // }
                // else{
                //     return moment().add({days: day}).format('LL')
                // }
            }
            const thisCourier = []  
            for (const i of x.rajaongkir.results) {
                for (const j of i.costs) {
                    for (const k of j.cost) {
                        const estimation = showEstimation(k.etd)
                        thisCourier.push({
                            code: j.service,
                            desc: j.description,
                            value: k.value,
                            estimation: estimation.label,
                            jsDate: estimation.jsDate
                        })   
                    }
                }
            }
            return thisCourier
        } 
    }
]
const settings = Meteor.settings.public
function getToken(parameter) {
    return new Promise(function (resolve, reject) {
        let snap = new midtransClient.Snap({
            isProduction: false,
            serverKey: settings.MIDTRANS_SERVERKEY,
            clientKey: settings.MIDTRANS_CLIENTKEY
        });
        
        // let parameter = {
            //   "transaction_details": {
                //     "order_id": "test-transaction-123",
                //     "gross_amount": 200000
                //   },
                //   "credit_card": {
                    //     "secure": true
        //   }
        // };
        
        snap.createTransaction(parameter).then((transaction) => {
            resolve(transaction.token)
            // transactionToken = transaction.token
            // transaction token
            // console.log('transactionToken:', transactionToken);
        }).catch((err) => {
            reject(err)
        })
        // return transactionToken
    });
}
Meteor.methods({
    async 'createInvoice'(data) {
        check(data.userId, String)
        check(data.userUsername, String)
        check(data.items, Array)
        check(data.totalPurchase, Number)
        check(data.discount, Number)
        // check(data.promotionId, String)
        // check(data.promotionCode, String)
        // check(data.createdBy, String)
        data.createdBy = Meteor.userId()
        data.createdAt = new Date()
        data.status = 1
        data.log = [{
            id: 1,
            timestamp: new Date()
        }]
        data.paymentToken = null
        const id = Invoices.insert(data)
        const items = data.items
        // items.map(function (x) {  
        //     return {
        //         id: x.itemId,
        //         price: x.price,
        //         name: x.name,
        //         quantity: x.quantity
        //     }
        // })
        items.push({
            id: "Courier",
            price: data.ongkir.value,
            name: data.ongkir.desc,
            quantity: 1
        })
        const parameter = {
            'transaction_details': {
                'order_id' : id,
                'gross_amount' : data.totalPurchase,
            },
            // 'customer_details': {
                //     'first_name' : user.username,
                //     // 'last_name' : 'pratama',
                //     'email' : 'budi.pra@example.com',
                //     'phone' : '08111222333',
                
                // },
            "item_details": items
        }
            
        const token = await getToken(parameter)
        Invoices.update({_id: id}, {$set: {
            paymentToken: token
        }})
        return token
            
        },
        async 'confirmPayment'(res, successObj){
            if(successObj){
                console.log(successObj);
                const thisInvoice = Invoices.findOne({_id: successObj.order_id})
                if(thisInvoice){
                    const thisUser = Meteor.users.findOne({_id: Meteor.userId()})
                    // console.log(id);
                    thisInvoice.payment = successObj
                    thisInvoice.status = 200
                    thisInvoice.log.push({
                        id: 200,
                        timestamp: new Date()
                    })
                    for (const i of thisInvoice.items) {
                        const item = i.id.split('-')
                        const thisItem = Items.findOne({_id: item[0]})
                        thisItem.models[item[1]].stock = (+thisItem.models[item[1]].stock) - i.quantity
                        const userCartPosition = thisUser.cart.findIndex(function (x) {  
                            return x.itemId == i.id
                        })
                        thisUser.cart.splice(userCartPosition, 1)
                        Items.update({_id: item[0]}, {$set: thisItem})
                    }
                    Meteor.users.update({_id: Meteor.userId()}, {$set: thisUser})
                    Invoices.update({_id: thisInvoice._id}, {$set: thisInvoice})
                }
                else{
                    console.log("invalid invoice");
                    throw new Meteor.Error("invalid invoice", "Invalid Invoice")
                }
            }
            else{
                console.log("success object");
                throw new Meteor.Error('invalid success object', "Invalid  Success Object")
            }

            // const thisOngkir = await fetch(`${BASE_URL}/v2/${id}/status`, {
            //     method: 'POST', // *GET, POST, PUT, DELETE, etc.
            //     // mode: 'cors', // no-cors, *cors, same-origin
            //     // cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            //     // credentials: 'same-origin', // include, *same-origin, omit
            //     headers: new Headers({
            //         'Content-Type': 'application/json',
            //         'Accept': 'application/json',
            //         'Authorization': settings.MIDTRANS_SERVERKEY,
            //     }),
            //     // redirect: 'follow', // manual, *follow, error
            //     // referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
            //     body: JSON.stringify({
            //         origin: origin,
            //         destination,
            //         weight,
            //         courier: x.name
            //     }) // body data type must match "Content-Type" header
            // });
            // const result = await thisOngkir.json()
            
        },
        'deleteTransaction'(id){
            return Invoices.remove({_id: id})
        },
        'clientKey'(){
            const settings = Meteor.settings.public
            return settings.MIDTRANS_CLIENTKEY
        },
        'createToken'(parameter) {
            
            const settings = Meteor.settings.public
            let snap = new midtransClient.Snap({
                isProduction: false,
                serverKey: settings.MIDTRANS_SERVERKEY,
                clientKey: settings.MIDTRANS_CLIENTKEY
            });
            
            // let parameter = {
                //   "transaction_details": {
                    //     "order_id": "test-transaction-123",
                    //     "gross_amount": 200000
                    //   },
                    //   "credit_card": {
                        //     "secure": true
                        //   }
                        // };
                        

        snap.createTransaction(parameter)
            .then((transaction) => {
                // transaction token
                let transactionToken = transaction.token;
                console.log('transactionToken:', transactionToken);
            })


    },
    'getPromotion'(date){
        date = date ? date : new Date()
        const promotion = Promotions.find({
            startDate: {
                $gte: date
            },
            endDate: {
                $lte: date
            }
        }).fetch()
        return promotion

    },
    async 'getOngkir'(destination, weight){
        // console.log({
        //     key: settings.RAJAONGKIR_KEY,
        //     origin,
        //     destination,
        //     weight
        //     // 'Content-Type': 'application/json'
        // });
        const allOngkir = []
        const ongkir = kurir.map(async function (x) {  
            const thisOngkir = await fetch(`https://api.rajaongkir.com/starter/cost`, {
                method: 'POST', // *GET, POST, PUT, DELETE, etc.
                // mode: 'cors', // no-cors, *cors, same-origin
                // cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                // credentials: 'same-origin', // include, *same-origin, omit
                headers: new Headers({
                    key: settings.RAJAONGKIR_KEY,
                    'Content-Type': 'application/json'
                }),
                // redirect: 'follow', // manual, *follow, error
                // referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
                body: JSON.stringify({
                    origin: origin,
                    destination,
                    weight,
                    courier: x.name
                }) // body data type must match "Content-Type" header
            });
            const result = await thisOngkir.json()
            // return {converted: x.getDate(result), result}
            try {
                const thisDate = x.getDate(result)
                try {
                    for (const i of thisDate) {
                        let label = ''
                        if(i){
                            if(i.estimation.includes('-')){
                                label = i.estimation.split('-')[0]
                            }
                            else{
                                label = i.estimation
                            }
                            const findSimiliar = allOngkir.find(function (u) {
                                return u.label == label
                            })
                            if(findSimiliar){
                                findSimiliar.data.push(i)
                            }
                            else{
                                allOngkir.push({
                                    label,
                                    data: [i],
                                    jsDate: i.jsDate
                                })
                            }
                        }
                    }
                } catch (error) {
                    console.log(error);
                    return thisDate
                }
                
                return thisDate    
            } catch (error) {
                throw new Meteor.Error('error-bos', result.rajaongkir.status.description)
            }
            

        })
        
        const something = await Promise.all(ongkir)
        // console.log(something);
        return allOngkir.sort(function (a, b) {  
            return a.jsDate - b.jsDate
        }).map(function (r) {  
            r.data = r.data.sort(function (a, b) {  
                return a.value - b.value
            })
            return r
        })
    },
    async 'getUserInvoice'(_id){
        const invoice = Invoices.find({userId:_id}).fetch()
        if(invoice){
            const newInvoice = invoice.map(async function (x) {
                const items = x.items.map(async function (y) {
                    const itemId = y.id.split('-')
                    const item   = Items.findOne({_id: itemId[0]})
                    const thisModel = item.models[itemId[1]]
                    if(item.picture){
                        try {
                            const profilePictureLink = await getFireImage('items/picture', item.picture)
                            item.link = profilePictureLink
                        } catch (error) {
                            console.log(error);
                        }
                    }
                    y.link = item.link
                    return y
                })
                x.items = await Promise.all(items)
                return x
            })
            return await Promise.all(newInvoice)
        }
    },
    'getOneInvoice'(_id){
        console.log(Invoices.findOne({_id:_id}));
        return Invoices.findOne({_id:_id})
    },
    'getAllInvoice'(filtering){
        const thisFilter = {}
        const sort = {}
        // if (filtering) {
        //     thisFilter.status = true
        //     if ((+filtering.sort) === 1) {
        //         sort.name = 1
        //     } else if ((+filtering.sort) === 2) {
        //         sort.name = -1
        //     } 
        // }
        const invoices = Invoices.find(thisFilter, {
            sort: sort
        }).fetch();
        console.log(invoices);
        let invoice = invoices.filter(function (x) {   
            return x
        })
        console.log(invoice);
        return invoice
    },
    'updateInvoiceStatus'(_id, nextStatus){
        return Invoices.update({_id:_id},{
            $set:{
                status: nextStatus
            }
        })
    },


})