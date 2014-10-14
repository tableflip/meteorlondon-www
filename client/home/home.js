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

// Get scolling to anchor on page load working until this lands
// https://github.com/EventedMind/iron-router/commit/65b844eb0d988d93b1ac8a5bf54966d4dd2f0c46
Template.home.rendered = function () {
  scrollToHash()
}

var scrollToHash = function  (hash, time) {
  if(hash === "/") return
  hash = hash || window.location.hash;
  time = time || 200
  var $hash = $(hash)
  console.log('scrollToHash', hash, $hash.length)
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

// Meteor.startup(function() {
//   console.log('scrollToHash startup')
//   Meteor.setTimeout(scrollToHash, 100)
// })
