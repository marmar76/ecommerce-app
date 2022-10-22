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
    'click #submit'(e, t){
        const name = $("#bannersName").val();
        const description = $("#bannersDescription").val();
        const data = {name, description}
        if(name || description){
            const imageList = t.imageList.get()
            let thisFile, getExt
            if(imageList){
                thisFile = imageList
                getExt = thisFile.type.split('/')[1]
                getExt = '.' + getExt
                data.ext = getExt
                // data.profilePicture = Meteor.userId() + getExt
            }
            Meteor.call('createBanner', data, function (error, res) {  
                if(error){
                  failAlert(error)
                } else {
                  console.log(res);
                  if(imageList){
                    const fileName = res + getExt
                    uploadImageFile(imageList, 'banners/picture', fileName).then((snapshot) => { 
                      console.log('Image Uploaded Successfully'); 
                      successAlert() 
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
        }
        else{
            failAlert("something wrong with the user input")
        }
    }
  })
  
  
  Template.bannersCreatePage.onCreated(function () {
    const self = this;
    this.banner = new ReactiveVar();
    this.imageList = new ReactiveVar(null)
    this.fotoProfile = new ReactiveVar()
  
  })
  
  Template.bannersCreatePage.helpers({
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
    'change #checkBanner'(e, t){
      console.log($('#checkBanner').is(':checked'));
    },
    'click #submit'(e, t){ 
        const name = $("#bannersName").val(); 
        const description = $("#bannersDescription").val();
        const check = $('#checkBanner').is(':checked')
        const data = {name, description, check}
        if(name || description){
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
            }
            Meteor.call('createBanner', data, function (error, res) {  
                if(error){
                  failAlert(error)
                } else {
                  console.log(res);
                  if(imageList){
                    const fileName = res + getExt
                    uploadImageFile(imageList, 'banners/picture', fileName).then((snapshot) => { 
                      console.log('Image Uploaded Successfully'); 
                      successAlert() 
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
        }
        else{
            failAlert("something wrong with the user input")
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
        const check = $('#checkBanner').is(':checked')
        const data = {name, description, check}
        if(name || description){
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
            Meteor.call('updateBanner', paramId, data, function (error, res) {  
                if(error){
                  failAlert(error)
                } else {
                  console.log(res);
                  if(imageList){
                    const fileName = res + getExt
                    uploadImageFile(imageList, 'banners/picture', fileName).then((snapshot) => { 
                      console.log('Image Uploaded Successfully'); 
                      successAlert() 
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
        }
        else{
            failAlert("something wrong with the user input")
        }
    },
    'click #btnDelete'(e, t){
      const paramId = FlowRouter.current().params._id
      Meteor.call('deleteBanner', paramId, function (err, res) {  
        if(err){
          failAlert(err)
        }else{
          successAlertBack()
        }
      })
    }
  })
  
  