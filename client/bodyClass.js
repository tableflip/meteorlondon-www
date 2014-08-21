Meteor.startup(function(){

  // Add route to body
  var routes = Router.routes.map(function(r){return r.name}).join(' ')
  Deps.autorun(function(){
    var $body = $('body')
    $body.removeClass(routes)
    var currentRoute = Router.current()
    if (currentRoute && currentRoute.route && currentRoute.route.name){
      $body.addClass(currentRoute.route.name)
    }
  })
})
