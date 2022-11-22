import { Meteor } from 'meteor/meteor'; 
import { Mongo } from 'meteor/mongo';

export const Reviews = new Mongo.Collection( 'reviews' );