import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import Swal from 'sweetalert2';
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
      const code = $(promotionsCode).val();
      const discount = +$(promotionsDiscount).val();
      const description = $(promotionsDescription).val();
      const status = true;
      const startDate = moment($("#start").val(), 'YYYY-MM-DD').toDate();
      const expiredDate = moment($("#end").val(), 'YYYY-MM-DD').toDate(); 
      const data = {
        name,
        code,
        discount,
        startDate,
        expiredDate,
        description,
        status
      };
      if (name.length === 0) {
        failAlert("Nama tidak boleh kosong!")
      } else if (code.length === 0) {
        failAlert("Code tidak boleh kosong!")
      }else if (!(startDate < expiredDate)) {
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
            successAlertGo('Success add new promotion', '/master-promotions');
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
          successAlertGo('Success delete promotion', '/master-promotions');
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
      const code = $('#promotionsCode').val();
      const discount = +$('#promotionsDiscount').val();
      const description = $('#promotionsDescription').val();
      const startDate = moment($("#start").val(), 'YYYY-MM-DD').toDate();
      const expiredDate = moment($("#end").val(), 'YYYY-MM-DD').toDate(); 
      const data = {
        name,
        code,
        discount, 
        startDate,
        expiredDate,
        description
      };
      if (name.length === 0) {
        failAlert("Nama tidak boleh kosong!")
      } else if (code.length === 0) {
        failAlert("Code tidak boleh kosong!")
      }else if (!(startDate < expiredDate)) {
        failAlert("Tanggal Start harus kurang dari tanggal Expired")
      } else if (description.length == 0) {
        failAlert("Description tidak boleh kosong")
      } else {
        Meteor.call('editPromotion', data, param, function (err, res) {
          if (err) {
            failAlert(err);
          } else {
            successAlertBack('Success Edit Promotion');
          }
        });
      }
    }
  })
  