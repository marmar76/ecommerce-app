import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import Swal from 'sweetalert2';
import moment from 'moment';
Template.bannersHomePage.onCreated(function () {
    const self = this;
    this.filtering = new ReactiveVar({
      filter: '',
      sort: '1',
    })
    this.banner = new ReactiveVar();
    this.imageList = new ReactiveVar(null)
    this.fotoProfile = new ReactiveVar()
    this.fotoBanners = new ReactiveVar([])
    const arr = this.fotoBanners.get()
    Meteor.call('getAllBanner', this.filtering.get(), function (err, res) {  
      if(err){
        failAlert(err)
      }else{
        self.banner.set(res)
      }
    }) 
    Meteor.call('refreshAllBanner', function (err, res) {  
      console.log(res);
    })
  })
  
  Template.bannersHomePage.helpers({
    banners() {
      const banner = Template.instance().banner.get();
      if (banner) {
        return banner;
      }
    },
    formatHTML(context) {
      return moment(context).format("YYYY-MM-DD");
    },
  })
  
  Template.bannersHomePage.events({
    'change #uploadImageProfile': function (event, template) {
      event.preventDefault();
      const checkFile = event.currentTarget.files;
  
      if (checkFile && checkFile.length > 0) {
        let imageList = template.imageList.get()
        //   _.each(checkFile, function (file) {
        //     imageList = [file]
        //   });
        // console.log(checkFile);
        template.fotoProfile.set(URL.createObjectURL(checkFile[0]))
        template.imageList.set(checkFile[0])
      }
    },
    'change .filtering'(e, t) {
      const filter = $('#filter').val();
      const sort = $('#sort').val();
      t.filtering.set({
        filter,
        sort
      })
      Meteor.call('getAllBanner', {
        filter,
        sort
      }, function (err, res) {  
        t.banner.set(res)
      }) 
    },
    'input #filter'(e, t) {
      const filter = $('#filter').val();
      const sort = $('#sort').val();
      t.filtering.set({
        filter,
        sort
      })
      Meteor.call('getAllBanner', {
        filter,
        sort
      }, function (err, res) {  
        t.banner.set(res)
      }) 
    },
  })
  
  
  Template.bannersCreatePage.onCreated(function () {
    const self = this;
    this.imageList = new ReactiveVar(null)
    this.fotoProfile = new ReactiveVar()
  
  })
  
  Template.bannersCreatePage.helpers({
    formatHTML(context) {
      return moment(context).format("YYYY-MM-DD");
    },
    fotoProfile() {
      return Template.instance().fotoProfile.get()
    },
    equals(a, b){
      return a == b
    },
  })
  
  Template.bannersCreatePage.events({
    'change #uploadImageProfile': function (event, template) {
      event.preventDefault();
      const checkFile = event.currentTarget.files;
  
      if (checkFile && checkFile.length > 0) {
        let imageList = template.imageList.get()
        //   _.each(checkFile, function (file) {
        //     imageList = [file]
        //   });
        // console.log(checkFile);
        console.log(checkFile);
        template.fotoProfile.set(URL.createObjectURL(checkFile[0]))
        template.imageList.set(checkFile[0])
      }
    }, 
    'click #submit'(e, t){ 
        const name = $("#bannersName").val().trim(); 
        const description = $("#bannersDescription").val().trim();
        const startDate = moment($("#startDate").val(), 'YYYY-MM-DD').toDate();
        const expiredDate = moment($("#expiredDate").val(), 'YYYY-MM-DD').toDate(); 
        console.log(startDate);
        console.log(expiredDate);
        // const check = $('#checkBanner').is(':checked')
        // const data = {name, description, check}
        const data = {name, description, startDate, expiredDate}
        if(name && description){ 
          if (!(startDate < expiredDate)) {
            failAlert("Tanggal Start harus kurang dari tanggal Expired")
          }else{
            $("#uploadImageProfile").trigger("change");
          const imageList = t.imageList.get()
          let thisFile, getExt
          if(imageList){
              thisFile = imageList
              getExt = thisFile.type.split('/')[1]
              getExt = '.' + getExt
              data.ext = getExt
              console.log(data);
              data.profilePicture = Meteor.userId() + getExt 
              Meteor.call('createBanner', data, function (error, res) {  
                if(error){
                  failAlert(error)
                } else {
                  console.log(res);
                  if(imageList){
                    const fileName = res + getExt
                    uploadImageFile(imageList, 'banners/picture', fileName).then((snapshot) => { 
                      console.log('Image Uploaded Successfully'); 
                      successAlertBack('Success Add Banner') 
                    }).catch((error) => { 
                      console.error(error); 
                      failAlert(error) 
                    });
                  } else {
                    // exitLoading() 
                  }
                }
                // exitLoading()
              })
            }else{
              failAlert("You must input your image") 
            }
          }
          
            
        }
        else{
            failAlert("All field must be filled")
        }
    }
  })
  
  
  Template.bannersEditPage.onCreated(function () {
    const self = this;
    this.banner = new ReactiveVar();
    this.imageList = new ReactiveVar(null)
    this.fotoProfile = new ReactiveVar()
    const paramId = FlowRouter.current().params._id
    Meteor.call('getMyBanner', paramId, function (err, res) {  
      if(err){
        failAlert(err)
      }else{
        self.banner.set(res)
        self.fotoProfile.set(res.picture)
      }
    })
  
  })
  
  Template.bannersEditPage.helpers({
    banners() {
      const banner = Template.instance().banner.get();
      if (banner) {
        return banner;
      }
    },
    formatHTML(context) {
      return moment(context).format("YYYY-MM-DD");
    },
    fotoProfile() {
      return Template.instance().fotoProfile.get()
    },
    equals(a, b){
      return a == b
    },
  })
  
  Template.bannersEditPage.events({
    'change #uploadImageProfile': function (event, template) {
      event.preventDefault();
      const checkFile = event.currentTarget.files;
  
      if (checkFile && checkFile.length > 0) {
        let imageList = template.imageList.get()
        //   _.each(checkFile, function (file) {
        //     imageList = [file]
        //   });
        // console.log(checkFile);
        console.log(checkFile);
        template.fotoProfile.set(URL.createObjectURL(checkFile[0]))
        template.imageList.set(checkFile[0])
      }
    },
    'change #checkBanner'(e, t){
      console.log($('#checkBanner').is(':checked'));
    },
    'click #btnSave'(e, t){
        const banner = Template.instance().banner.get();
        const name = $("#bannersName").val();
        const paramId = FlowRouter.current().params._id
        const description = $("#bannersDescription").val();
        const startDate = moment($("#startDate").val(), 'YYYY-MM-DD').toDate();
        const expiredDate = moment($("#expiredDate").val(), 'YYYY-MM-DD').toDate(); 
        // const check = $('#checkBanner').is(':checked')
        // const data = {name, description, check}
        
        const data = {name, description, startDate, expiredDate}
        if(name && description){
          if (!(startDate < expiredDate)) {
            failAlert("Tanggal Start harus kurang dari tanggal Expired")
          }else{
            $("#uploadImageProfile").trigger("change");
            const imageList = t.imageList.get()
            let thisFile, getExt
            if(imageList){
                thisFile = imageList
                getExt = thisFile.type.split('/')[1]
                getExt = '.' + getExt
                data.ext = getExt
                console.log(data);
                // data.profilePicture = Meteor.userId() + getExt
            }else{
              data.ext = banner.ext 
            }
            Swal.fire({
              title: 'Are you sure you want to update this banner',
              icon: 'warning', 
              showCancelButton: true,
              confirmButtonText: 'OK', 
            }).then((result) => {  
              if (result.isConfirmed) { 
                Meteor.call('updateBanner', paramId, data, function (error, res) {  
                  if(error){
                    failAlert(error)
                  } else {
                    console.log(res);
                    if(imageList){
                      const fileName = res + getExt
                      uploadImageFile(imageList, 'banners/picture', fileName).then((snapshot) => { 
                        console.log('Image Uploaded Successfully'); 
                        successAlertBack() 
                      }).catch((error) => { 
                        console.error(error); 
                        failAlert(error) 
                      });
                    } else {
                      successAlertBack()
                      // exitLoading() 
                    }
                  }
                  // exitLoading()
                })
              }
            })
          }
        }
        else{
            failAlert("something wrong with the user input")
        }
    },
    'click #btnDelete'(e, t){
      const paramId = FlowRouter.current().params._id
      Swal.fire({
        title: 'Are you sure you want to delete this banner',
        icon: 'warning', 
        showCancelButton: true,
        confirmButtonText: 'OK', 
      }).then((result) => {  
        if (result.isConfirmed) { 
          Meteor.call('deleteBanner', paramId, function (err, res) {  
            if(err){
              failAlert(err)
            }else{
              // successAlertBack()
              successAlertGo('Success delete banners', '/master-banner');
            }
          })
        }
      })
      
    }
  })
  
  