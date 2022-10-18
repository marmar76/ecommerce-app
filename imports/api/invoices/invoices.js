import { Meteor } from 'meteor/meteor'; 
import { Mongo } from 'meteor/mongo';
// import { lowerCase } from '../functions/functions';

export const WebSettings = new Mongo.Collection( 'webSettings' );