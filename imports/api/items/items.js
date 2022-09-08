import { Meteor } from 'meteor/meteor'; 
import { Mongo } from 'meteor/mongo';
// import { lowerCase } from '../functions/functions';

export const Items = new Mongo.Collection( 'items' );

// TypeSchema = new SimpleSchema({
//     "name": {
//       type: String,
//       autoValue: lowerCase()
//     },
// 	"price": {
//       type: Number
//     },
//     "description": {
//         type: String,
//         autoValue: lowerCase()
//       },
//     "status": {
//       type: Boolean,
//       defaultValue: true
//     },
//     "createdAt": {
//       type: Date,  
//       defaultValue: new Date()
//     },
//     "createdBy": {
//       type: String,
//       autoValue: function() {
//         return Meteor.userId()
//       }
//     },
// });

// Items.attachSchema( TypeSchema );