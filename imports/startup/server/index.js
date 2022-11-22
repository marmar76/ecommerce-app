// Import server startup through a single index entry point

// import './fixtures.js';
import './register-api.js';
import './sample'
import { fetch, Headers } from 'meteor/fetch';
import { Districts, Provinces, Regencies } from '../../api/data/regencies.js';
const settings = Meteor.settings.public
const midtransClient = require('midtrans-client');
// function seedData() {  
//     let pos = 1
//     const district = Districts.find().fetch()
//     for (const i of district) {
//         if(i.subdistrict_id != pos++)console.log(pos);
//         // i.name = i.province
//         // delete i.province
//         // Provinces.update({_id: i._id}, {$unset: {province: ""}})
//     }
// }
// seedData()
// async function seedData() {  
//     const regencies = Regencies.find().fetch()
//     for (const i of regencies) {
//         while (true) {
//             try {
//                 const thisOngkir = await fetch(`https://pro.rajaongkir.com/api/subdistrict?city=${i.city_id}`, {
//                     method: 'GET', // *GET, POST, PUT, DELETE, etc.
//                     // mode: 'cors', // no-cors, *cors, same-origin
//                     // cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
//                     // credentials: 'same-origin', // include, *same-origin, omit
//                     headers: new Headers({
//                         key: settings.RAJAONGKIR_KEY,
//                         'Content-Type': 'application/json'
//                     }),
//                     // redirect: 'follow', // manual, *follow, error
//                     // referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
//                     // body: JSON.stringify({
//                     //     city: "444"
//                     // }) // body data type must match "Content-Type" header
//                 });
//                 const result = await thisOngkir.json()
//                 console.log(result.rajaongkir.results.map(function (x) {  
//                     x.name = x.subdistrict_name
//                     delete x.subdistrict_name
//                     Districts.insert(x)
//                     return x
//                 }));
//                 break
//             } catch (error) {
                
//             }
            
//         }
        
//                 // break
//                 // console.log(result.rajaongkir.results.map(function (x) {  
//                 //     Provinces.insert(x)
//                 // }));
//     }
// }
// seedData()
// Create Core API / Snap instance (both have shared `transactions` methods)
// const settings = Meteor.settings.public

// let apiClient = new midtransClient.Snap({
//         isProduction : false,
//         serverKey: settings.MIDTRANS_SERVERKEY,
//         clientKey: settings.MIDTRANS_CLIENTKEY
//     });
// apiClient.
// apiClient.transaction.notification(notificationJson)
//     .then((statusResponse)=>{
//         let orderId = statusResponse.order_id;
//         let transactionStatus = statusResponse.transaction_status;
//         let fraudStatus = statusResponse.fraud_status;

//         console.log(`Transaction notification received. Order ID: ${orderId}. Transaction status: ${transactionStatus}. Fraud status: ${fraudStatus}`);

//         // Sample transactionStatus handling logic

//         if (transactionStatus == 'capture'){
//             // capture only applies to card transaction, which you need to check for the fraudStatus
//             if (fraudStatus == 'challenge'){
//                 // TODO set transaction status on your databaase to 'challenge'
//             } else if (fraudStatus == 'accept'){
//                 // TODO set transaction status on your databaase to 'success'
//             }
//         } else if (transactionStatus == 'settlement'){
//             // TODO set transaction status on your databaase to 'success'
//         } else if (transactionStatus == 'deny'){
//             // TODO you can ignore 'deny', because most of the time it allows payment retries
//             // and later can become success
//         } else if (transactionStatus == 'cancel' ||
//           transactionStatus == 'expire'){
//             // TODO set transaction status on your databaase to 'failure'
//         } else if (transactionStatus == 'pending'){
//             // TODO set transaction status on your databaase to 'pending' / waiting payment
//         }
//     });