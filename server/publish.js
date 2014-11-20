Meteor.publish('everything', function(){
  if (this.userId)
    return [Emails.find()]
})

Meteor.publish('attendees', function (trainingId) {
  return Attendees.find({trainingId: trainingId}, {fields: {avatar: 1, createdAt: 1}})
})