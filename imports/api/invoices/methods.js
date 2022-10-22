import {
    Meteor
} from 'meteor/meteor';
import {
    check
} from 'meteor/check';
import {
    Invoices
} from './invoices';
const midtransClient = require('midtrans-client');

function getToken(parameter) {
    return new Promise(function (resolve, reject) {
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
        const id = Invoices.insert(data)
        const items = data.items.map(function (x) {  
            return {
                id: x.itemId,
                price: x.price,
                name: x.name,
                quantity: x.quantity
            }
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
            return await getToken(parameter)
            
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


    }

})