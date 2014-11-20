Emails = new Mongo.Collection('emails')

Emails.allow({
  insert: function () { return true }
})

Attendees = new Mongo.Collection('attendees')

Attendees.allow({
  insert: function (userId, attendee) {
    attendee.createdAt = Date.now()
    return true
  }
})