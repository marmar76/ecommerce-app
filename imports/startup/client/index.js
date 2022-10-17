// import 'bootstrap/dist/css/bootstrap.css'

import Swal from 'sweetalert2';
import '../../../imports/ui/stylesheets/global/googleapis.css'
import '../../../imports/ui/stylesheets/global/owl.carousel.min.css'
import '../../../imports/ui/stylesheets/global/bootstrap.min.css'
// import 'jquery'
// import 'select2'

// // import './vendors/feather/feather.css'
// import '../../ui/assets/master/vendors/mdi/css/materialdesignicons.min.css'
// import '../../ui/assets/master/vendors/ti-icons/css/themify-icons.css'
// import '../../ui/assets/master/vendors/typicons/typicons.css'
// // import './vendors/simple-line-icons/css/simple-line-icons.css'
// import '../../ui/assets/master/vendors/css/vendor.bundle.base.css'
// import '../../ui/assets/master/js/select.dataTables.min.css'
// import '../../ui/assets/master/css/vertical-layout-light/style.css'

import './routes.js';

isValidDate = function(d) {
    return d instanceof Date && !isNaN(d);
}

function basicStyle(message, type) {
    let style = {
        html: '<div style="color: white; text-align: left">' + message + '</div>',
        backdrop: false,
        position: 'top-right',
        timer: 2000,
        showConfirmButton: false,
        width: '300px',
        height: '100px',
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
    // Swal.fire({
    //     position: 'top-end',
    //     // icon: 'success',
    //     width: '300px',
    //     heightAuto: true,
    //     backdrop: false,
    //     title: 'Your work has been saved',
    //     showConfirmButton: false,
    //     color: '#716add',
    //     timer: 1500
    // })
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
    // basicStyle(message, 'success')
}
failAlert = function (message) {
    if (typeof message === 'object' && message !== null) {
        message = message.reason;
    }
    Swal.fire(basicStyle(message, 'fail'));
    // basicStyle(message, 'fail')
}
successAlertBack = function (message) {
    if (typeof message === 'undefined') {
        message = 'Berhasil!';
    }
    Swal.fire(basicStyle(message, 'success'));
    // basicStyle(message, 'success')
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
