import {
  Meteor
} from 'meteor/meteor';
import {
  Template
} from 'meteor/templating';
import select2 from 'select2';
import ProgressBar from "progressbar.js";
import './master.html';
import './users.html';
import './items.html';
import './promotions.html';
import './subCategories.html';
import './categories.html';
import './banners.html';
import './invoice.html';
import './customerSupport.html';
import './admin/navbar'
import './admin/container'
import './admin/user'
import './admin/category' 
import './admin/promotion' 
import './admin/banner'
import './admin/item'
import './admin/invoice'
import './admin/customerSupport'

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
export const navbar = [{
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
        title: 'Create Admin'
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
        href: '/master-subcategories',
        title: 'List Sub categories'
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
  // {
  //   type: 2,
  //   title: 'Promotion',
  //   icon: 'menu-icon mdi mdi-account',
  //   href: 'master-promotions',
  //   child: [{
  //       href: '/master-promotions',
  //       title: 'List Promotion'
  //     },
  //     {
  //       href: '/master-promotions-create',
  //       title: 'Create Promotion'
  //     }
  //   ]
  // },
  {
    type: 2,
    title: 'Banner',
    icon: 'menu-icon mdi mdi-account',
    href: 'master-banner',
    child: [{
        href: '/master-banner',
        title: 'List Banner'
      },
      {
        href: '/master-banner-create',
        title: 'Create Banner'
      }
    ]
  },
  {
    type: 2,
    title: 'Invoice',
    icon: 'menu-icon mdi mdi-account',
    href: 'master-invoice',
    child: [{
        href: '/master-invoice',
        title: 'List invoice'
      },
    ]
  },
  {
    type: 2,
    title: 'Customer Service',
    icon: 'menu-icon mdi mdi-account',
    href: 'customer-support',
    child: [{
        href: '/customer-support',
        title: 'Customer Support'
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


function setMonthlyInvoice(trans) {  
  setTimeout(() => {
    var graphGradient = document.getElementById("performaneLine").getContext('2d');
    var graphGradient2 = document.getElementById("performaneLine").getContext('2d');
    var saleGradientBg = graphGradient.createLinearGradient(5, 0, 5, 100);
    saleGradientBg.addColorStop(0, 'rgba(26, 115, 232, 0.18)');
    saleGradientBg.addColorStop(1, 'rgba(26, 115, 232, 0.02)');
    var saleGradientBg2 = graphGradient2.createLinearGradient(100, 0, 50, 150);
    saleGradientBg2.addColorStop(0, 'rgba(0, 208, 255, 0.19)');
    saleGradientBg2.addColorStop(1, 'rgba(0, 208, 255, 0.03)');
    const labels = []
    const data = []
    const datas = trans
    for (const i of datas) {
      labels.push(i.label)
      data.push(i.data.length)
    }
    var salesTopData = {
        // labels: ["SUN","sun", "MON", "mon", "TUE","tue", "WED", "wed", "THU", "thu", "FRI", "fri", "SAT"],
        labels: labels,
        datasets: [{
            label: 'Monthly Report',
            // label: 'This week',
            // data: [50, 110, 60, 290, 200, 115, 130, 170, 90, 210, 240, 280, 200],
            data: data,
            backgroundColor: saleGradientBg,
            borderColor: [
                '#1F3BB3',
            ],
            borderWidth: 1.5,
            fill: true, // 3: no fill
            pointBorderWidth: 1,
            pointRadius: [4, 4, 4, 4, 4,4, 4, 4, 4, 4,4, 4, 4],
            pointHoverRadius: [2, 2, 2, 2, 2,2, 2, 2, 2, 2,2, 2, 2],
            pointBackgroundColor: ['#1F3BB3)', '#1F3BB3', '#1F3BB3', '#1F3BB3','#1F3BB3)', '#1F3BB3', '#1F3BB3', '#1F3BB3','#1F3BB3)', '#1F3BB3', '#1F3BB3', '#1F3BB3','#1F3BB3)'],
            pointBorderColor: ['#fff','#fff','#fff','#fff','#fff','#fff','#fff','#fff','#fff','#fff','#fff','#fff','#fff',],
        }
      ]
    };

    var salesTopOptions = {
      responsive: true,
      maintainAspectRatio: false,
        scales: {
            yAxes: [{
                gridLines: {
                    display: true,
                    drawBorder: false,
                    color:"#F0F0F0",
                    zeroLineColor: '#F0F0F0',
                },
                ticks: {
                  beginAtZero: false,
                  autoSkip: true,
                  maxTicksLimit: 4,
                  fontSize: 10,
                  color:"#6B778C"
                }
            }],
            xAxes: [{
              gridLines: {
                  display: false,
                  drawBorder: false,
              },
              ticks: {
                beginAtZero: false,
                autoSkip: true,
                maxTicksLimit: 7,
                fontSize: 10,
                color:"#6B778C"
              }
          }],
        },
        legend:false,
        legendCallback: function (chart) {
          var text = [];
          text.push('<div class="chartjs-legend"><ul>');
          for (var i = 0; i < chart.data.datasets.length; i++) {
            console.log(chart.data.datasets[i]); // see what's inside the obj.
            text.push('<li>');
            text.push('<span style="background-color:' + chart.data.datasets[i].borderColor + '">' + '</span>');
            text.push(chart.data.datasets[i].label);
            text.push('</li>');
          }
          text.push('</ul></div>');
          return text.join("");
        },
        
        elements: {
            line: {
                tension: 0.4,
            }
        },
        tooltips: {
            backgroundColor: 'rgba(31, 59, 179, 1)',
        }
    }
    var salesTop = new Chart(graphGradient, {
        type: 'line',
        data: salesTopData,
        options: salesTopOptions
    });
    document.getElementById('performance-line-legend').innerHTML = salesTop.generateLegend();
  }, 200);

}
function setWeeklyIncome(trans, week) {
  const labels = []
  const data = []
  for (const i of trans) {
      labels.push(i.label)
      data.push(i.total)
  
  }
  var marketingOverviewChart = document.getElementById("marketingOverview").getContext('2d');
  var marketingOverviewData = {
      labels: labels,
      datasets: [{
          label: week,
          data: data,
          backgroundColor: "#52CDFF",
          borderColor: [
              '#52CDFF',
          ],
          borderWidth: 0,
          fill: true, // 3: no fill
          
      }]
  };

  var marketingOverviewOptions = {
    responsive: true,
    maintainAspectRatio: false,
      scales: {
          yAxes: [{
              gridLines: {
                  display: true,
                  drawBorder: false,
                  color:"#F0F0F0",
                  zeroLineColor: '#F0F0F0',
              },
              ticks: {
                beginAtZero: true,
                autoSkip: true,
                maxTicksLimit: 5,
                fontSize: 10,
                color:"#6B778C"
              }
          }],
          xAxes: [{
            stacked: true,
            barPercentage: 0.35,
            gridLines: {
                display: false,
                drawBorder: false,
            },
            ticks: {
              beginAtZero: false,
              autoSkip: true,
              maxTicksLimit: 12,
              fontSize: 10,
              color:"#6B778C"
            }
        }],
      },
      legend:false,
      legendCallback: function (chart) {
        var text = [];
        text.push('<div class="chartjs-legend"><ul>');
        for (var i = 0; i < chart.data.datasets.length; i++) {
          console.log(chart.data.datasets[i]); // see what's inside the obj.
          text.push('<li class="text-muted text-small">');
          text.push('<span style="background-color:' + chart.data.datasets[i].borderColor + '">' + '</span>');
          text.push(chart.data.datasets[i].label);
          text.push('</li>');
        }
        text.push('</ul></div>');
        return text.join("");
      },
      
      elements: {
          line: {
              tension: 0.4,
          }
      },
      tooltips: {
          backgroundColor: 'rgba(31, 59, 179, 1)',
      }
  }
  var marketingOverview = new Chart(marketingOverviewChart, {
      type: 'bar',
      data: marketingOverviewData,
      options: marketingOverviewOptions
  });
  document.getElementById('marketing-overview-legend').innerHTML = marketingOverview.generateLegend();
}

//   bar.text.style.fontSize = '0rem';
//   bar.animate(.64); // Number from 0.0 to 1.0

// }
Template.contentExample.onCreated(function () {
  const self = this 
  self.invoiceReport = new ReactiveVar()
  self.totalMonthlyInvoice = new ReactiveVar() 
  self.weeklyTransactionReport = new ReactiveVar()
  self.mostActiveUser = new ReactiveVar()
  self.totalWeeklyIncome = new ReactiveVar()
  self.thisWeek = new ReactiveVar()
  self.lastWeek = new ReactiveVar()
  self.labelTimeActiveUser = new ReactiveVar('This Week')
  const dateFrom = moment().startOf('month').toDate()
  // const month = moment('2022-03-03').startOf('month').toDate()
  // console.log(month);
  const dateTo = moment().endOf('month').toDate()
  const getLastWeek = moment().subtract(6, 'days').toDate() 
  const lastWeek = moment(getLastWeek, 'DD/MM/YYYY').startOf('day').toDate() 
  const today = moment(new Date(), 'DD/MM/YYYY').endOf('day').toDate()
  self.thisWeek.set(today)
  self.lastWeek.set(lastWeek)
  Meteor.call('getWeeklyIncome', lastWeek, today, function (err, res) {  
    if(err){
      failAlert(err)
    }else{
      console.log(res);
      self.weeklyTransactionReport.set(res)
      setWeeklyIncome(res,'This week')
      let totalIncome = 0 
      for (const i of res) {
        totalIncome += i.total
      }
      self.totalWeeklyIncome.set(totalIncome)
    }
  })
  Meteor.call('getTransReport', dateFrom, dateTo, function (err, res) {  
    if(err){
      failAlert(err)
    }else{
      self.invoiceReport.set(res);
      self.totalMonthlyInvoice.set(res.length);
      setMonthlyInvoice(res)
    }
  })
  Meteor.call('getMostActiveUser', lastWeek, today, 1, 3,  function (err, res) {  
    if(err){
      failAlert(err)
    }else{
      self.mostActiveUser.set(res)
      console.log(res);
    }
  })
})
Template.contentExample.helpers({
  mostActiveUser() { 
    const user = Template.instance().mostActiveUser.get()
    if(user){ 
      console.log(Template.instance().mostActiveUser.get());
      return Template.instance().mostActiveUser.get()
    }
  },
  totalWeeklyIncome() {  
    const totalIncome = Template.instance().totalWeeklyIncome.get()
    if(totalIncome){
      console.log(totalIncome);
      return totalIncome;
    }
  },
  weeklyTransactionReport() {  
    return Template.instance().weeklyTransactionReport.get();
  },
  totalInvoice() {
    return Template.instance().totalMonthlyInvoice.get();
  },
  equals(a, b){
    return a == b
  },
  thisWeek(){
    return Template.instance().thisWeek.get()
  },
  lastWeek(){
    return Template.instance().lastWeek.get()
  },
  labelTimeActiveUser(){
    return Template.instance().labelTimeActiveUser.get()
  },
  weekStart (){
    return moment().startOf('week').toDate()
  },
  weekEnd (){
      return moment().endOf('week').toDate()
  },
  formatHTML(context) {
      return moment(context).format("YYYY-MM-DD");
  },

})

Template.contentExample.events({
  'change #month'(e, t){
    const dateFrom =  $('#month').val() != 0 ? moment( $('#month').val()).startOf('month').toDate() : moment().startOf('month').toDate()
    const dateTo =  $('#month').val() != 0 ? moment( $('#month').val()).endOf('month').toDate() : moment().endOf('month').toDate()
    console.log(dateFrom);
    Meteor.call('getTransReport', dateFrom, dateTo, function (err, res) {  
      if(err){
        failAler(err)
      } else{
        console.log(res.length);
        t.invoiceReport.set(res);
        t.totalMonthlyInvoice.set(res.length);
        setMonthlyInvoice(res)
      }
    })
    var bar = new ProgressBar.Circle(totalVisitors, {
      color: '#fff',
      // This has to be the same size as the maximum width to
      // prevent clipping
      strokeWidth: 15,
      trailWidth: 15, 
      easing: 'easeInOut',
      duration: 1400,
      text: {
        autoStyleContainer: false
      },
      from: {
        color: '#52CDFF',
        width: 15
      },
      to: {
        color: '#677ae4',
        width: 15
      },
      // Set default step function for all animate calls
      step: function(state, circle) {
        circle.path.setAttribute('stroke', state.color);
        circle.path.setAttribute('stroke-width', state.width);
  
        var value = Math.round(circle.value() * 100);
        if (value === 0) {
          circle.setText('');
        } else {
          circle.setText(value);
        }
  
      }
    });
  
    bar.text.style.fontSize = '0rem';
    bar.animate(.64); // Number from 0.0 to 1.0
    
  },
  'change .weeklyIncome'(e, t){
    const week = +$('#weeklyIncome').val();
    const getLastWeek = moment().subtract(week, 'days').toDate()
    let lastWeek = week != 0 ? moment(getLastWeek, 'DD/MM/YYYY').endOf('day').toDate() : moment(new Date(), 'DD/MM/YYYY').endOf('day').toDate() 
    const getLastWeekPlus7 = moment().subtract(week+6, 'days').toDate()
    let lastWeekPlus7 = moment(getLastWeekPlus7, 'DD/MM/YYYY').startOf('day').toDate()
    const top = $('#top').val();
    $('.filterCustom').hide()
    if(week == 69){
      $('.filterCustom').show()
      const start = $('#startDate').val();
      const end = $('#endDate').val();
      lastWeekPlus7 = moment(start).startOf('day').toDate()
      lastWeek = moment(end).endOf('day').toDate()
    }
    t.thisWeek.set(lastWeek)
    t.lastWeek.set(lastWeekPlus7)
    // console.log(lastWeek)
    // console.log(lastWeekPlus7)
    let text ='This Week'
    if(week == 7){
      text = 'Last Week'
    }else if(week == 14){
      text = 'Last 2 Week'
    }else if(week ==21){
      text = 'Last 3 Week'
    } else if(week ==69){
      text = 'custom date'
    }
    Meteor.call('getWeeklyIncome', lastWeekPlus7, lastWeek, function (err, res) {  
      if(err){
        failAlert(err)
      }else{
        t.weeklyTransactionReport.set(res)
        setWeeklyIncome(res, text)
        let totalIncome = +0 
        if(res){
          for (const i of res) {
            totalIncome += i.total
          }
        }

        t.totalWeeklyIncome.set(totalIncome)
        console.log(t.totalWeeklyIncome.get());
      }
    })
  },
  'change .weeklyUser'(e,t){
    const week = +$('#weeklyUser').val();
    const getLastWeek = moment().subtract(week, 'days').toDate()
    let lastWeek = week != 0 ? moment(getLastWeek, 'DD/MM/YYYY').endOf('day').toDate() : moment(new Date(), 'DD/MM/YYYY').endOf('day').toDate() 
    const getLastWeekPlus7 = moment().subtract(week+6, 'days').toDate()
    let lastWeekPlus7 = moment(getLastWeekPlus7, 'DD/MM/YYYY').startOf('day').toDate()
    const sort = $('#sortUser').val();
    const top = $('#top').val();
    $('.filterCustomUser').hide() 
    if(week == 69){
      $('.filterCustomUser').show()
      const start = $('#startDateUser').val();
      const end = $('#endDateUser').val();
      lastWeekPlus7 = moment(start).startOf('day').toDate()
      lastWeek = moment(end).endOf('day').toDate()
    }
    if(week == 7){
      t.labelTimeActiveUser.set('Last Week')
    }else if(week == 14){
      t.labelTimeActiveUser.set('Last 2 Week')
    }else if(week == 21){
      t.labelTimeActiveUser.set('Last 3 Week')
    }else if(week ==69){
      t.labelTimeActiveUser.set('Custom Date')
    }else{
      t.labelTimeActiveUser.set('This Week')
    } 
    Meteor.call('getMostActiveUser', lastWeekPlus7, lastWeek, sort, top,  function (err, res) {  
      if(err){
        failAlert(err)
      }else{
        console.log(res);
        t.mostActiveUser.set(res)
      }
    })
  },
  
}) 
