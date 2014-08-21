Meteor.publish('everything', function(){
  if (this.userId)
    return [Emails.find()]
})