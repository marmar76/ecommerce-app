
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
      let valid = models.length > 0
      console.log(models);
      console.log("lenght" + models.length);
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
              stock
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
          Meteor.call('createItem', data, thisModels, function (error, res) {  
            console.log(error);
            console.log(res);
            if(error){
              failAlert(error);
            }
            else{
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
    this.category = new ReactiveVar();
    this.now = new ReactiveVar(1);
    this.editing = new ReactiveVar(false)
    this.models = new ReactiveVar([])
    const paramId = FlowRouter.current().params._id
    Meteor.call('getAllCategory', this.filtering.get(), function (err, res) {
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
  
  Template.itemsDetailPage.onRendered(function () {
    initSelect2();
  });
  
  Template.itemsDetailPage.helpers({
    items() {
      const items = Template.instance().item.get();
      if (items) {
        console.log(items);
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
        console.log(category.find((x) => x._id == now).subcategory);
        return category.find((x) => x._id == now).subcategory
      }
      return [];
    },
    equals(a, b){
      return a == b
    }
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
    },
    'click #btnAddModel'(e, t) {
      const models = t.models.get()
      console.log(models);
      models.push({
        id: models.length,
        status: true
      })
      t.models.set(models)
    },
    'click .m'(e, t) {
      const click = $(e.target).val();
      const models = t.models.get()
      const thisModel = models.find((x) => x.id == click)
      thisModel.status = false
      // console.log(models);
      t.models.set(models)
    },
  
  })
  