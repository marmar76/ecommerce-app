
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
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
    Meteor.call('getAllCategory', this.filtering.get(), function (err, res) {
      self.category.set(res.filter(function (x) {
        return x.subcategory.length != 0
      }));
    });
    Meteor.call('getAllSubCategory',this.filtering.get(), function (err, res) {
      self.subcategory.set(res);
    });
    Meteor.call('getAllItem', self.filtering.get(), function (err, res) {
      console.log(res);
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
    self.filtering = new ReactiveVar({
      filter: '',
      sort: 1,
    })
    this.category = new ReactiveVar();
    this.subcategory = new ReactiveVar();
    this.now = new ReactiveVar(1);
    this.models = new ReactiveVar([{
      id: 0,
      status: true
    }])
    this.comparison = new ReactiveVar(false)
    this.imageList = new ReactiveVar(null)
    this.fotoItem = new ReactiveVar()
    Meteor.call('getAllCategory', this.filtering.get() , function (err, res) {
      self.category.set(res);
    });
    Meteor.call('getAllSubCategory',this.filtering.get(), function (err, res) {
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
    fotoItem() {
      return Template.instance().fotoItem.get()
    },
  })
  
  Template.itemsCreatePage.events({
    'change #uploadImageItem': function (event, template) {
      event.preventDefault();
      const checkFile = event.currentTarget.files;
  
      if (checkFile && checkFile.length > 0) {
        let imageList = template.imageList.get()
        //   _.each(checkFile, function (file) {
        //     imageList = [file]
        //   });
        // console.log(checkFile);
        console.log(checkFile);
        template.fotoItem.set(URL.createObjectURL(checkFile[0]))
        template.imageList.set(checkFile[0])
      }
    },
    'click #submit'(e, t) {
      const models = t.models.get()
      const canCompare = t.comparison.get()
      const name = $("#itemsName").val();
      console.log(name);
      const category = $("#categories").val();
      const subcategory = $("#subcategories").val();
      const weight = $("#weight").val();
      const description = $("#itemsDescription").val();
      let valid = models.length > 0
      console.log(models);
      console.log("lenght" + models.length);
      const thisModels = models.filter((p) => p.status).map(function (x) {
        if (valid) {
          const name = $('#model-name-' + x.id).val();
          const price = $('#model-price-' + x.id).val();
          const stock = $('#model-stock-' + x.id).val();
          const status = true 
          if (!name || !price || !stock) {
            failAlert("something wrong with item number " + (x.id + 1))
            valid = false
          } else {
            if (canCompare) {
              let specValid = true
              const specification = canCompare.specification.map(function (y) {
                if (specValid && valid) {
                  const thisValue = $(`#${y.slug}-${x.id}`).val();
                  console.log(thisValue);
                  if (!thisValue) {
                    failAlert("something wrong with specification input on " + y.label + " at item number " + (x.id + 1))
                    specValid = false
                    valid = false
                  } else {
                    y.value = thisValue
                    console.log(y);
                    return y
                  }
                }
              })
              return {
                name,
                price,
                stock,
                status,
                specification: JSON.parse(JSON.stringify(specification))
              }
            }
            return {
              name,
              price,
              stock,
              status,
            }
          }
        }
      })
      console.log(thisModels);
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
          $("#uploadImageItem").trigger("change");
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
          Meteor.call('createItem', data, thisModels, function (error, res) {  
            console.log(error);
            console.log(res);
            if(error){
              failAlert(error);
            }
            else{
              if(imageList){
                console.log(res);
                const fileName = res + getExt
                uploadImageFile(imageList, 'items/picture', fileName).then((snapshot) => { 
                  console.log('Image Uploaded Successfully'); 
                  successAlert() 
                }).catch((error) => { 
                  console.error(error); 
                  failAlert(error) 
                });
              } else {
                // exitLoading() 
              }
              successAlertBack();
            }
          }) 
        }
      }
  
    },
    'change .selectedCategory'(e, t) {
      const click = $(e.target).val();
      console.log(click);
      t.now.set(click)
  
    },
    'change #subcategories'(e, t) {
      const click = $(e.target).val();
      const subCategory = t.subcategory.get()
      const canCompare = subCategory.find((x) => x._id == click)
      // const canCompare = SpecificationComparison.find((x) => x.subcategoryId == click)
      console.log(canCompare);
      // console.log(click);
      // if (canCompare) {
      if (canCompare.specification) {
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
    this.filtering = new ReactiveVar({
      filter: '',
      sort: '1',
    })
    this.item = new ReactiveVar();
    this.imageList = new ReactiveVar(null)
    this.fotoItem = new ReactiveVar()
    this.category = new ReactiveVar();
    this.subcategory = new ReactiveVar();
    this.now = new ReactiveVar(1);
    this.editing = new ReactiveVar(false)
    this.comparison = new ReactiveVar(false)
    this.models = new ReactiveVar([])
    const arr = this.models.get()
    const paramId = FlowRouter.current().params._id
    Meteor.call('getAllCategory', this.filtering.get(), function (err, res) {
      self.category.set(res.filter(function (x) {
        return x.subcategory.length != 0
      }));
    });
    Meteor.call('getOneItem', paramId, function (err, res) {
      if(err){
        console.log(err);
        FlowRouter.go('forbidden')
      }else if(res){
        const category = self.category.get()
        if(res.models){
          for (const i of res.models) {
            if(i.specification){
              if(i.specification.length > 0){
                arr.push({
                  id: arr.length,
                  name: i.name,
                  price: i.price,
                  stock: i.stock,
                  itemId: i.itemId,
                  specification: i.specification,
                  status: i.status,
                  isNew: false
                })
              }
            }else{
              arr.push({
                id: arr.length,
                name: i.name,
                price: i.price,
                stock: i.stock,
                itemId: i.itemId,
                status: i.status,
                isNew: false
              })
            }
          }
        }else{
            arr.push({
            id: arr.length,
            status: true,
            isNew:true
          })
        }
        self.item.set(res)
        self.fotoItem.set(res.link)
        if (category) {
          self.now.set(res.category)
        }
        Meteor.call('getOneSubCategory', res.subcategory, function (error, result) {
          if(result.specification)self.comparison.set(result)
        })
      }
      else{
        FlowRouter.go('forbidden')
      }
      // console.log(res);
    })
    Meteor.call('getAllSubCategory',this.filtering.get(), function (err, res) {
      self.subcategory.set(res);
      console.log(res);
    });
  })
  
  Template.itemsDetailPage.onRendered(function () {
    initSelect2();
  });
  
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
    models() {
      return Template.instance().models.get()
    },
    equals(a, b){
      return a == b
    },
    comparison() {
      return Template.instance().comparison.get()
    },
    now() {
      return Template.instance().now.get();
    },
    fotoItem() {
      return Template.instance().fotoItem.get()
    },
  })
  
  Template.itemsDetailPage.events({
    'change #uploadImageItem': function (event, template) {
      event.preventDefault();
      const checkFile = event.currentTarget.files;
  
      if (checkFile && checkFile.length > 0) {
        let imageList = template.imageList.get()
        //   _.each(checkFile, function (file) {
        //     imageList = [file]
        //   });
        // console.log(checkFile);
        console.log(checkFile);
        template.fotoItem.set(URL.createObjectURL(checkFile[0]))
        template.imageList.set(checkFile[0])
      }
    },
    'click #btnSave'(e, t) {
      const models = t.models.get()
      const item = t.item.get()
      const canCompare = t.comparison.get()
      const name = $("#itemsName").val();
      const picture = item.picture
      const imageList = t.imageList.get()
      const category = $("#categories").val();
      const subcategory = $("#subcategories").val();
      const weight = $("#weight").val();
      const description = $("#itemsDescription").val();
      const paramId = FlowRouter.current().params._id
      let valid = models.length > 0
      const arr = []
      const oldModels  = (item.subcategory == subcategory  && item.category == category) ? models.filter((p) => !p.isNew) : models.filter((p) => !p.isNew).map( function (x) {
        delete x.specification
        return x
      })
      for (const i of oldModels) {
        arr.push(i)
      }
      //thisModels ini new model yang di add manual(bukan model lama)
      const thisModels = models.filter((p) => p.status && p.isNew).map(function (x) {
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
              const specification = canCompare.specification.map(function (y) {
                if (specValid && valid) {
                  const thisValue = $(`#${y.slug}-${x.id}`).val();
                  console.log(thisValue);
                  if (!thisValue) {
                    failAlert("something wrong with specification input on " + y.label + " at item number " + (x.id + 1))
                    specValid = false
                    valid = false
                  } else {
                    y.value = thisValue
                    console.log(y);
                    return y
                  }
                }
              })
              return {
                name,
                price,
                stock,
                specification: JSON.parse(JSON.stringify(specification))
              }
            }
            return {
              name,
              price,
              stock,
            }
          }
        }
      })
      for (const i of thisModels) {
        arr.push(i)
      }
      console.log(arr);
      if (valid) {
        if (!name || !category || !subcategory || !weight || !description || !picture) {
          failAlert("something missing with this item")
        } else {
          
          const data = {
            name,
            category,
            subcategory,
            weight,
            picture,
            description,
            models: arr
          }
          // $("#uploadImageItem").trigger("change");
            const imageList = t.imageList.get()
            let thisFile, getExt
            if(imageList){
              thisFile = imageList
              getExt = thisFile.type.split('/')[1]
              getExt = '.' + getExt
              // data.ext = getExt
              // console.log(data);
              data.picture = paramId + getExt
          }
          Meteor.call('updateItem',paramId, data, function (error, result) {  
            if(error){
              failAlert(error);
            }
            else{
              if(imageList){
                console.log(result);
                const fileName = paramId + getExt
                uploadImageFile(imageList, 'items/picture', fileName).then((snapshot) => { 
                  console.log('Image Uploaded Successfully'); 
                  // successAlert() 
                }).catch((error) => { 
                  console.error(error); 
                  failAlert(error) 
                });
              } else {
                // exitLoading() 
              }
              successAlertBack();
            }
          }) 
        }
      }
  
    },
    'change .selectedCategory'(e, t) {
      const click = $(e.target).val();
      console.log(click);
      t.now.set(click)
    },
    'change #subcategories'(e, t) {
      const click = $(e.target).val();
      const subCategory = t.subcategory.get()
      const canCompare = subCategory.find((x) => x._id == click)
      // const canCompare = SpecificationComparison.find((x) => x.subcategoryId == click)
      console.log(canCompare);
      // console.log(click);
      // if (canCompare) {
        console.log(canCompare);
      if (canCompare.specification) {
        t.comparison.set(canCompare)
      } else {
        t.comparison.set(false)
      }
      // t.now.set(click)
  
    },
    'click .edit'(e, t) {
      t.editing.set(true)
    },
    'click .cancel'(e, t) {
      t.editing.set(false)
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
    },
    'click #btnAddModel'(e, t) {
      const models = t.models.get()
      models.push({
        id: models.length,
        status: true,
        isNew:true
      })
      console.log(models);
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

  
  Template.modelDetailPage.onCreated(function () {
    const self = this;   
    this.model = new ReactiveVar() 
    const paramId = FlowRouter.current().params._id
    //parmaID = tasjdhi123-0, tasjdhi123-1, tasjdhi123-2 dll 
    //id[0] untuk id item (tsa123sakj,123koaosjdh)dll
    //id[1] untuk id model (0,1,2,3)dll
    const id=paramId.split('-')
    console.log(id[0]);
    console.log(id[1]);
    Meteor.call('getOneModel', id[0], paramId, function (err, res) {
      if(err){
        console.log(err);
        FlowRouter.go('forbidden')
      }else if(res){
         console.log(res);
         self.model.set(res)
      }
      else{
        FlowRouter.go('forbidden')
      } 
    })
  })
  
  Template.modelDetailPage.helpers({
    model() {
      console.log(Template.instance().model.get());
      return Template.instance().model.get()
    },
    equals(a, b){
      return a == b
    },
  })
  
  Template.modelDetailPage.events({ 
    'click #delete'(e, t){
      const paramId = FlowRouter.current().params._id
      const id=paramId.split('-')
      Meteor.call('deleteModel', id[0], paramId, function (err, res) {
        console.log(res);
      })
    },
  })
  
  
  Template.modelEditPage.onCreated(function () {
    const self = this;   
    this.model = new ReactiveVar() 
    const paramId = FlowRouter.current().params._id
    //parmaID = tasjdhi123-0, tasjdhi123-1, tasjdhi123-2 dll 
    //id[0] untuk id item (tsa123sakj,123koaosjdh)dll
    //id[1] untuk id model (0,1,2,3)dll
    const id=paramId.split('-')
    console.log(id[0]);
    console.log(id[1]);
    Meteor.call('getOneModel', id[0], paramId, function (err, res) {
      if(err){
        console.log(err);
        FlowRouter.go('forbidden')
      }else if(res){
         console.log(res);
         self.model.set(res)
      }
      else{
        FlowRouter.go('forbidden')
      } 
    })
  })
  
  Template.modelEditPage.helpers({ 
    model() {
      console.log(Template.instance().model.get());
      return Template.instance().model.get()
    },
    equals(a, b){
      return a == b
    },
  })
  
  Template.modelEditPage.events({ 
    'click #btnSave'(e, t){
      const model = t.model.get()
      console.log(model);
      const paramId = FlowRouter.current().params._id
      const id=paramId.split('-')
      const name = $('#name').val();
      const price = $('#price').val();
      const stock = $('#stock').val();
      const specification = model.specification.map(function (x) {
          const label = $('#model-label-' + x.slug).val();
          const value = $('#model-value-' + x.slug).val();
          const slug = $('#model-slug-' + x.slug).val();
          if (!label || !slug || !value) {
            failAlert("something wrong with specification in field " + (ctr))
          }else{
            return {
              label,
              slug,
              value
            }
          }
      }) 
      if(!name || !price || !stock || !specification){
        failAlert('field tidak boleh kosong')
      }else{
        const data = {
          name:name,
          price:price,
          stock:stock,
          specification:specification
        }
        Meteor.call('updateModel', id[0], paramId, data, function (err, res) {
          console.log(res);
        })
      }
    },
  })
  