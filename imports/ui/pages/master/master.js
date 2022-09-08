import {
  Meteor
} from 'meteor/meteor';
import {
  Template
} from 'meteor/templating';
import {
  FlowRouter
} from 'meteor/ostrio:flow-router-extra';
import './master.html';

// import './vendors/feather/feather.css'
import '../../assets/master/vendors/mdi/css/materialdesignicons.min.css'
import '../../assets/master/vendors/ti-icons/css/themify-icons.css'
import '../../assets/master/vendors/typicons/typicons.css'
// import './vendors/simple-line-icons/css/simple-line-icons.css'
import '../../assets/master/vendors/css/vendor.bundle.base.css'
import '../../assets/master/js/select.dataTables.min.css'
import '../../assets/master/css/vertical-layout-light/style.css'

import '../../assets/master/vendors/js/vendor.bundle.base.js'
import '../../assets/master/vendors/chart.js/Chart.min.js'
import '../../assets/master/vendors/bootstrap-datepicker/bootstrap-datepicker.min.js'
import '../../assets/master/js/off-canvas.js'
import '../../assets/master/js/hoverable-collapse.js'
// import './js/settings.js'
import '../../assets/master/js/todolist.js'
import '../../assets/master/js/jquery.cookie.js'
import '../../assets/master/js/Chart.roundedBarCharts.js'
// import './js/template.js'
import '../../assets/master/js/dashboard.js'


function autoText(e) {
  var $field = $(e.currentTarget).closest('.form-group');
  if (e.currentTarget.value) {
    $field.addClass('field--not-empty');
  } else {
    $field.removeClass('field--not-empty');
  }
}

function toggleBanner(show) {  
  if(show){
    $('#proBanner').removeClass('d-none');
    $('#proBanner').addClass('d-flex');
    $('.navbar').addClass('pt-5');
    $('.navbar').removeClass('fixed-top');
    $('.page-body-wrapper').removeClass('proBanner-padding-top');
    $('.navbar').addClass('mt-3');
  }
  else{
    $('#proBanner').addClass('d-none');
    $('#proBanner').removeClass('d-flex');
    $('.navbar').removeClass('pt-5');
    $('.navbar').addClass('fixed-top');
    $('.page-body-wrapper').addClass('proBanner-padding-top');
    $('.navbar').removeClass('mt-3');
  }
}

