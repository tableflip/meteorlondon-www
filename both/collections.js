Emails = new Meteor.Collection('emails')

Emails.allow({
  insert: function () { return true }
})
