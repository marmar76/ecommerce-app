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
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
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
function resetForm() {
  const name = $('#user-nama').val('');
  const hp = $('#user-hp').val('');
  const label = $('#user-label').val('');
  // const regency = $('#user-kecamatan').val('');
  TomJerry.clear()
  const address = $('#user-alamat').val('');
  // const isDefault = $('#alamat-utama').removeAttr('checked');
  $('#alamat-utama').prop('checked', false);
}
Template.userSettings.onCreated(function () {
  const self = this
  this.imageList = new ReactiveVar(null)
  this.fotoProfile = new ReactiveVar(ImagePlaceholder)
  this.thisUser = new ReactiveVar()
  this.now = new ReactiveVar(0)

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
  stringify(elem) {
    return JSON.stringify(elem)
  },
  now() {
    return Template.instance().now.get()
  }
})
Template.userSettings.onRendered(function () {

})
Template.userSettings.events({
  'click .user-menu'(e, t) {
    const click = e.target.value
    t.now.set(click)
    if (click == 1) {

    }
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
  'click #user-save'(e, t) {
    const name = $("#user-name").val();
    const dob = new Date($("#user-dob").val());
    const phone = $("#user-phone").val();
    const data = {
      name,
      dob,
      phone
    }
    if (name || isValidDate(dob) || phone) {
      const imageList = t.imageList.get()
      let thisFile, getExt
      if (imageList) {
        thisFile = imageList
        getExt = thisFile.type.split('/')[1]
        getExt = '.' + getExt
        data.profilePicture = Meteor.userId() + getExt
      }
      Meteor.call('updateMyself', data, function (error, res) {
        if (error) {
          failAlert(error)
        } else {
          if (imageList) {
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
    } else {
      failAlert("something wrong with the user input")
    }
    // const name = $("#user-name").val();
  }
})
let TomJerry

Template.userAddress.onCreated(function () {
  const self = this
  this.thisUser = new ReactiveVar()
  this.updateAlamat = new ReactiveVar(false)
  this.addresses = new ReactiveVar([])
  const selectAddress = $("#select-address").val();
  this.isSelectingAddress = new ReactiveVar(selectAddress == "true" ? true : false)
  // this.TomSelect = new ReactiveVar()
  Meteor.call('getMyself', async function (err, res) {
    self.thisUser.set(res)
    console.log(res);
    const address = res.address.map(function (x, i) {
      if(x.isDefault){
        if(self.isSelectingAddress.get()){
          self.isSelectingAddress.set(i)
        }
      }
      return {
        thisVal: JSON.stringify({
          label: x.regency.label,
          city_id: x.regency.city_id,
          province_id: x.regency.province_id
        }),
        label: x.regency.label
      }
    })
    self.addresses.set(address)
    setTimeout(() => {
      TomJerry = new TomSelect('#user-kecamatan', {
        valueField: 'thisVal',
        labelField: 'label',
        searchField: ['label', 'type'],
        plugins: ['change_listener'],
        // fetch remote data
        load: function (query, callback) {
          var self = this;
          if (self.loading > 1) {
            callback();
            return;
          }
          // console.log(query);
          Meteor.call('search-regencies', query, function (err, res) {
            if (err) {
              console.log(err);
              callback()
            } else {
              console.log(res);
              callback(res)
              // Template.instance().addresses.set(res)
              // self.settings.load = null
            }
          })
          // var url = 'https://whatcms.org/API/List';
          // fetch(url)
          //   .then(response => response.json())
          //   .then(json => {
          //     callback(json.result.list);
          //     self.settings.load = null;
          //   }).catch(()=>{
          //     callback();
          //   });

        },
        // custom rendering function for options
        render: {
          option: function (item, escape) {
            return `<div class="py-2 d-flex">
                  <div class="mb-1">
                    <span class="h5">
                      ${ escape(item.label) }
                    </span>
                  </div>
                  </div>`;
            // <div class="ms-auto">${ escape(item.type.join(', ')) }</div>
          }
        },

      });
      // self.TomSelect.set(TomSelect)
      // $('#user-kecamatan').select2({
      //   transport: function (params, success, failure) {  

      //   }
      // });
    }, 200);
    // self.fotoProfile.set(res.profilePicture ? res.profilePicture : ImagePlaceholder)

  })

})

Template.userAddress.helpers({
  address() {
    const thisUser = Template.instance().thisUser.get()
    if (thisUser && thisUser.address && thisUser.address.length > 0) {
      return thisUser.address
    } else return false
  },
  updateAlamat() {
    return Template.instance().updateAlamat.get()
  },
  regency() {
    return Template.instance().addresses.get()
  },
  isSelecting(){
    return Template.instance().isSelectingAddress.get()
  },
  isSelected(id){
    return id == Template.instance().isSelectingAddress.get()
  }
})

Template.userAddress.events({
  'click .btn-hapus-alamat'(e, t) {
    const click = e.target.value
    Meteor.call('deleteUserAddress', click, function (err, res) {
      if (err) {
        failAlert(err)
      } else {
        successAlert()
        Meteor.call('getMyself', async function (err, res) {
          t.thisUser.set(res)
        })
      }
    })
  },
  'click .set-default-alamat'(e, t) {
    const click = e.target.value
    const thisUser = t.thisUser.get()
    const thisAlamat = thisUser.address[click]
    thisAlamat.isDefault = true
    Meteor.call('updateUserAddress', thisAlamat, click, function (err, res) {
      if (err) {
        failAlert(err)
      } else {
        successAlert()
        Meteor.call('getMyself', async function (err, res) {
          t.thisUser.set(res)
          // self.fotoProfile.set(res.profilePicture ? res.profilePicture : ImagePlaceholder)
          // if (res.profilePicture) {
          //   t.fotoProfile.set(res.profilePicture)
          // } else {
          //   // self.fotoProfile
          // }
        })
        // $("#btn-close-address").trigger("click");
      }
    })
    // console.log(click);

  },
  'click .close-btn'(e, t){
    resetForm()
  },
  'click .btn-edit-alamat'(e, t) {
    const click = e.target.value
    t.updateAlamat.set(click)
    const thisUser = t.thisUser.get()
    const thisAlamat = thisUser.address[click]
    const name = $('#user-nama').val(thisAlamat.name);
    const hp = $('#user-hp').val(thisAlamat.hp);
    const label = $('#user-label').val(thisAlamat.label);
    $('#alamat-utama').prop('checked', thisAlamat.isDefault);
    // console.log(thisAlamat.regency.label);
    setTimeout(() => {
      const thisRegency = JSON.stringify({
        label: thisAlamat.regency.label,
        city_id: thisAlamat.regency.city_id,
        province_id: thisAlamat.regency.province_id
      })
      console.log(thisRegency);
      // const TomSelect = t.TomSelect.get()
      TomJerry.setValue(thisRegency)
      setTimeout(() => {
        console.log($('#user-kecamatan').val());
        t.updateAlamat.set(click)


      }, 2000);
    }, 200);
    const address = $('#user-alamat').val(thisAlamat.address);
    $(".add-alamat").trigger("click");
    // const isDefault = $('#alamat-utama').removeAttr('checked');
  },
  'click .add-alamat'(e, t) {
    t.updateAlamat.set(false)

  },
  'click #save-alamat-user'(e, t) {
    
    const updateAlamat = t.updateAlamat.get()
    const name = $('#user-nama').val();
    const hp = $('#user-hp').val();
    const label = $('#user-label').val();
    const regency = $('#user-kecamatan').val();
    const address = $('#user-alamat').val();
    const isDefault = $('#alamat-utama').is(':checked');
    // const addresses = t.addresses.get()
    if (!name || !hp || !label || !regency || !address) {
      failAlert("something is missing with the form")
    } else {
      // console.log(regency);
      // const thisRegency = addresses.find((x) => x.id == regency)
      // console.log(thisRegency);
      const data = {
        name,
        hp,
        label,
        regency: JSON.parse(regency),
        address,
        isDefault
        // {label: thisRegency.label, city_id: thisRegency.city_id, province_id: thisRegency.province_id}
      }
      console.log(updateAlamat);
      if (updateAlamat) {
        Meteor.call('updateUserAddress', data, updateAlamat, function (err, res) {
          if (err) {
            failAlert(err)
          } else {
            successAlert()
            Meteor.call('getMyself', async function (err, res) {
              t.thisUser.set(res)
              // self.fotoProfile.set(res.profilePicture ? res.profilePicture : ImagePlaceholder)
              // if (res.profilePicture) {
              //   t.fotoProfile.set(res.profilePicture)
              // } else {
              //   // self.fotoProfile
              // }
              resetForm()
            })
            $("#btn-close-address").trigger("click");
          }
        })
      } else {
        Meteor.call('addUserAddress', data, function (err, res) {
          if (err) {
            failAlert(err)
          } else {
            successAlert()
            Meteor.call('getMyself', async function (err, res) {
              t.thisUser.set(res)
              // self.fotoProfile.set(res.profilePicture ? res.profilePicture : ImagePlaceholder)
              // if (res.profilePicture) {
              //   t.fotoProfile.set(res.profilePicture)
              // } else {
              //   // self.fotoProfile
              // }
              resetForm()
            })
            $("#btn-close-address").trigger("click");
          }
        })
      }

      console.log(data);
    }

  },
})

Template.selectAddress.onCreated(function () {  
  const self = this
  self.selected = new ReactiveVar()
  self.thisUser = new ReactiveVar()
  Meteor.call('getMyself', function (err, res) {  
    self.thisUser.set(res)
    // console.log(res);
    self.selected.set(res.address.find((x) => x.isDefault))
    // console.log(res.address.find((x) => x.isSelected));
  })
})

Template.selectAddress.helpers({
  address(){
    return Template.instance().thisUser.get().address
  },
  selected(){
    return Template.instance().selected.get()
  }
})

Template.selectAddress.events({
  'click .set-selected-alamat'(e, t){
    const click = e.target.value
    const thisUser = t.thisUser.get()
    const userAddress = thisUser.address.map(function (x) {  
      x.isDefault = false
      return x
    })
    userAddress[click].isDefault = true
    t.selected.set(thisUser.address[click])
    t.thisUser.set(thisUser)
    $('.btn-close').trigger('click');
  },
  'click .add-alamat'(e, t){
    FlowRouter.go('userSettings')
  }
})