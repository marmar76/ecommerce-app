import { Meteor } from 'meteor/meteor'; 
import { Mongo } from 'meteor/mongo';
// import { lowerCase } from '../functions/functions';

export const Invoices = new Mongo.Collection( 'invoices' );

const StatusTransaction = [
    {
        id: 1,
        name: "Pending Payment",
        desc: "Checkout has been confirmed, payment still pending"
    },
    {
        id: 200,
        name: "Payment Success",
        desc: "Checkout have been confirmed, paid already"
    },
    {
        id: 201,
        name: "Order Confirmed",
        desc: "Order is confirmed, processing ur order"
    },
    {
        id: 202,
        name: "Package sent",
        desc: "The order is handed over to the courier"
    },    
    {
        id: 203,
        name: "Package Received",
        desc: ""
    },
    {
        id: 269,
        name: "Order Finished",
        desc: ""
    },
    {
        id: 400,
        name: "Order Canceled",
        desc: ""
    },

    // {
    //     id: 201,
    //     name: "Order being process",
    //     desc: "Order is being processed at our warehouse"
    // },
]