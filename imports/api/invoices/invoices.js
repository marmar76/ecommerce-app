import { Meteor } from 'meteor/meteor'; 
import { Mongo } from 'meteor/mongo';
// import { lowerCase } from '../functions/functions';

export const Invoices = new Mongo.Collection( 'invoices' );