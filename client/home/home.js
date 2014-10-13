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
  'click nav .logo a': function (evt, tpl) {
    evt.preventDefault()
    scrollToTop()
  },
  'click nav a': function (evt, tpl) {
    a = $(evt.target)
    scrollToHash(a.attr('href'));
  },
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

var scrollToHash = function  (hash, time) {
  if(hash === "/") return
  hash = hash || window.location.hash;
  time = time || 200
  var $hash = $(hash)
  if ($hash.length) {
    $('html, body').animate({
      scrollTop: $(hash).offset().top
    }, time);
  }
}

var scrollToTop = function  (time) {
  time = time || 200
  $('body').animate({
    scrollTop: 0
  }, time);
}


Meteor.startup(scrollToHash);
