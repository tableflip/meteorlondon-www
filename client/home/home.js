HomeController = RouteController.extend({
  template: 'home',
  onRun: function(){
    if (!Meteor.user()){
      ga('send', 'pageview')
    }
  },
  onBeforeAction: function () {
    Meteor.subscribe('attendees', Session.get('trainingId'))
  }
})

Template.home.helpers({
  email: function () {
    return Session.get('email')
  },
  spotsLeft: function () {
    var spots = Session.get('trainingCapacity') - Attendees.find({}).count()
    return spots < 0 ? 0 : spots
  },
  isWaitlist: function () {
    var spots = Session.get('trainingCapacity') - Attendees.find({}).count()
    return spots < 0
  },
  attendees: function () {
    var index = 0
    var capacity = Session.get('trainingCapacity')

    var attendees = Attendees.find({}, {
      limit: capacity,
      sort: [['createdAt', 'asc']]
    }).map(function (a) {
      a.index = index++
      return a
    })

    var spaces = capacity - attendees.length
    var createEmptyAttendee = function () { return {index: index++} }

    return attendees.concat(range(spaces, createEmptyAttendee))
  },
  waitlist: function () {
    var capacity = Session.get('trainingCapacity')

    var attendees = Attendees.find({}, {
      sort: [['createdAt', 'asc']]
    }).fetch().slice(capacity)

    return attendees
  },
  zeroMod: function (num, modulo) {
    return num % modulo == 0
  }
})

function range (size, callback) {
  var arr = []
  for (var i = 0; i < size; i ++) {
    arr.push(callback(i))
  }
  return arr
}

Template.home.events({
  'click nav .logo a': function (evt, tpl) {
    scrollToTop()
  },
  'click nav a, click #tickets .btn-ticket': function (evt, tpl) {
    var a = $(evt.currentTarget)
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
  },
  'submit #next form': function (e) {
    e.preventDefault()

    var email = $('#next-email').val()

    var data = {
      trainingId: Session.get('trainingId'),
      email: email,
      avatar: 'https://en.gravatar.com/avatar/' + CryptoJS.MD5(email) + '?d=retro',
      availability: $('#next form input:checked').toArray().map(function (input) {
        console.log(input)
        return input.value
      })
    }

    Attendees.insert(data)

    var thanks = $('<h3>Thanks!</h3>').css('opacity', 0)

    $('#next form')
      .animate({height: 0, opacity: 0}, 500, function () {
        thanks.animate({opacity: 1}, 500)
      })
      .after(thanks)
  }
})

// Get scolling to anchor on page load working until this lands
// https://github.com/EventedMind/iron-router/commit/65b844eb0d988d93b1ac8a5bf54966d4dd2f0c46
Template.home.rendered = function () {
  scrollToHash()
  Session.set('trainingId', $('input[name=training-id]').val())
  Session.set('trainingCapacity', parseInt($('input[name=training-capacity]').val()))
}

var scrollToHash = function  (hash, time) {
  if(hash === "/") return
  hash = hash || window.location.hash;
  time = time || 200
  var $hash = $(hash)
  console.log('scrollToHash', hash, $hash.length)
  if ($hash.length) {
    $('html, body').animate({
      scrollTop: $hash.offset().top
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
