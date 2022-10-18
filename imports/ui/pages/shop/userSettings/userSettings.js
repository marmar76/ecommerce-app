import {
  Meteor
} from 'meteor/meteor';
import {
  Template
} from 'meteor/templating';
import moment, {
  now
} from 'moment';
import {
  ImagePlaceholder
} from '../../../../api/users/users';
import './userSettings.html';

function isValidDate(d) {
  return d instanceof Date && !isNaN(d);
}
const userSettingsMenu = [{
    id: 0,
    label: "Biodata Diri"
  },
  {
    id: 1,
    label: "Daftar Alamat"
  },
]
Template.userSettings.onCreated(function () {
  const self = this
  this.imageList = new ReactiveVar(null)
  this.fotoProfile = new ReactiveVar(ImagePlaceholder)
  this.thisUser = new ReactiveVar()
  this.now = new ReactiveVar(0)
  this.updateAlamat = new ReactiveVar(false)
  this.addresses = new ReactiveVar([])
  Meteor.call('getMyself', async function (err, res) {
    self.thisUser.set(res)
    // self.fotoProfile.set(res.profilePicture ? res.profilePicture : ImagePlaceholder)
    if (res.profilePicture) {
      self.fotoProfile.set(res.profilePicture)
    } else {
      // self.fotoProfile
    }
  })
})
Template.userSettings.helpers({
  updateAlamat() {
    return Template.instance().updateAlamat.get()
  },
  thisUser() {
    // console.log(Meteor.user());
    return Template.instance().thisUser.get()
  },
  fotoProfile() {
    return Template.instance().fotoProfile.get()
  },
  userMenu() {
    return userSettingsMenu
  },
  equals(a, b) {
    return a == b
  },
  stringify(elem){
    return JSON.stringify(elem)
  },
  address() {
    const thisUser = Template.instance().thisUser.get()
    if (thisUser && thisUser.address && thisUser.address.length > 0) {
      return thisUser.address
    } else return false
  },
  now() {
    return Template.instance().now.get()
  }
})
Template.userSettings.onRendered(function () {  
  
})
Template.userSettings.events({
    'click .user-menu'(e, t){
        const click = e.target.value
        t.now.set(click)
    },
    'click .add-alamat'(e, t){
      var data = [
        {
            id: 0,
            text: 'enhancement'
        },
        {
            id: 1,
            text: 'bug'
        },
        {
            id: 2,
            text: 'duplicate'
        },
        {
            id: 3,
            text: 'invalid'
        },
        {
            id: 4,
            text: 'wontfix'
        }
    ];
      setTimeout(() => {
        $('#user-kecamatan').select2({
          dropdownParent: $('#modal-add-address'),
          data: data
        });
      }, 200);
    },
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
      'click #user-save'(e, t){
        const name = $("#user-name").val();
        const dob = new Date($("#user-dob").val());
        const phone = $("#user-phone").val();
        const data = {name, dob, phone}
        if(name || isValidDate(dob) || phone){
            const imageList = t.imageList.get()
            let thisFile, getExt
            if(imageList){
                thisFile = imageList
                getExt = thisFile.type.split('/')[1]
                getExt = '.' + getExt
                data.profilePicture = Meteor.userId() + getExt
            }
            Meteor.call('updateMyself', data, function (error, res) {  
                if(error){
                  failAlert(error)
                } else {
                  if(imageList){
                    const fileName = Meteor.userId() + getExt
                    uploadImageFile(imageList, 'user/picture', fileName).then((snapshot) => {
                    //   exitLoading()
                    //   $(".trigger-addition").trigger("click");
                    //   $("#success-agent").val("true");
                      console.log('Image Uploaded Successfully');
                      // console.log(snapshot)
                      successAlert()
                      $(".trigger-button").trigger("click");
                    //   if(FlowRouter.current().path == "/agents/create")history.back()
                    }).catch((error) => {
                    //   exitLoading()
                    //   $(".trigger-addition").trigger("click");
                    //   $("#success-agent").val("true");
                      console.error(error);
                    //   const msg = errorFileMsg + '\nSilahkan upload file-nya lewat edit agent.'
                      failAlert(error)
                    //   if(FlowRouter.current().path == "/agents/create")history.back()
                    });
                  } else {
                    // exitLoading()
                    // $(".trigger-addition").trigger("click");
                    // $("#success-agent").val("true");
                    // successAlert()
                    // if(FlowRouter.current().path == "/agents/create")history.back()
                  }
                }
                // exitLoading()
              })
        }
        else{
            failAlert("something wrong with the user input")
        }
        // const name = $("#user-name").val();
      }
})