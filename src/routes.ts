interface IApiPaths {
  url: string;
  router: string;
}

export const ApiPaths: IApiPaths[] = [
  //Cuando creemos un archivo en la carpeta de router debemos crear nuestra ruta acá para que pueda ser accesible desde una petición
  //Ejemplo:  { url: "/example", router: "example.route" }
  //url: url del endpoint, router: nombre del archivo sin la extención del "ts"
  { url: '/auth', router: 'auth.route' },
  { url: '/order', router: 'order.route' },
  { url: '/package', router: 'package.route' },
  { url: '/driver', router: 'driver.route' },
  { url: '/customer', router: 'customer.route' },
  { url: '/application', router: 'application.route' },
  { url: '/truck', router: 'truck.route' },
  { url: '/feedback', router: 'feedback.route' },
  { url: '/pay', router: 'pay.route' },
  { url: '/users', router: 'user.route' },
];
