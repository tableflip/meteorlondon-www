HomeController = RouteController.extend({
  template: 'home',
  onRun: function(){
    if (!Meteor.user()){
      ga('send', 'pageview')
    }
  }
})

Template.home.helpers({
  email: function () {
    return Session.get('email')
  }
})

Template.home.events({
  'submit .register': function (evt, tmpl) {
    evt.preventDefault()

    var email = $('#input-email').val()
    var runEvents = $('#run-events:checked').length ? true : false

    if(email) {
      Session.set('email', email)

      Emails.insert({
        email: email,
        runEvent: runEvents,
        createdAt: Date.now()
      })

      ga('send', 'event', 'submit-email', email)

    } else {
      console.error('No email provided')
      ga('send', 'event', 'submit-email-error')
    }
  }
})