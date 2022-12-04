import {
    Meteor
} from 'meteor/meteor';
import {
    check
} from 'meteor/check';
import {
    Invoices
} from './invoices';
import {
    fetch,
    Headers
} from 'meteor/fetch';
import moment from 'moment';
import {
    Items
} from '../items/items';
import {
    Promotions
} from '../promotions/promotions';
moment.locale('id');
const origin = "444" //surabaya
const BASE_URL = 'https://api.sandbox.midtrans.com'

const midtransClient = require('midtrans-client');
const kurir = [{
    name: 'jne',
    label: "JNE",
    getDate: function (x) {
        function showEstimation(param) {
            const day = param.split('-')
            const early = moment().add({
                days: day[0]
            }).format('LL')
            const latest = moment().add({
                days: day[1]
            }).format('LL')
            return {
                label: early + "-" + latest,
                jsDate: moment().add({
                    days: day[0]
                }).toDate()
            }
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

}, {
    name: 'pos',
    label: "Pos Indonesia",
    getDate: function (x) {
        function showEstimation(param) {
            let day = param.split(' ')[0]
            if (day.includes('-')) {
                day = day.split('-')
                const early = moment().add({
                    days: day[0]
                }).format('LL')
                const latest = moment().add({
                    days: day[1]
                }).format('LL')

                const jsDate = moment().add({
                    days: day[0]
                }).toDate()
                // return early + "-" + latest
                return {
                    label: early + "-" + latest,
                    jsDate
                }
                return {
                    label: early + "-" + latest,
                    jsDate: moment().add({
                        days: day[0]
                    })
                }
            } else {
                return {
                    label: moment().add({
                        days: day
                    }).format('LL'),
                    jsDate: moment().add({
                        days: day
                    }).toDate()
                }
                return {
                    label: moment().add({
                        days: day
                    }).format('LL'),
                    jsDate: null
                }
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
}, {
    name: 'tiki',
    label: "Tiki",
    getDate: function (x) {
        function showEstimation(param) {
            return {
                label: moment().add({
                    days: param
                }).format('LL'),
                jsDate: moment().add({
                    days: param
                }).toDate()
            }
            return moment().add({
                days: param
            }).format('LL')
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
}]
const settings = Meteor.settings.public
function checkInvoice(invoices) {
    if(Array.isArray(invoices)){
        return invoices.map(function (x) {  
            if(moment(x.createdAt).diff(new Date(), 'days') > 1 && x.status < 200){
                x.log.push({
                    id: 400,
                    timestamp: moment(invoices.createdAt).add({days: 1})
                })
                x.status = 400
                Invoices.update({_id: x._id}, {$set: x})
                // return x
            }
            return x    
        })
    }
    else{
        if(moment(invoices.createdAt).diff(new Date(), 'days') > 1 && invoices.status < 200){
            invoices.log.push({
                id: 400,
                timestamp: moment(invoices.createdAt).add({days: 1})
            })
            invoices.status = 400
            Invoices.update({_id: invoices._id}, {$set: invoices})
            return invoices
        }
    }
}

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

function syncStatus(_id) {
    const invoice = Invoices.findOne({
        _id: _id
    })
    const today = new Date()
    if (invoice.status == 202) {
        // console.log(today);
        // console.log(invoice.ongkir.jsDate);
        if (today >= invoice.ongkir.jsDate) {
            // console.log('yes');
            invoice.status = 203
        }
    }
    if (invoice.status == 203) {
        const nextDay = moment(new Date()).add(1, 'days').toDate();
        // console.log(nextDay);
        // console.log(invoice.ongkir.jsDate);
        if (nextDay >= invoice.ongkir.jsDate) {
            // console.log('ehek');
            invoice.status = 269
        }
    }
    // console.log(invoice.status);
    return invoice.status
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
        const thisUser = Meteor.users.findOne({
            _id: Meteor.userId()
        })
        data.paymentToken = null
        // data.items.map(function (x) {  
        //     return {
        //         id: x.itemId,
        //         price: x.price,
        //         name: x.name,
        //         quantity: x.quantity,
        //         isReview: false
        //     }
        // })
        const id = Invoices.insert(data)
        const items = data.items
        for (const i of items) {
            // const item = i.id.split('-')
            // const thisItem = Items.findOne({
            //     _id: item[0]
            // })
            // console.log(thisItem.models[item[1]].stock);
            // console.log(i.quantity);
            // thisItem.models[item[1]].stock = (+thisItem.models[item[1]].stock) - i.quantity
            const userCartPosition = thisUser.cart.findIndex(function (x) {
                return x.itemId == i.id
            })
            thisUser.cart.splice(userCartPosition, 1)
            // Items.update({
            //     _id: item[0]
            // }, {
            //     $set: thisItem
            // })
        }
        Meteor.users.update({
            _id: Meteor.userId()
        }, {
            $set: thisUser
        })
        items.push({
            id: "Courier",
            price: data.ongkir.value,
            name: data.ongkir.desc,
            quantity: 1
        })
        const parameter = {
            'transaction_details': {
                'order_id': id,
                'gross_amount': data.totalPurchase,
            },
            // 'customer_details': {
            //     'first_name' : user.username,
            //     // 'last_name' : 'pratama',
            //     'email' : 'budi.pra@example.com',
            //     'phone' : '08111222333',

            // },
            "item_details": items
        }
        // console.log(id);
        const token = await getToken(parameter)
        Invoices.update({
            _id: id
        }, {
            $set: {
                paymentToken: token
            }
        })
        return token

    },
    async 'confirmPayment'(res, successObj) {
        if (successObj) {
            console.log(successObj);
            const thisInvoice = Invoices.findOne({
                _id: successObj.order_id
            })
            if (thisInvoice) {
                if (thisInvoice.payment) {
                    console.log("done already");
                    return 'is already done'
                } else {
                    // const thisUser = Meteor.users.findOne({_id: Meteor.userId()})
                    // // console.log(id);
                    thisInvoice.payment = successObj
                    thisInvoice.status = 200
                    thisInvoice.log.push({
                        id: 200,
                        timestamp: new Date()
                    })
                    for (const i of thisInvoice.items) {
                        const item = i.id.split('-')
                        const thisItem = Items.findOne({_id: item[0]})
                        // console.log(thisItem.models[item[1]].stock);
                        // console.log(i.quantity);
                        thisItem.models[item[1]].stock = (+thisItem.models[item[1]].stock) - i.quantity
                        // const userCartPosition = thisUser.cart.findIndex(function (x) {  
                        //     return x.itemId == i.id
                        // })
                        // thisUser.cart.splice(userCartPosition, 1)
                        Items.update({_id: item[0]}, {$set: thisItem})
                    }
                    // Meteor.users.update({_id: Meteor.userId()}, {$set: thisUser})
                    Invoices.update({
                        _id: thisInvoice._id
                    }, {
                        $set: thisInvoice
                    })
                }
            } else {
                console.log("invalid invoice");
                throw new Meteor.Error("invalid invoice", "Invalid Invoice")
            }
        } else {
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
    'deleteTransaction'(id) {
        return Invoices.remove({
            _id: id
        })
    },
    'clientKey'() {
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
    'getPromotion'(date) {
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
    async 'getOngkir'(destination, weight) {
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
            console.log(result);
            // return {converted: x.getDate(result), result}
            try {
                const thisDate = x.getDate(result)
                try {
                    for (const i of thisDate) {
                        let label = ''
                        if (i) {
                            if (i.estimation.includes('-')) {
                                label = i.estimation.split('-')[0]
                            } else {
                                label = i.estimation
                            }
                            const findSimiliar = allOngkir.find(function (u) {
                                return u.label == label
                            })
                            if (findSimiliar) {
                                findSimiliar.data.push(i)
                            } else {
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
    async 'getUserInvoice'(_id) {
        let invoice = Invoices.find({
            userId: _id
        }, 
        {
            sort: {
                createdAt: -1
            }
        }).fetch()
        if (invoice) {
            invoice = checkInvoice(invoice)
            const newInvoice = invoice.map(async function (x) {
                const items = x.items.map(async function (y) {
                    const itemId = y.id.split('-')
                    const item = Items.findOne({
                        _id: itemId[0]
                    })
                    const thisModel = item.models[itemId[1]]
                    if (item.picture) {
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
                x.status = syncStatus(x._id)
                return x
            })
            return await Promise.all(newInvoice)
        }
    },
    async 'getOneInvoice'(_id) {
        let invoice = Invoices.find({
            _id: _id
        }).fetch()
        if (invoice) {
            invoice = checkInvoice(invoice)
            // console.log(invoice);
            const newInvoice = invoice.map(async function (x) {
                const items = x.items.map(async function (y) {
                    const itemId = y.id.split('-')
                    const item = Items.findOne({
                        _id: itemId[0]
                    })
                    const thisModel = item.models[itemId[1]]
                    if (item.picture) {
                        try {
                            const profilePictureLink = await getFireImage('items/picture', item.picture)
                            item.link = profilePictureLink
                        } catch (error) {
                            console.log(error);
                        }
                    }
                    y.link = item.link
                    y.itemId = itemId[0]
                    return y
                })
                x.items = await Promise.all(items)
                return x
            })
            return await Promise.all(newInvoice)
        }
    },
    async 'getOneItemInvoice'(_id, index) {
        let invoice = Invoices.findOne({
            _id: _id
        })
        if (invoice) {
            invoice = checkInvoice(invoice)
            const item = invoice.items[index]
            if (item) {
                const thisItem = Items.findOne({
                    _id: item.id.split('-')[0]
                })
                if (thisItem && thisItem.picture) {
                    try {
                        const profilePictureLink = await getFireImage('items/picture', thisItem.picture)
                        item.link = profilePictureLink
                    } catch (error) {
                        console.log(error);
                    }
                }
            }
            item.invoiceId = invoice._id
            item.userId = invoice.userId
            item.userUsername = invoice.userUsername
            return item
        }
    },

    'getAllInvoice'(filtering) {
        const thisFilter = {}
        const sort = {}
        if (filtering) {
            if ((+filtering.sort) == 1) {
                sort.createdAt = 1
            } else if ((+filtering.sort) == 2) {
                sort.createdAt = -1
            }
            if (filtering.dateFrom || filtering.dateTo) {
                thisFilter['createdAt'] = {}
                if (filtering.dateFrom) {
                    thisFilter['createdAt']["$gte"] = filtering.dateFrom
                }
                if (filtering.dateTo) {
                    thisFilter['createdAt']["$lte"] = filtering.dateTo
                }
            }
            if (filtering.status && +filtering.status != 0) {
                thisFilter.status = +filtering.status
            }
        }
        let invoices = Invoices.find(thisFilter, {
            sort: sort
        }).fetch();
        invoices = checkInvoice(invoices)
        // console.log(invoices);
        let invoice = invoices.filter(function (x) {
            return x
        }).map(function (y) {
            y.status = syncStatus(y._id)
            return y
        })
        return invoice
    },
    'updateInvoiceStatus'(_id, nextStatus) {
        const invoice = Invoices.findOne({
            _id: _id
        })
        const log = invoice.log
        log.push({
            id: nextStatus,
            timestamp: new Date()
        })
        if (nextStatus == 202) {
            return Invoices.update({
                _id: _id
            }, {
                $set: {
                    log: log,
                    status: nextStatus,
                    resi: '003104187293'
                }
            })
        }
        return Invoices.update({
            _id: _id
        }, {
            $set: {
                log: log,
                status: nextStatus
            }
        })
    },
    'getTransReport'(start, end) {
        let trans = Invoices.find({
            createdAt: {
                $gte: start,
                $lte: end
            },
            status: 269,
        }, {
            sort: {
                createdAt: 1
            }
        }).fetch()
        trans = checkInvoice(trans)
        const res = []
        for (const i of trans) {
            const thisDate = moment(i.createdAt).format("ll")
            const searchRes = res.find((x) => x.label == thisDate)
            if (searchRes) {
                searchRes.data.push(i)
            } else {
                res.push({
                    label: thisDate,
                    data: [i]
                })
            }
        }
        return res
    },
    'getWeeklyIncome'(start, end) {
        let trans = Invoices.find({
            createdAt: {
                $gte: start,
                $lte: end
            },
            status: 269
        }, {
            sort: {
                createdAt: 1
            }
        }).fetch()
        trans = checkInvoice(trans)
        const res = []
        for (const i of trans) {
            const thisDate = moment(i.createdAt).format('dddd');
            const searchRes = res.find((x) => x.label == thisDate)
            if (searchRes) {
                searchRes.total += i.totalPurchase
            } else {
                res.push({
                    label: thisDate,
                    total: i.totalPurchase
                })
            }
        }
        return res
    },
    async 'getMostActiveUser'(start, end, sort, top) {
        let trans = Invoices.find({
            createdAt: {
                $gte: start,
                $lte: end
            },
            status: 269
        }, {
            sort: {
                createdAt: 1
            }
        }).fetch()
        trans = checkInvoice(trans)
        const res = []
        let ctr = 1
        for (const i of trans) {
            const thisDate = moment(i.createdAt).format('dddd');
            const searchRes = res.find((x) => x.label == i.userUsername)
            if (searchRes) {
                searchRes.total += i.totalPurchase
                let totalItems = 0
                for (const j of i.items) {
                    totalItems += j.quantity
                }
                searchRes.totalItems += totalItems
                searchRes.totalTrans += 1
            } else {
                // if(ctr <= top){
                const user = Meteor.users.findOne({
                    _id: i.userId
                });
                if (user && user.profilePicture) {
                    const profilePictureLink = await getFireImage('user/picture', user.profilePicture)
                    user.profilePicture = profilePictureLink
                }
                let totalItems = 0
                for (const j of i.items) {
                    totalItems += j.quantity
                }
                res.push({
                    label: i.userUsername,
                    user,
                    total: i.totalPurchase,
                    totalItems,
                    totalTrans: 1
                })
                // ctr++;

                // }
            }

        }
        return await res.sort(function (a, b) {
            if ((+sort) == 1) {
                return b.total - a.total
            } else if ((+sort) == 2) {
                return a.total - b.total
            } else if ((+sort) == 3) {
                return b.totalItems - a.totalItems
            } else if ((+sort) == 4) {
                return a.totalItems - b.totalItems
            } else if ((+sort) == 5) {
                return b.totalTrans - a.totalTrans
            } else if ((+sort) == 6) {
                return a.totalTrans - b.totalTrans
            }

        }).filter(function (z) {
            return top >= ctr++
        })
    },
    'getInvoiceByToken'(token){
        const invoice = Invoices.findOne({paymentToken: token})
        if(invoice){
            return checkInvoice(invoice)
        }
    }
})