import { Meteor } from 'meteor/meteor'; 
import { Mongo } from 'meteor/mongo';

export const Categories = new Mongo.Collection( 'categories' );

export const SubCategories = new Mongo.Collection('subcategories');