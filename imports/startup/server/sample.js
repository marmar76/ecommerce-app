
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { TasksCollection } from '../../api/tasks/tasks.js';
import { Provinces, Regencies } from '../../api/data/regencies.js';
import axios, { Axios } from 'axios';
// import '/imports/api/tasksMethods';
// import '/imports/api/tasksPublications';
function similarity(s1, s2) {
  var longer = s1;
  var shorter = s2;
  if (s1.length < s2.length) {
    longer = s2;
    shorter = s1;
  }
  var longerLength = longer.length;
  if (longerLength == 0) {
    return 1.0;
  }
  return (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength);
}

function editDistance(s1, s2) {
  s1 = s1.toLowerCase();
  s2 = s2.toLowerCase();

  var costs = new Array();
  for (var i = 0; i <= s1.length; i++) {
    var lastValue = i;
    for (var j = 0; j <= s2.length; j++) {
      if (i == 0)
        costs[j] = j;
      else {
        if (j > 0) {
          var newValue = costs[j - 1];
          if (s1.charAt(i - 1) != s2.charAt(j - 1))
            newValue = Math.min(Math.min(newValue, lastValue),
              costs[j]) + 1;
          costs[j - 1] = lastValue;
          lastValue = newValue;
        }
      }
    }
    if (i > 0)
      costs[s2.length] = lastValue;
  }
  return costs[s2.length];
}
const insertTask = (taskText, user) =>
  TasksCollection.insert({
    text: taskText,
    userId: user._id,
    createdAt: new Date(),
  });

const SEED_USERNAME = 'admin';
const SEED_PASSWORD = 'takina';

Meteor.startup(async () => {
  if (!Accounts.findUserByUsername(SEED_USERNAME)) {
    const userId = Accounts.createUser({
      username: SEED_USERNAME,
      password: SEED_PASSWORD,
    });
    Meteor.users.update({
      _id: userId
    }, {
      $set: {isAdmin: true}
    })
  }

  const user = Accounts.findUserByUsername(SEED_USERNAME);
  // https://stackoverflow.com/questions/10473745/compare-strings-javascript-return-of-likely
  // Levenshtein distance
  function similarity(s1, s2) {
    var longer = s1;
    var shorter = s2;
    if (s1.length < s2.length) {
      longer = s2;
      shorter = s1;
    }
    var longerLength = longer.length;
    if (longerLength == 0) {
      return 1.0;
    }
    return (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength);
  }
  
  function editDistance(s1, s2) {
    s1 = s1.toLowerCase();
    s2 = s2.toLowerCase();
  
    var costs = new Array();
    for (var i = 0; i <= s1.length; i++) {
      var lastValue = i;
      for (var j = 0; j <= s2.length; j++) {
        if (i == 0)
          costs[j] = j;
        else {
          if (j > 0) {
            var newValue = costs[j - 1];
            if (s1.charAt(i - 1) != s2.charAt(j - 1))
              newValue = Math.min(Math.min(newValue, lastValue),
                costs[j]) + 1;
            costs[j - 1] = lastValue;
            lastValue = newValue;
          }
        }
      }
      if (i > 0)
        costs[s2.length] = lastValue;
    }
    return costs[s2.length];
  }
  if (TasksCollection.find().count() === 0) {
    [
      'First Task',
      'Second Task',
      'Third Task',
      'Fourth Task',
      'Fifth Task',
      'Sixth Task',
      'Seventh Task',
    ].forEach(taskText => insertTask(taskText, user));
  }
  if(Provinces.find().count() !== 0 && false){
    const rajaongkirprovince = await axios({
      method: 'get',
      url: 'https://api.rajaongkir.com/starter/province',
      headers: {
        key: '5e035ae0baa0263978434f70f3357691'
      }
    })
    const results = rajaongkirprovince.data.rajaongkir.results
    // console.log(results);
    const provinces = Provinces.find().fetch().map(function (x) {
      let theResult = undefined
      let similarityValue = 0  
      const rajaongkirProvince = results.find(function (y) {  
        let thisX = x.name.toLowerCase()
        let thisY = y.province.toLowerCase()
        let isSimiliar = similarity(thisX, thisY)
        if(isSimiliar > similarityValue){
          theResult = y
          similarityValue = isSimiliar
        }
        // console.log(thisX.replace(' ', '') +'=='+ thisY.replace(' ', ''));
        return thisX.replace(' ', '') == thisY.replace(' ', '')
      })
      if(rajaongkirProvince){
        x.province_id = rajaongkirProvince.province_id
        x.name = rajaongkirProvince.province
        Provinces.update({_id: x._id}, {$set: x})
      }
      else if(theResult){
        x.province_id = theResult.province_id
        x.name = theResult.province
        Provinces.update({_id: x._id}, {$set: x})
      }
      else{
        console.log(x.name)
      }
    })
  //   const { SeedRegencies } = require('../../../db_seeder/regencies.js');
  //   for (const i of SeedRegencies) {
  //     Regencies.insert(i)
  //   }
  }
  if(Regencies.find().count() !== 0 && false){
    const rajaongkirprovince = await axios({
      method: 'get',
      url: 'https://api.rajaongkir.com/starter/city',
      headers: {
        key: '5e035ae0baa0263978434f70f3357691'
      }
    })
    const results = rajaongkirprovince.data.rajaongkir.results
    // console.log(results);
    const regencies = Regencies.find().fetch().map(function (x) {
      let theResult = undefined
      let similarityValue = 0  
      const rajaongkirProvince = results.find(function (y) {  
        let thisX = x.name.toLowerCase()
        let thisY = y.city_name.toLowerCase()
        let isSimiliar = similarity(thisX, thisY)
        if(isSimiliar > similarityValue){
          theResult = y
          similarityValue = isSimiliar
        }
        // console.log(thisX.replace(' ', '') +'=='+ thisY.replace(' ', ''));
        return thisX.replace(' ', '') == thisY.replace(' ', '')
      })
      if(rajaongkirProvince){
        x.city_id = rajaongkirProvince.city_id
        x.name = rajaongkirProvince.type + " " + rajaongkirProvince.city_name
        Regencies.update({_id: x._id}, {$set: x})
      }
      else if(theResult){
        x.city_id = theResult.city_id
        x.name = theResult.type + " " + theResult.city_name
        Regencies.update({_id: x._id}, {$set: x})
      }
      else{
        console.log(x.name);
      }
    })
  //   const { SeedRegencies } = require('../../../db_seeder/regencies.js');
  //   for (const i of SeedRegencies) {
  //     Regencies.insert(i)
  //   }
  }
});
