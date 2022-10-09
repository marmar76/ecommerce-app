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
import './users.html';
import './items.html';
import './promotions.html';
import './subCategories.html';
import './categories.html';

// import '../../assets/master/vendors/feather/feather.css'
import '../../assets/master/vendors/mdi/css/materialdesignicons.min.css'
import '../../assets/master/vendors/ti-icons/css/themify-icons.css'
import '../../assets/master/vendors/typicons/typicons.css'
// import '../../assets/master/vendors/simple-line-icons/css/simple-line-icons.css'
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
import moment from 'moment';
import Swal from 'sweetalert2';
import {
  SpecificationComparison
} from '../../../api/items/items';
const navbar = [{
    type: 1,
    href: '/master',
    icon: 'mdi mdi-grid-large menu-icon',
    title: 'Dashboard',
  },
  {
    type: 0,
    title: 'User Management'
  },
  {
    type: 2,
    title: 'User',
    icon: 'menu-icon mdi mdi-account',
    href: 'master-users',
    child: [{
        href: '/master-users',
        title: 'List User'
      },
      {
        href: '/master-users-create',
        title: 'Create User'
      },
      // {
      //     href: 'pages/ui-features/typography.html',
      //     title: 'Berhasil'
      // },
    ]
  },
  {
    type: 2,
    title: 'Item',
    icon: 'menu-icon mdi mdi-account',
    href: 'master-items',
    child: [{
        href: '/master-items',
        title: 'List Item'
      },
      {
        href: '/master-items-create',
        title: 'Create Item'
      }
    ]
  },
  {
    type: 2,
    title: 'Category',
    icon: 'menu-icon mdi mdi-account',
    href: 'master-categories',
    child: [{
        href: '/master-categories',
        title: 'List categories'
      },
      {
        href: '/master-categories-create',
        title: 'Create categories'
      },
      {
        href: '/master-subcategories-create',
        title: 'Create sub-categories'
      },
    ]
  },
  {
    type: 2,
    title: 'Promotion',
    icon: 'menu-icon mdi mdi-account',
    href: 'master-promotions',
    child: [{
        href: '/master-promotions',
        title: 'List Promotion'
      },
      {
        href: '/master-promotions-create',
        title: 'Create Promotion'
      }
    ]
  },
]

function autoText(e) {
  var $field = $(e.currentTarget).closest('.form-group');
  if (e.currentTarget.value) {
    $field.addClass('field--not-empty');
  } else {
    $field.removeClass('field--not-empty');
  }
}

function toggleBanner(show) {
  if (show) {
    $('#proBanner').removeClass('d-none');
    $('#proBanner').addClass('d-flex');
    $('.navbar').addClass('pt-5');
    $('.navbar').removeClass('fixed-top');
    $('.page-body-wrapper').removeClass('proBanner-padding-top');
    $('.navbar').addClass('mt-3');
  } else {
    $('#proBanner').addClass('d-none');
    $('#proBanner').removeClass('d-flex');
    $('.navbar').removeClass('pt-5');
    $('.navbar').addClass('fixed-top');
    $('.page-body-wrapper').addClass('proBanner-padding-top');
    $('.navbar').removeClass('mt-3');
  }
}

