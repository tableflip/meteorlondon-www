AdminController = RouteController.extend({
  template: 'admin',
  waitOn: function() { return Meteor.subscribe('everything') }
})

Template.admin.helpers({
  emails: function () {
    return Emails.find({})
  }
})
