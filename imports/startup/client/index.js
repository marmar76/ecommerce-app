// import 'bootstrap/dist/css/bootstrap.css'

import Swal from 'sweetalert2';

import '../../../imports/ui/stylesheets/global/googleapis.css'
import '../../../imports/ui/stylesheets/global/owl.carousel.min.css'
import '../../../imports/ui/stylesheets/global/bootstrap.min.css'
import './routes.js';


function basicStyle(message, type) {
    let style = {
        html: '<div style="color: white; text-align: left">' + message + '</div>',
        backdrop: false,
        position: 'top-right',
        timer: 2000,
        showConfirmButton: false,
        width: '300px',
        customClass: {
            header: 'align-items-unset padding-0',
            content: 'align-items-unset padding-0',
        },
        allowOutsideClick: false,
    };
    if (type == "success") {
        style.background = '#087830'
        style.title = '<div style="color: white">Success</div>'
    } else if (type == "fail") {
        style.background = '#ce2029'
        style.title = '<div style="color: white">Error</div>'
    }
    return style;
}

checkValid = function (data) {
    switch (data) {
        case '':
            return false
        case 'null':
            return false
        case null:
            return false
        case undefined:
            return false
        default:
            return true
    }
}
successAlert = function (message) {
    if (typeof message === 'undefined') {
        message = 'Berhasil!';
    }
    Swal.fire(basicStyle(message, 'success'));
}
failAlert = function (message) {
    if (typeof message === 'object' && message !== null) {
        message = message.reason;
    }
    Swal.fire(basicStyle(message, 'fail'));
}
successAlertBack = function (message) {
    if (typeof message === 'undefined') {
        message = 'Berhasil!';
    }
    Swal.fire(basicStyle(message, 'success'));
    history.back();
}


initSelect2 = function (options) {
    setTimeout(() => {
        if (!options) {
            options = {}
        }
        let {
            elementOptions,
            id,
            value,
            selector
        } = options
        if (!selector) {
            selector = '.select2'
        }
        $(selector).select2(elementOptions);
        if (checkValid(id) && checkValid(value)) {
            $('#' + id).val(value).trigger('change')
        }
    }, 200)
}
