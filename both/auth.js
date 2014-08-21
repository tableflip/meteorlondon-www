var adminDomains = ['driift.io', 'tableflip.io', 'wwaves.co', 'cwaring.com' ]

Auth = {

  // Check the email is part of a domain configured with admin rights
  verifyEmail: function  (email) {
    if (!email.verified) return false

    var emailDomain = email.address.split('@')[1]

    return adminDomains.some(function (adminDomain) {
      return emailDomain === adminDomain
    })
  },

  // Check it a user or userId has a meteor-developer account with a verified email on an admin domain
  canHasAccess: function (user) {
    if (typeof user === 'string') user = Meteor.users.findOne(user)

    if (!user) return false

    if (!user.services['meteor-developer'].emails) return false

    return user.services['meteor-developer'].emails.some(Auth.verifyEmail)
  }

}

if(Meteor.isServer) {
  // Only allow logins for `adminDomain` users
  Accounts.validateLoginAttempt(function (info) {
    return Auth.canHasAccess(info.user)
  })
}
