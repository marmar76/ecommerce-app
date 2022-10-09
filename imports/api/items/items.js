import { Meteor } from 'meteor/meteor'; 
import { Mongo } from 'meteor/mongo';
// import { lowerCase } from '../functions/functions';

export const Items = new Mongo.Collection( 'items' );
export const SpecificationComparison = [
    {
        subcategoryId: 'qeRpQANaRTyv3RKBj',
        name: "Graphics Card",
        list: [
            {
                slug: 'graphics-core',
                label: 'Graphics Core',
                type: "number"
            },
            {
                slug: 'boost-clock',
                label: 'Boost Clock',
                type: "number"
            },
            {
                slug: 'base-clock',
                label: 'Base Clock',
                type: "number"
            },
            {
                slug: 'memory-config',
                label: 'Memory Configuration',
                type: "text"
            },
            {
                slug: 'memory-interface',
                label: 'Memory Interface Width',
                type: "text"
            },
            {
                slug: 'ray-tracing-cores',
                label: 'Ray Tracing Cores',
                type: "text"
            },
            {
                slug: 'tensor-cores',
                label: 'Tensor Cores',
                type: "text"
            },
            {
                slug: 'architecture',
                label: 'Architecture',
                type: "text"
            },
            {
                slug: 'max-resolution',
                label: 'Maximum Digital Resolution',
                type: "text"
            },
            {
                slug: 'display-connectors',
                label: 'Display Connectors',
                type: "text"
            },
            {
                slug: 'multi-monitor',
                label: 'Multi Monitor',
                type: "number"
            },
            {
                slug: 'graphics-power',
                label: 'Graphics Card Power (W)',
                type: "text"
            },
            
        ]
    }
]
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