function initNav(param) {
  $(".nav-item").each(function () {
    $(this).removeClass("active");
  })
  const elem = $("#" + param)
  elem.addClass("active");
  // console.log(elem.('.sub-menu').length);
  if (elem.children('.sub-menu').length) {
    elem.closest('.collapse').addClass('show');
    elem.addClass('active');
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
  var current = FlowRouter.current().path.split('/') //.split("/").slice(-1)[0].replace(/^\/|\/$/g, '');
  current.splice(0, 1)
  // console.log(current);
  // $('.nav li a', sidebar).each(function () {
  //   var $this = $(this);
  //   let $thisArray = []
  //   if($this[0].href.includes('#') || true){
  //     $thisArray = $this[0].href.split('#')[1]
  //     console.log($thisArray == current[0], 'his');
  //     if($thisArray == current[0]){
  //       activate($this)
  //     }
  //   } 
  //   else{
  //     $thisArray = $this[0].href.split('/')
  //     $thisArray.splice(0, 3)
  //     if(JSON.stringify($thisArray) == JSON.stringify(current)){
  //       activate($this)
  //     }
  //     else{
  //       disable($this)
  //     }

  //   }
  // console.log($this[0].href);
  // console.log($thisArray);
  // console.log($this[0].pathname, $this[0].pathname == current);
  // console.log($thisArray == current);
  // addActiveClass($this, $this[0].pathname == current);
  // })

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

Template.navbarTop.onCreated(function () {
  const self = this;

  function greetings() {
    var currentHour = +moment().format("HH");
    // console.log(currentHour);
    // https://stackoverflow.com/questions/62079752/using-moment-js-to-determine-if-current-time-in-hour-is-between-certain-hours
    if (currentHour >= 3 && currentHour < 12) {
      return "Good Morning";
    } else if (currentHour >= 12 && currentHour < 15) {
      return "Good Afternoon";
    } else if (currentHour >= 15 && currentHour < 20) {
      return "Good Evening";
    } else if (currentHour >= 20 || currentHour < 3) {
      return "Good Night";
    } else {
      return "Hello"
    }

  }
  self.greetings = new ReactiveVar(greetings())
  self.timeNow = new ReactiveVar(moment().locale('en').format('MMMM Do YYYY, h:mm:ss A'))
  setInterval(() => {
    self.greetings.set(greetings())
  }, 3600000);
  setInterval(() => {
    if (screen.width < 990) {
      self.timeNow.set(moment().format("MMM Do YYYY"))
    } else {
      self.timeNow.set(moment().locale('en').format('MMMM Do YYYY, h:mm:ss A'))
    }
  }, 500);
})
Template.navbarTop.helpers({
  greetings() {
    return Template.instance().greetings.get()
  },
  thisUser() {
    const thisUser = Meteor.user()
    // console.log(thisUser);
    return thisUser
  },
  timeNow() {
    return Template.instance().timeNow.get()
  }
});

Template.navbarTop.events({
  'click .sign-out'(e, t) {
    Swal.fire({
      title: 'Do you want to logout now?',
      icon: 'warning',
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: 'Yes',
      denyButtonText: `No`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        // Swal.fire('Saved!', '', 'success')
        Meteor.logout();
        setTimeout(() => {
          FlowRouter.go('/login')
        }, 200);
      } else if (result.isDenied) {
        // Swal.fire('Changes are not saved', '', 'info')
      }
    })
  }
});


Template.navbarLeft.onCreated(function () {})
Template.navbarLeft.onRendered(function () {
  const route = FlowRouter.current()
});
Template.navbarLeft.helpers({
  navbar() {
    const route = FlowRouter.current().path
    const thisNavbar = navbar.map(function (x) {
      if (x.type == 2) {
        let valid = false
        for (const i of x.child) {
          if (i.href == route) {
            i.active = true
            valid = true
          } else {
            i.active = false
          }
        }
        x.active = valid
      } else if (x.type == 1) {
        x.active = x.href == route
      }
      return x
    })
    // console.log(thisNavbar);
    return thisNavbar
  },
  equals(a, b) {
    return a == b
  }
});

Template.navbarLeft.events({});
Template.masterContainer.onCreated(function () {})
Template.masterContainer.onRendered(function () {
  toggleBanner(false)
});
Template.masterContainer.helpers({});
Template.masterContainer.events({
  'click #bannerClose'(e, t) {
    toggleBanner(false)
    // var date = new Date();
    // date.setTime(date.getTime() + 24 * 60 * 60 * 1000);
    // $.cookie('staradmin2-free-banner', "true", {
    //   expires: date
    // });
  },
});

Template.contentExample.onCreated(function () {
  document.title = "Mastah Example"
  // console.log(FlowRouter.current());
})
Template.contentExample.onRendered(function () {
  // initNav("nav-dashboard");
  initPage()

});
Template.contentExample.helpers({
  navmain(nav) {
    return nav == "master"
  }
});
// focus input when clicking on search icon


Template.contentExample.events({
  'click #test'(e, t) {
    console.log("click");
    // toggleBanner(true)
  }
});

//===============================================
//                    USER
//===============================================
Template.usersHome.onCreated(function () {
  document.title = "Mastah User"
  Meteor.subscribe('users.all', function () {
    console.log("Subscribe Users");
  })
  this.filtering = new ReactiveVar({
    search: '',
    sort: '1',
    status: true
  })
})

Template.usersHome.onRendered(function () {
  // initNav("master-users-nav");
  // initPage()

})
Template.usersHome.helpers({
  users() {
    const filtering = Template.instance().filtering.get()
    const $or = [{
        name: {
          $regex: filtering.search.toLowerCase(),
          $options: 'i'
        }
      },
      {
        username: {
          $regex: filtering.search.toLowerCase(),
          $options: 'i'
        }
      },
      // {
      //   email: {$regex: filtering.search.toLowerCase(), $options: 'i'}
      // }
    ]
    const sort = function () {
      const thisSort = filtering.sort
      if (thisSort == 1) {
        return {
          name: 1
        }
      } else if (thisSort == 2) {
        return {
          name: -1
        }
      } else if (thisSort == 3) {
        return {
          createdAt: 1
        }
      } else if (thisSort == 4) {
        return {
          createdAt: -1
        }
      }
    }
    // console.log(sort);
    const users = Meteor.users.find({
      status: filtering.status,
      $or
    }, {
      sort: sort()
    }).fetch()
    // console.log(users);
    return users.map(function (x) {
      if (x.emails && x.emails.length != 0) {
        x.emails = x.emails[0].address
      }
      return x
    })
  }

})
Template.usersHome.events({
  'change .filtering'(e, t) {
    const search = $('#search').val();
    const sort = $('#sort').val();
    const status = $('#is-active').is(':checked');
    // console.log({
    //   search,
    //   sort,
    //   status
    // });
    t.filtering.set({
      search,
      sort,
      status
    })
  },
  'input .filtering'(e, t) {
    const search = $('#search').val();
    const sort = $('#sort').val();
    const status = $('#is-active').is(':checked');
    // console.log({
    //   search,
    //   sort,
    //   status
    // });
    t.filtering.set({
      search,
      sort,
      status
    })
  },

})


Template.userCreatePage.onCreated(function () {

})


Template.userCreatePage.events({
  'click #submit'(e, t) {
    const user_username = $(username).val();
    const user_email = $(email).val();
    const user_password = $(password).val();
    const user_name = $(nameuser).val();
    const user_address = $(address).val();
    const user_gender = $('input[name="gender"]:checked').val();
    const user_dob = new Date($(dob).val());
    // console.log(user_gender);
    if (!user_username || !user_email || !user_password || !user_name || !user_address || !user_gender || !isValidDate(user_dob)) {
      failAlert("Please fill the blank")
    } else {
      const profile = {
        name: user_name,
        address: user_address,
        gender: user_gender,
        dob: user_dob
      };
      const data = {
        username: user_username,
        email: user_email,
        password: user_password
      };
      // console.log(profile);
      // console.log(data);
      Meteor.call('registerAdmin', data, profile, function (err, res) {
        if (err) {
          failAlert(err);
        } else {
          successAlertBack();
        }
      });
    }
  }
});

Template.userDetailPage.onCreated(function () {
  const self = this;
  this.user = new ReactiveVar();
  const paramId = FlowRouter.current().params._id
  Meteor.call('getOneUser', paramId, function (err, res) {
    self.user.set(res);
  })
})

Template.userDetailPage.helpers({
  user() {
    const user = Template.instance().user.get();
    if (user) {
      return user;
    }
  },
  equals(a, b) {
    return a == b;
  }
})

Template.userDetailPage.events({
  'click #banned'(e, t) {
    const param = FlowRouter.current().params._id;
    Meteor.call('bannedUser', param, function (err, res) {
      if (err) {
        failAlert(err);
      } else {
        successAlertBack();
      }
    });
  }
})

//===============================================
//                    ITEM
//===============================================
//ini codingan untuk client side
// Template.itemsHome.onCreated(function () {  
//   const self=this;
//   this.item = new ReactiveVar();
//   this.category = new ReactiveVar();
//   this.subcategory = new ReactiveVar(); 
//   this.now = new ReactiveVar(1);
//   Meteor.call('getAllCategory', function (err,res) {
//     self.category.set(res);
//     console.log(res);
// });
// })

// Template.itemsHome.helpers({
//   categories(){
//     return Template.instance().category.get();
//   },
//   now(){
//     return Template.instance().now.get();
//   },
//   subcategories(){ 
//     const category = Template.instance().category.get();
//     if(category){
//       const now = +Template.instance().now.get();
//       console.log(category[now].subcategory);
//       return category[now].subcategory
//     }
//     return [];
//   }
// })
// Template.itemsHome.events({
//   'click .tes'(e,t){
//     const click = $(e.target).val();
//     t.now.set(click)

//   }
// });

Template.itemsHome.onCreated(function () {
  const self = this;
  self.filtering = new ReactiveVar({
    filter: '',
    sort: 1,
  })
  this.item = new ReactiveVar();
  this.category = new ReactiveVar();
  this.subcategory = new ReactiveVar();
  this.now = new ReactiveVar(-1);
  Meteor.call('getAllCategory', function (err, res) {
    self.category.set(res.filter(function (x) {
      return x.subcategory.length != 0
    }));
  });
  Meteor.call('getAllSubCategory', function (err, res) {
    self.subcategory.set(res);
  });
  Meteor.call('getAllItem', self.filtering.get(), function (err, res) {
    self.item.set(res);
  })

});

Template.itemsHome.onRendered(function () {
  const click = $('.selectedCategory').val();
  console.log(click);
  Template.instance().now.set(click)

});

Template.itemsHome.helpers({
  categories() {
    const category = Template.instance().category.get();
    if (category) {
      for (let i = 0; i < category.length; i++) {
        if (category[i].subcategory.length < 1) {
          category.splice(i, 1);
        }
      }
      // console.log(category);
      return category;
    }
  },
  now() {
    return Template.instance().now.get();
  },
  subcategories() {
    const now = +Template.instance().now.get();
    if (now == -1) return []
    const category = Template.instance().category.get();
    if (category) {
      return category[now].subcategory
    }
    return [];
  },
  items() {
    const items = Template.instance().item.get();
    if (items) {
      return items;
    }
  }
})
Template.itemsHome.events({
  'change .selectedCategory'(e, t) {
    const click = $(e.target).val();
    // console.log(click);
    t.now.set(click)
  },
  'change .filtering'(e, t) {
    const filter = $('#filter').val();
    const category = Template.instance().category.get();
    // const sort = $('#sort').val();
    const categoryIndex = $('#filtercategory').val();
    console.log(categoryIndex);
    const filtersubcategory = $('#filtersubcategory').val();
    let filtercategory;
    for (let i = 0; i < category.length; i++) {
      if (i == categoryIndex) {
        filtercategory = category[i]._id;
      }
    }
    console.log(filtercategory);
    console.log(filtersubcategory);
    t.filtering.set({
      filter,
      filtercategory,
      filtersubcategory
    })
    Meteor.call('getAllItem', {
      filter,
      filtercategory,
      filtersubcategory
    }, function (err, res) {
      t.item.set(res);
    })
  },
  'input .filtering'(e, t) {
    const filter = $('#filter').val();
    // const sort = $('#sort').val();
    const filtercategory = $('#filtercategory').val();
    const filtersubcategory = $('#filtersubcategory').val();
    t.filtering.set({
      filter,
      filtercategory,
      filtersubcategory
    })
    Meteor.call('getAllItem', {
      filter,
      filtercategory,
      filtersubcategory
    }, function (err, res) {
      t.item.set(res);
    })
  },
});

Template.itemsCreatePage.onCreated(function () {
  const self = this;
  this.category = new ReactiveVar();
  this.subcategory = new ReactiveVar();
  this.now = new ReactiveVar(1);
  this.models = new ReactiveVar([{
    id: 0,
    status: true
  }])
  this.comparison = new ReactiveVar(false)
  Meteor.call('getAllCategory', function (err, res) {
    self.category.set(res);
  });
  Meteor.call('getAllSubCategory', function (err, res) {
    self.subcategory.set(res);
    console.log(res);
  });
})
Template.itemsCreatePage.onRendered(function () {
  // setTimeout(() => {
  //   const click = $('.selectedCategory').val();
  //   console.log(click);
  //   Template.instance().now.set(click)

  // }, 400);

});

Template.itemsCreatePage.helpers({
  comparison() {
    return Template.instance().comparison.get()
  },
  models() {
    return Template.instance().models.get()
  },
  categories() {
    const category = Template.instance().category.get();
    if (category) {
      for (let i = 0; i < category.length; i++) {
        if (category[i].subcategory.length < 1) {
          category.splice(i, 1);
        }
      }
      // console.log(category);
      return category;
    }
  },
  now() {
    return Template.instance().now.get();
  },
  subcategories() {
    const category = Template.instance().category.get();
    if (category) {
      const now = Template.instance().now.get();
      // console.log(category[now].subcategory);
      const thisCategory = category.find((x) => x._id == now)
      if (thisCategory)
        return thisCategory.subcategory
      return null
    }
    return [];
  },
})

Template.itemsCreatePage.events({
  'click #submit'(e, t) {
    const models = t.models.get()
    const canCompare = t.comparison.get()
    const name = $("#itemsName").val();
    const category = $("#categories").val();
    const subcategory = $("#subcategories").val();
    const weight = $("#weight").val();
    const description = $("#itemsDescription").val();
    // const price = +$(itemsPrice).val();
    // const weight = +$(itemsWeight).val();
    let valid = models.length > 0
    const thisModels = models.filter((p) => p.status).map(function (x) {
      if (valid) {
        const name = $('#model-name-' + x.id).val();
        const price = $('#model-price-' + x.id).val();
        const stock = $('#model-stock-' + x.id).val();
        if (!name || !price || !stock) {
          failAlert("something wrong with item number " + (x.id + 1))
          valid = false
        } else {
          if (canCompare) {
            let specValid = true
            const specification = canCompare.list.map(function (y) {
              if (specValid && valid) {
                // console.log(`#${y.slug}-${x.id}`);
                const thisValue = $(`#${y.slug}-${x.id}`).val();
                if (!thisValue) {
                  failAlert("something wrong with specification input on " + y.label + " at item number " + (x.id + 1))
                  specValid = false
                  valid = false
                } else {
                  // console.log("specmap")
                  // console.log(`#${y.slug}-${x.id}`, thisValue);
                  // y.type = undefined
                  y.value = thisValue
                  // console.log(y);
                  return y
                }
              }
            })
            console.trace(specification);
            // x.specification = specifications
            // console.log("spec")
            return {
              name,
              price,
              stock,
              specification
            }
          }
          return {
            name,
            price,
            stock
          }
        }
      }
      // console.log("models")
    })
    if (valid) {
      if (!name || !category || !subcategory || !weight || !description) {
        failAlert("something missing with this item")
      } else {
        const data = {
          name,
          category,
          subcategory,
          weight,
          description
        }
        console.log(data);
        console.log(thisModels);
        // Meteor.call('createItem', data, thisModels, function (error, res) {  
        //   console.log(error);
        //   console.log(res);
        //   if(error){
        //     failAlert(error);
        //   }
        //   else{
        //     successAlertBack();
        //   }
        // }) 
      }
    }
    // const stock = +$(itemsStock).val();
    // const subcategoryId = $(subcategories).val();
    // const oneSubCategory =  Template.instance().subcategory.get().filter(function (x){
    //   return x._id== subcategoryId
    // });   
    // const categoryId = oneSubCategory[0].categoryId;
    // const categoryName = oneSubCategory[0].categoryName;
    // const subcategoryName = oneSubCategory[0].name; 
    // const status = true;
    // const data = { name, price,description, weight, stock, condition, subcategoryId, subcategoryName, categoryId, categoryName,status}; 
    // console.log(data);
    // if(name.length === 0){
    //   failAlert("Nama tidak boleh kosong!")
    // }
    // else if(price < 1 || price.length === 0){
    //   failAlert("Price tidak boleh kosong!")
    // }
    // else if (stock < 1 || stock.length == 0)
    // {
    //   failAlert("Stock tidak boleh kosong!")
    // }
    // else if (weight < 1 || weight.length == 0)
    // {
    //   failAlert("weight tidak boleh kosong!")
    // }
    // else if (description.length == 0)
    // {
    //   failAlert("description tidak boleh kosong!")
    // }
    // else{
    //   Meteor.call('createItem', data, function (error, res) {  
    //     console.log(error);
    //     console.log(res);
    //     if(error){
    //       failAlert(error);
    //     }
    //     else{
    //       successAlertBack();
    //     }
    //   }) 
    // }

  },
  'change .selectedCategory'(e, t) {
    const click = $(e.target).val();
    console.log(click);
    t.now.set(click)

  },
  'change #subcategories'(e, t) {
    const click = $(e.target).val();
    const canCompare = SpecificationComparison.find((x) => x.subcategoryId == click)
    // console.log(click);
    if (canCompare) {
      t.comparison.set(canCompare)
    } else {
      t.comparison.set(false)
    }
    // t.now.set(click)

  },
  'click #model-more'(e, t) {
    const models = t.models.get()
    models.push({
      id: models.length,
      status: true
    })
    t.models.set(models)
  },
  'click .model-delete'(e, t) {
    const click = $(e.target).val();
    const models = t.models.get()
    const thisModel = models.find((x) => x.id == click)
    thisModel.status = false
    // console.log(models);
    t.models.set(models)
  },
})

Template.itemsDetailPage.onCreated(function () {
  const self = this;
  this.item = new ReactiveVar();
  this.category = new ReactiveVar();
  this.now = new ReactiveVar(1);
  this.editing = new ReactiveVar(false)
  const paramId = FlowRouter.current().params._id
  Meteor.call('getAllCategory', function (err, res) {
    self.category.set(res.filter(function (x) {
      return x.subcategory.length != 0
    }));
  });
  Meteor.call('getOneItem', paramId, function (err, res) {
    const category = self.category.get()
    self.item.set(res);
    if (category) {
      self.now.set(res.categoryId)
    }
    // console.log(res);
  })
})

Template.itemsDetailPage.helpers({
  items() {
    const items = Template.instance().item.get();
    if (items) {
      return items;
    }
  },
  categories() {
    const category = Template.instance().category.get();
    // console.log(category);
    return category;
  },
  editing() {
    return Template.instance().editing.get()
  },
  subcategories() {
    // const item = Template.instance().item.get();
    const category = Template.instance().category.get();
    if (category) {
      const now = Template.instance().now.get();
      return category.find((x) => x._id == now).subcategory
    }
    return [];
  },
})

Template.itemsDetailPage.events({

  'change .selectedCategory'(e, t) {
    const click = $(e.target).val();
    console.log(click);
    t.now.set(click)
  },
  'click .edit'(e, t) {
    t.editing.set(true)
  },
  'click #delete'(e, t) {
    const param = FlowRouter.current().params._id;
    Meteor.call('deleteItem', param, function (err, res) {
      if (err) {
        failAlert(err);
      } else {
        successAlertBack();
      }
    });
  }

})

// Template.itemsEditPage.onCreated(function () {  
//   const self=this;
//   const paramId = FlowRouter.current().params._id
//   this.item = new ReactiveVar();
//   this.category = new ReactiveVar();
//   this.subcategory = new ReactiveVar();  
//   this.now = new ReactiveVar(1);
//   Meteor.call('getAllCategory', function (err,res) {
//     self.category.set(res.filter(function (x) {  
//       return x.subcategory.length != 0
//     })); 
//   });
//   Meteor.call('getAllSubCategory', function (err,res) {
//     self.subcategory.set(res); 
//   });
//   Meteor.call('getOneItem', paramId, function (err,res) {
//     self.item.set(res);
//   })  
// })

// Template.itemsEditPage.onRendered(function () {
//   const click = $('.selectedCategory').val();
//   console.log(click);
//   Template.instance().now.set(click)

// });

// Template.itemsEditPage.helpers({
//   items(){
//     const items = Template.instance().item.get();
//     if(items){
//       return items;
//     }
//   },
//   categories(){
//     const category = Template.instance().category.get();
//       // console.log(category);
//       return category;
//   },
//   now(){
//     return Template.instance().now.get();
//   },
//   subcategories(){ 
//     // const item = Template.instance().item.get();
//     const category = Template.instance().category.get();
//     if(category){
//       const now = +Template.instance().now.get(); 
//       return category[now].subcategory
//     }
//     return [];
//   }, 
// })

// Template.itemsEditPage.events({
//   'change .selectedCategory'(e,t){
//     const click = $(e.target).val();
//     console.log(click);
//     t.now.set(click)
//   }
// })


//===============================================
//                    CATEGORY
//===============================================
Template.categoriesHome.onCreated(function () {
  const self = this;
  self.category = new ReactiveVar();
  self.subcategory = new ReactiveVar([]);
  Meteor.call('getAllCategory', function (err, res) {
    self.category.set(res);
    self.subcategory.set(res[0].subcategory);
  });
})

Template.categoriesHome.onRendered(function () {

})

Template.categoriesHome.helpers({
  categories() {
    return Template.instance().category.get();
  },
  equals(a, b) {
    return a == b;
  },
  subcategory() {
    return Template.instance().subcategory.get();
  }
})

Template.categoriesHome.events({
  'click #submit'(e, t) {
    const name = $(categoryName).val();
    const status = true;
    const data = {
      name,
      status
    };
    if (name.length === 0) {
      failAlert("Nama tidak boleh kosong!")
    } else {
      Meteor.call('createCategory', data, function (error, res) {
        console.log(error);
        console.log(res);
        if (error) {
          failAlert(error);
        } else {
          successAlertBack();
        }
      })
    }

  },
  'click .category_filter'(e, t) {
    const id = $(e.target).val();
    for (const key of t.category.curValue) {
      if (key._id == id) {
        t.subcategory.set(key.subcategory);
      }
    }
  },
})

Template.categoriesCreatePage.onCreated(function () {
  const self = this;
  this.category = new ReactiveVar();
})

Template.categoriesCreatePage.helpers({

})

Template.categoriesCreatePage.events({
  'click #submit'(e, t) {
    const name = $(categoryName).val();
    const status = true;
    const data = {
      name,
      status
    };
    if (name.length === 0) {
      failAlert("Nama tidak boleh kosong!")
    } else {
      Meteor.call('createCategory', data, function (error, res) {
        console.log(error);
        console.log(res);
        if (error) {
          failAlert(error);
        } else {
          successAlertBack();
        }
      })
    }

  }
})

Template.subCategoriesCreatePage.onCreated(function () {
  const self = this;
  this.subCategory = new ReactiveVar();
  Meteor.call('getAllCategory', function (err, res) {
    self.subCategory.set(res);
  });
})

Template.subCategoriesCreatePage.helpers({
  categories() {
    return Template.instance().subCategory.get();
  }

})

Template.subCategoriesCreatePage.events({
  'click #submit'(e, t) {
    const getCategory = t.subCategory.get();
    const name = $(subCategoryName).val();
    const categoryId = $(categories).val();
    const status = true;
    const category = getCategory.find((x) => {
      return x._id == categoryId
    });
    const categoryName = category.name;
    const data = {
      name,
      status,
      categoryId,
      categoryName
    };
    if (name.length === 0) {
      failAlert("Nama tidak boleh kosong!")
    } else {
      Meteor.call('createSubCategory', data, function (error, res) {
        console.log(error);
        console.log(res);
        if (error) {
          failAlert(error);
        } else {
          successAlertBack();
        }
      })
    }

  }
})
//===============================================
//                    PROMOTION
//===============================================
Template.promotionsHome.onCreated(function () {
  const self = this;
  self.filtering = new ReactiveVar({
    filter: '',
    sort: 1,
  })
  this.promotion = new ReactiveVar();
  Meteor.call('getAllPromotion', self.filtering.get(), function (err, res) {
    self.promotion.set(res);
  });
})

Template.promotionsHome.helpers({
  promotions() {
    return Template.instance().promotion.get();
  }

})

Template.promotionsHome.events({
  'change .filtering'(e, t) {
    const filter = $('#filter').val();
    const sort = $('#sort').val();
    const filterstartdate = new Date($('#startDate').val());
    const filterexpireddate = new Date($('#expiredDate').val());
    const dateOption = $('#dateoption').val();;
    t.filtering.set({
      filter,
      sort,
      filterstartdate: isValidDate(filterstartdate) ? filterstartdate : false,
      filterexpireddate: isValidDate(filterexpireddate) ? filterexpireddate : false,
      dateOption,
    })
    Meteor.call('getAllPromotion', {
      filter,
      sort,
      filterstartdate: isValidDate(filterstartdate) ? filterstartdate : false,
      filterexpireddate: isValidDate(filterexpireddate) ? filterexpireddate : false,
      dateOption,
    }, function (err, res) {
      t.promotion.set(res);
    })
  },
  'input .filtering'(e, t) {
    const filter = $('#filter').val();
    const sort = $('#sort').val();
    const filterstartdate = $('#startDate').val();
    const filterexpireddate = $('#expiredDate').val();
    const dateOption = "startDate";
    t.filtering.set({
      filter,
      sort,
      filterstartdate: isValidDate(filterstartdate) ? filterstartdate : false,
      filterexpireddate: isValidDate(filterexpireddate) ? filterexpireddate : false,
      dateOption
    })
    Meteor.call('getAllPromotion', {
      filter,
      sort,
      filterstartdate: isValidDate(filterstartdate) ? filterstartdate : false,
      filterexpireddate: isValidDate(filterexpireddate) ? filterexpireddate : false,
      dateOption
    }, function (err, res) {
      t.promotion.set(res);
    })
  },
})

Template.promotionsCreatePage.onCreated(function () {
  const self = this;
  this.promotion = new ReactiveVar();
})

Template.promotionsCreatePage.helpers({})

Template.promotionsCreatePage.events({
  'click #submit'(e, t) {
    const name = $(promotionsName).val();
    const description = $(promotionsDescription).val();
    const status = true;
    const startDate = new Date($("#start").val());
    const expiredDate = new Date($("#end").val());
    const data = {
      name,
      startDate,
      expiredDate,
      description,
      status
    };
    if (name.length === 0) {
      failAlert("Nama tidak boleh kosong!")
    } else if (!(startDate < expiredDate)) {
      failAlert("Tanggal Start harus kurang dari tanggal Expired")
    } else if (description.length == 0) {
      failAlert("Description tidak boleh kosong")
    } else {
      Meteor.call('createPromotion', data, function (error, res) {
        console.log(error);
        console.log(res);
        if (error) {
          failAlert(error);
        } else {
          successAlertBack();
        }
      })
    }

  }
})

Template.promotionsDetailPage.onCreated(function () {
  const self = this;
  this.promotion = new ReactiveVar();
  const paramId = FlowRouter.current().params._id
  Meteor.call('getOnePromotion', paramId, function (err, res) {
    self.promotion.set(res);
  })
})

Template.promotionsDetailPage.helpers({
  promotions() {
    const promotion = Template.instance().promotion.get();
    if (promotion) {
      return promotion;
    }
  }
})

Template.promotionsDetailPage.events({
  'click #delete'(e, t) {
    const param = FlowRouter.current().params._id;
    Meteor.call('deletePromotion', param, function (err, res) {
      if (err) {
        failAlert(err);
      } else {
        successAlertBack();
      }
    });
  }
})

Template.promotionEditPage.onCreated(function () {
  const self = this;
  this.promotion = new ReactiveVar();
  const paramId = FlowRouter.current().params._id
  Meteor.call('getOnePromotion', paramId, function (err, res) {
    self.promotion.set(res);
  })
})

Template.promotionEditPage.helpers({
  promotions() {
    const promotion = Template.instance().promotion.get();
    if (promotion) {
      return promotion;
    }
  },
  formatHTML(context) {
    return moment(context).format("YYYY-MM-DD");
  }
})

Template.promotionEditPage.events({
  'click #edit'(e, t) {
    const param = FlowRouter.current().params._id;
    const name = $('#promotionsName').val();
    const description = $('#promotionsDescription').val();
    const startDate = new Date($("#start").val());
    const expiredDate = new Date($("#end").val());
    const data = {
      name,
      startDate,
      expiredDate,
      description
    };
    if (name.length === 0) {
      failAlert("Nama tidak boleh kosong!")
    } else if (!(startDate < expiredDate)) {
      failAlert("Tanggal Start harus kurang dari tanggal Expired")
    } else if (description.length == 0) {
      failAlert("Description tidak boleh kosong")
    } else {
      Meteor.call('editPromotion', data, param, function (err, res) {
        if (err) {
          failAlert(err);
        } else {
          successAlertBack();
        }
      });
    }
  }
})