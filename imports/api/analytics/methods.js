import {
    Meteor
} from 'meteor/meteor';
import {
    fetch,
    Headers
} from 'meteor/fetch';

Meteor.methods({
    async 'getPageUrl'() {
        try {
            const pageurl = await fetch(`http://localhost:6969/api/fullpageurl`, {
                method: 'GET', // *GET, POST, PUT, DELETE, etc.
                // mode: 'cors', // no-cors, *cors, same-origin
                // cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                // credentials: 'same-origin', // include, *same-origin, omit
                // headers: new Headers({
                //     key: settings.RAJAONGKIR_KEY,
                //     'Content-Type': 'application/json'
                // }),
                // // redirect: 'follow', // manual, *follow, error
                // // referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
                // body: JSON.stringify({
                //     origin: origin,
                //     destination,
                //     weight,
                //     courier: x.name
                // }) // body data type must match "Content-Type" header
            });
            const result = await pageurl.json()
            return result
            // console.log(result);
        } catch (error) {
            throw new Meteor.Error('express-error', 'express error')
        }
    }
})