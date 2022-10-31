import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import Swal from 'sweetalert2';
Template.categoriesHome.onCreated(function () {
    const self = this;
    this.filtering = new ReactiveVar({
      filter: '',
      sort: '1',
    })
    // const getUser = () => Meteor.user();
    const getUser =  Meteor.user();
    console.log(getUser) 
    // console.log(Meteor.user().role) 
    self.category = new ReactiveVar();
    self.subcategory = new ReactiveVar([]);
    Meteor.call('getAllCategory', this.filtering.get(), function (err, res) {
      self.category.set(res); 
    });
    Meteor.call('getAllSubCategory',this.filtering.get(), function (err, res) {  
      self.subcategory.set(res)
    })
  })
  
  Template.categoriesHome.helpers({
    categories() {
      return Template.instance().category.get();
    },
    equals(a, b) {
      return a == b;
    },
    subCategories(id) {
      return Template.instance().subcategory.get().filter((x) => x.categoryId == id );
    }
  })
  
  Template.categoriesHome.events({
    'input #filter'(e, t){
      const filter = $('#filter').val()
      t.filtering.set({
        filter
      })
      console.log(filter);
      Meteor.call('getAllCategory', {
        filter,
      }, function (err, res) {
        t.category.set(res);
      })
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
      const name = $(categoryName).val().trim();
      const status = true;
      const data = {
        name,
        status
      };
      if (name.length === 0) {
        failAlert("Name can't be empty!")
      } else {
        Meteor.call('createCategory', data, function (error, res) {
          console.log(error);
          console.log(res);
          if (error) {
            failAlert(error);
          } else {
            successAlertGo('Success add new category', '/master-categories');
          }
        })
      }
  
    }
  })
  
  Template.categoriesDetailPage.onCreated(function () {
    const self = this;
    self.filtering = new ReactiveVar({
      filter: '',
      sort: 1,
    })
    self.category = new ReactiveVar();
    self.subcategory = new ReactiveVar([]);
    const paramId = FlowRouter.current().params._id
    Meteor.call('getOneCategory', paramId, function (err, res) { 
      self.category.set(res); 
    });
    Meteor.call('getAllSubCategory',this.filtering.get(), function (err, res) {  
      self.subcategory.set(res.filter((x)=> x.categoryId == paramId))
    })
  })
  
  Template.categoriesDetailPage.helpers({
    category() {
      return Template.instance().category.get();
    },
    equals(a, b) {
      return a == b;
    },
    subCategories() {
      return Template.instance().subcategory.get();
    }
  })
  
  Template.categoriesDetailPage.events({
    'click #delete'(e, t) {
      const paramId = FlowRouter.current().params._id 
      const subCategories = t.subcategory.get()
      console.log(subCategories.length);
      if(subCategories.length<=0){ 
        Swal.fire({
          title: 'Are you sure you want to delete this category',
          icon: 'warning', 
          showCancelButton: true,
          confirmButtonText: 'OK', 
        }).then((result) => {  
          if (result.isConfirmed) { 
            Meteor.call('deleteCategory', paramId, function (err, res) {
              successAlertGo('Success delete category', '/master-categories')
            })
          }
        })
        
      }else{
        failAlert("can't delete this category,it have subcategory")
      }
      
       
    }, 
  })
  
  
  Template.categoriesEditPage.onCreated(function () {
    const self = this;
    self.category = new ReactiveVar(); 
    const paramId = FlowRouter.current().params._id
    Meteor.call('getOneCategory', paramId, function (err, res) { 
      self.category.set(res); 
    }); 
  })
  
  Template.categoriesEditPage.helpers({
    category() {
      return Template.instance().category.get();
    },
    equals(a, b) {
      return a == b;
    }, 
  })
  
  Template.categoriesEditPage.events({
    'click #save'(e, t) {
      const paramId = FlowRouter.current().params._id  
      const name = $('#categoryName').val();
      if(name){ 
        Swal.fire({
          title: 'Are you sure you want to update this category',
          icon: 'warning', 
          showCancelButton: true,
          confirmButtonText: 'OK', 
        }).then((result) => {  
          if (result.isConfirmed) { 
            Meteor.call('updateCategory', paramId, name, function (err, res) {
              successAlertBack('Success update category')
            })
          }
        })
      }else{
        failAlert('insert name')
      }
       
    }, 
  })
  
  Template.subCategoriesHome.onCreated(function () {
    const self = this;
    this.filtering = new ReactiveVar({
      filter: '',
      sort: '1',
    })
    self.category = new ReactiveVar();
    self.subcategory = new ReactiveVar([]);
    Meteor.call('getAllCategory', this.filtering.get(), function (err, res) {
      self.category.set(res);
      self.subcategory.set(res[0].subcategory);
    });
  })
    
  Template.subCategoriesHome.helpers({
    categories() {
      return Template.instance().category.get();
    },
    equals(a, b) {
      return a == b;
    },
    subcategory() {
      return Template.instance().subcategory.get().filter((x)=> x.status == true);
    }
  })
  
  Template.subCategoriesHome.events({
    'click .category_filter'(e, t) {
      const id = $(e.target).val();
      for (const key of t.category.curValue) {
        if (key._id == id) {
          t.subcategory.set(key.subcategory);
        }
      }
    },
  })
  
  Template.subCategoriesCreatePage.onCreated(function () {
    const self = this;
    this.models = new ReactiveVar([{
      id: 0,
      status: true
    }]) 
    this.subCategory = new ReactiveVar();
    Meteor.call('getAllCategory', function (err, res) {
      self.subCategory.set(res);
    });
  })
  
  Template.subCategoriesCreatePage.helpers({
    categories() {
      return Template.instance().subCategory.get();
    }, 
    models() {
      return Template.instance().models.get()
    },
  
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
      const models = t.models.get() 
      let valid = models.length > 0 
      const thisModels = models.filter((p) => p.status).map(function (x) {
        if (valid) {
          const label = $('#model-name-' + x.id).val();
          const nameArr = label.split(' ') 
          let slug =""
          for (const i of nameArr) {
            slug += i + ""
          } 
          if (!label || !slug ) {
            failAlert("something wrong with specification field number " + (x.id + 1))
            valid = false
          }else{
            return {
              label,
              slug
            }
          }
        } 
      }) 
      if(valid){
        if (name.length === 0) {
          failAlert("Nama tidak boleh kosong!")
        } else {
          const data = {
            name,
            status,
            categoryId,
            categoryName
          };
          Meteor.call('createSubCategory', data, thisModels, function (error, res) {
            console.log(error);
            console.log(res);
            if (error) {
              failAlert(error);
            } else {
              successAlertGo('Success add new category', '/master-subcategories')
              
            }
          })
        } 
      }
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
      const status = models.filter((x) => x.status == true)
      //penjagaan agar tidak semua model bisa didelete
      if(status.length>1){
        const thisModel = models.find((x) => x.id == click)
        thisModel.status = false
        t.models.set(models)
      }else{
        failAlert("minimum specification is 1 ,can't delete this field")
      } 
    },
  })
  
  
  Template.subCategoriesDetailPage.onCreated(function () {
    const self = this; 
    
    const paramId = FlowRouter.current().params._id
    this.subCategory = new ReactiveVar()  
    this.item = new ReactiveVar()
    Meteor.call('getSpecificItems', paramId, async function (err, res) {  
      self.item.set(res)
    })
    Meteor.call('getOneSubCategory', paramId, function (err, res) {   
      self.subCategory.set(res);
    })
    setTimeout(() => {
      $("#show").trigger("click");
    }, 500);
  })
  
  Template.subCategoriesDetailPage.helpers({
    subCategory() { 
      return Template.instance().subCategory.get();
    },  
    equals(a, b){
      return a == b
    },
    items(){
      return Template.instance().item.get();
    }
  })
  
  Template.subCategoriesDetailPage.events({
    'click #delete'(e, t) {
      const paramId = FlowRouter.current().params._id
      const items = t.item.get()
      if(items.length <=0){
        Swal.fire({
          title: 'Are you sure you want to delete this subcategory',
          icon: 'warning', 
          showCancelButton: true,
          confirmButtonText: 'OK', 
        }).then((result) => {  
          if (result.isConfirmed) { 
            Meteor.call('deleteSubCategory', paramId, function (err, res) {
              successAlertGo('Success delete subcategory', '/master-subcategories')
            })
          }
        })
      }else{
        failAlert("can't delete this subcategory while it have an item")
      }
    }, 
  
  })
  
  Template.subCategoriesEditPage.onCreated(function () {
    const self = this;
    this.models = new ReactiveVar([])
    const arr = this.models.get() 
    
    const paramId = FlowRouter.current().params._id
    this.subCategory = new ReactiveVar()
    this.category = new ReactiveVar();
    this.item = new ReactiveVar()
    Meteor.call('getSpecificItems', paramId, async function (err, res) {  
      self.item.set(res)
    })
    Meteor.call('getAllCategory', function (err, res) {
      self.category.set(res);
    });
    Meteor.call('getOneSubCategory', paramId, function (err, res) {  
      
      if(res.specification){
        for (const i of res.specification) {
          arr.push({
            id: arr.length,
            status:true,
            label: i.label,
            slug: i.slug,
            isNew: false
          })
        }
      }else{
          arr.push({
          id: arr.length,
          status: true,
          isNew:true
        })
      } 
      self.subCategory.set(res);
    })
    setTimeout(() => {
      $("#show").trigger("click");
    }, 500);
  })
  
  Template.subCategoriesEditPage.helpers({
    subCategory() {
      return Template.instance().subCategory.get();
    }, 
    categories() {
      return Template.instance().category.get();
    }, 
    models() {
      let models = Template.instance().models.get() 
      if(models){
        console.log(models);
        return models 
      }
    },
    equals(a, b){
      return a == b
    },
  })
  
  Template.subCategoriesEditPage.events({
    'click #save'(e, t) {
      const paramId = FlowRouter.current().params._id
      const getCategory = t.category.get();
      const name = $(subCategoryName).val();
      const categoryId = $(categories).val();
      const status = true;
      const category = getCategory.find((x) => {
          return x._id == categoryId
        });
      const categoryName = category.name;
      const models = t.models.get()  
      let valid = models.length > 0 
      const thisModels = models.filter((p) => p.status).map(function (x) {
        if (valid) {
          const label = $('#model-name-' + x.id).val();
          const nameArr = label.split(' ') 
          let slug =""
          for (const i of nameArr) {
            slug += i + ""
          } 
          if (!label || !slug ) {
            failAlert("something wrong with item number " + (x.id + 1))
            valid = false
          }else{
            return {
              label,
              slug
            }
          }
        } 
      }) 
      if(valid){
        if (name.length === 0){
          failAlert("Nama tidak boleh kosong!")
        } else {
          const data = {
            name,
            status,
            categoryId,
            categoryName,
            specification: thisModels
          }
          Swal.fire({
            title: 'Are you sure you want to update this subcategory',
            icon: 'warning', 
            showCancelButton: true,
            confirmButtonText: 'OK', 
          }).then((result) => {  
            if (result.isConfirmed) { 
              Meteor.call('updateSubCategory', paramId, data, function (error, res) { 
                if (error) {
                  failAlert(error);
                } else {
                  successAlertBack();
                }
              })
            }
          })
        } 
      }
    },
    'click #model-more'(e, t) {
      const models = t.models.get()
      models.push({
        id: models.length,
        status: true,
        isNew:true
      })
      t.models.set(models)
    },
    'click #show'(e, t) {
      const models = t.models.get()
      t.models.set(models)
    },
    'click .model-delete'(e, t) {
      const click = $(e.target).val();
      const models = t.models.get()
      const items= t.item.get()
      const modelStatus = models.filter((x) => x.status == true)
      //penjagaan agar tidak semua model bisa didelete
      let status = modelStatus.length > 1 ? 0 : -1
      const thisModel = models.find((x) => x.id == click) ? models.find((x) => x.id == click) : models.find((x) => x.slug == click)
      //pengechekan item dan model yang terakhir diinput
      //nampilin item terbaru dengan model terbaru
      if(items.length > 0){
        const spec = items[items.length-1].models[items[items.length-1].models.length-1].specification 
        for (const i of spec) { 
          if(i.label == thisModel.label)status = false
        }
      }
      console.log(thisModel.label);
      if(status == 0){
        thisModel.status = false
        t.models.set(models)
      }else if(status == 1){
        failAlert('Tidak Bisa delete karena ada Item yang memiliki specification ini')
      }else{
        failAlert("minimum specification is 1 ,can't delete this field")
      }
    },
  
  })