function initPage() {  
  var body = $('body');
  var contentWrapper = $('.content-wrapper');
  var scroller = $('.container-scroller');
  var footer = $('.footer');
  var sidebar = $('.sidebar');

  //Add active class to nav-link based on url dynamically
  //Active class can be hard coded directly in html file also as required

  // function addActiveClass(element) {
  //   if (element) {
  //     //for root url
  //     if (element.attr('href').indexOf("index.html") !== -1) {
  //       element.parents('.nav-item').last().addClass('active');
  //       if (element.parents('.sub-menu').length) {
  //         element.closest('.collapse').addClass('show');
  //         element.addClass('active');
  //       }
  //     }
  //   } else {
  //     //for other url
  //     if (element.attr('href').indexOf(current) !== -1) {
  //       element.parents('.nav-item').last().addClass('active');
  //       if (element.parents('.sub-menu').length) {
  //         element.closest('.collapse').addClass('show');
  //         element.addClass('active');
  //       }
  //       if (element.parents('.submenu-item').length) {
  //         element.addClass('active');
  //       }
  //     }
  //   }
  // }
  function activate(elem) {  
    elem.parents('.nav-item').last().addClass('active');
    if (elem.parents('.sub-menu').length) {
      elem.closest('.collapse').addClass('show');
      elem.addClass('active');
    }
  }
  function disable(elem) {  
    elem.parents('.nav-item').last().removeClass('active');
    if (elem.parents('.sub-menu').length) {
      elem.closest('.collapse').removeClass('show');
      elem.removeClass('active');
    }
  }
  // const currentRoute = FlowRouter.current()
  var current = FlowRouter.current().path.split('/')//.split("/").slice(-1)[0].replace(/^\/|\/$/g, '');
  current.splice(0, 1)
  console.log(current);
  $('.nav li a', sidebar).each(function () {
    var $this = $(this);
    const $thisArray = $this[0].href.split('/')
    $thisArray.splice(0, 3)
    // console.log($thisArray);
    // console.log($this[0].pathname, $this[0].pathname == current);
    // console.log($thisArray == current);
    if(JSON.stringify($thisArray) == JSON.stringify(current)){
      activate($this)
    }
    else{
      disable($this)
    }
    // addActiveClass($this, $this[0].pathname == current);
  })

  // $('.horizontal-menu .nav li a').each(function () {
  //   var $this = $(this);
  //   addActiveClass($this);
  // })

  //Close other submenu in sidebar on opening any

  sidebar.on('show.bs.collapse', '.collapse', function () {
    sidebar.find('.collapse.show').collapse('hide');
  });


  //Change sidebar and content-wrapper height
  applyStyles();

  function applyStyles() {
    //Applying perfect scrollbar
    if (!body.hasClass("rtl")) {
      if ($('.settings-panel .tab-content .tab-pane.scroll-wrapper').length) {
        const settingsPanelScroll = new PerfectScrollbar('.settings-panel .tab-content .tab-pane.scroll-wrapper');
      }
      if ($('.chats').length) {
        const chatsScroll = new PerfectScrollbar('.chats');
      }
      if (body.hasClass("sidebar-fixed")) {
        if ($('#sidebar').length) {
          var fixedSidebarScroll = new PerfectScrollbar('#sidebar .nav');
        }
      }
    }
  }

  $('[data-bs-toggle="minimize"]').on("click", function () {
    if ((body.hasClass('sidebar-toggle-display')) || (body.hasClass('sidebar-absolute'))) {
      body.toggleClass('sidebar-hidden');
    } else {
      body.toggleClass('sidebar-icon-only');
    }
  });

  //checkbox and radios
  $(".form-check label,.form-radio label").append('<i class="input-helper"></i>');

  //Horizontal menu in mobile
  $('[data-toggle="horizontal-menu-toggle"]').on("click", function () {
    $(".horizontal-menu .bottom-navbar").toggleClass("header-toggled");
  });
  // Horizontal menu navigation in mobile menu on click
  var navItemClicked = $('.horizontal-menu .page-navigation >.nav-item');
  navItemClicked.on("click", function (event) {
    if (window.matchMedia('(max-width: 991px)').matches) {
      if (!($(this).hasClass('show-submenu'))) {
        navItemClicked.removeClass('show-submenu');
      }
      $(this).toggleClass('show-submenu');
    }
  })

  $(window).scroll(function () {
    if (window.matchMedia('(min-width: 992px)').matches) {
      var header = $('.horizontal-menu');
      if ($(window).scrollTop() >= 70) {
        $(header).addClass('fixed-on-scroll');
      } else {
        $(header).removeClass('fixed-on-scroll');
      }
    }
  });
  if ($.cookie('staradmin2-free-banner') != "true" && false) {
    document.querySelector('#proBanner').classList.add('d-flex');
    document.querySelector('.navbar').classList.remove('fixed-top');
  } else {
    document.querySelector('#proBanner').classList.add('d-none');
    document.querySelector('.navbar').classList.add('fixed-top');
  }

  if ($(".navbar").hasClass("fixed-top")) {
    document.querySelector('.page-body-wrapper').classList.remove('pt-0');
    document.querySelector('.navbar').classList.remove('pt-5');
  } else {
    document.querySelector('.page-body-wrapper').classList.add('pt-0');
    document.querySelector('.navbar').classList.add('pt-5');
    document.querySelector('.navbar').classList.add('mt-3');

  }
  
  // $('#navbar-search-icon').click(function () {
  //   $("#navbar-search-input").focus();
  // });
}

Template.masterContainer.onCreated(function () {
})
Template.masterContainer.onRendered(function () {
});
Template.masterContainer.events({
});

Template.contentExample.onCreated(function () {
  document.title = "Mastah Example"
  // console.log(FlowRouter.current());
})
Template.contentExample.onRendered(function () {
  initPage()
});
// focus input when clicking on search icon


Template.contentExample.events({
  'click #bannerClose'(e, t){
    toggleBanner(false)
    // var date = new Date();
    // date.setTime(date.getTime() + 24 * 60 * 60 * 1000);
    // $.cookie('staradmin2-free-banner', "true", {
    //   expires: date
    // });
  },
  'click #test'(e, t){
    console.log("click");
    // toggleBanner(true)
  }
});

Template.usersHome.onCreated(function () {  
  document.title = "Mastah User"
})

Template.usersHome.onRendered(function () {  
  initPage()
})