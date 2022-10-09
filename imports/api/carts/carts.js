import { Meteor } from 'meteor/meteor'; 
import { Mongo } from 'meteor/mongo';
// import { lowerCase } from '../functions/functions';

export const Carts = new Mongo.Collection( 'carts' );