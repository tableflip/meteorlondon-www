Router.map(function () {
  this.route('login', {path: '/login', template: 'login'})
  this.route('home',  {path: '/', controller: 'HomeController', fastRender: true})
  this.route('admin', {path: '/admin', controller: 'AdminController', loginRequired: {name: 'login', shouldRoute: false} })
})