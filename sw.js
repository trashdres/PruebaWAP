/*Imports*/
importScripts('js/sw-utils.js');

const CACHE_ESTATICO = 'static-v2';
const CACHE_DINAMICO = 'dynamic-v1';
const CACHE_INMUTABLE = 'inmutable-v1';

const APP_SHELL = [
	'/',
	'index.html',
	'css/style.css',
	'img/favicon.ico',
	'img/avatars/hulk.jpg',
	'img/avatars/ironman.jpg',
	'img/avatars/spiderman.jpg',
	'img/avatars/thor.jpg',
	'img/avatars/wolverine.jpg',
	'js/app.js'
];
const APP_SHELL_INMUTABLE = [
	'https://fonts.googleapis.com/css?family=Quicksand:300,400',
	'https://fonts.googleapis.com/css?family=Lato:400,300',
	'https://use.fontawesome.com/releases/v5.3.1/css/all.css',
	'css/animate.css',
	'js/libs/jquery.js'
];
self.addEventListener('install', e =>{
	const cacheStatic = caches.open(CACHE_ESTATICO).then( cache => cache.addAll( APP_SHELL ));
	const cacheInmutable = caches.open(CACHE_INMUTABLE).then( cache => cache.addAll(APP_SHELL_INMUTABLE ));
	e.waitUntil( Promise.all([ cacheStatic, cacheInmutable ]));
});
self.addEventListener('activate', e =>{
	const activacion = caches.keys().then( llaves =>{
		llaves.forEach( llave =>{
			if( llave !== CACHE_ESTATICO && llave.includes('static') ){
				return caches.delete(llave);
			}
		})
	});
	e.waitUntil( activacion );
});
self.addEventListener('fetch', e =>{
	const resp1 = caches.match( e.request ).then( res =>{
		if(res){
			return res;
		}else{
			return fetch( e.request ).then( res2 =>{
				return updateCacheDinamico( CACHE_DINAMICO, e.request, res2 );
			});
		}
	});
	e.respondWith( resp1 );
    // 2 - Cache whith Network Fallback : Busca en el cache y si no encuentra va a la web
        // const cacheresp2 = caches.match( e.request ).then( resp =>{
        //     if(resp) return resp;
        //     // No existe el archivo, se debe ir a la web
        //     console.log("No existe", e.request.url);
        //     return fetch(e.request).then( respfetch =>{
        //         caches.open(NOMBRE_CACHE_DINAMICO).then( cache =>{
        //             cache.put( e.request, respfetch);
        //             limpiarCache(NOMBRE_CACHE_DINAMICO, 5);
        //         });
        //         return respfetch.clone();
        //     });
        // });
        // e.respondWith( cacheresp2 );
    // 3 - Network whith Cache Fallback : Busca en internet y luego en chache
        // const respt3 = fetch(e.request).then( resp =>{
        //     console.log('Fetch :>> ', resp);
        //     caches.open( NOMBRE_CACHE_DINAMICO ).then( cache =>{
        //         cache.put( e.request, resp);
        //         limpiarCache(NOMBRE_CACHE_DINAMICO, LIMITE_CACHE_DINAMICO);
        //     });

        //     return resp.clone();
        // }).catch( err =>{
        //     return caches.match( e.request );
        // });
        // e.respondWith( respt3 );
    // 4 - Cache whith Network Update : Busca en cache y luego actualiza el cache, carga rapido y muestra lo mas actualizado
        // if( e.request.url.includes('bootstrap') ){
        //     return e.respondWith( caches.match( e.request ));
        // }
        // const resp4 = caches.open( NOMBRE_CACHE_ESTATICO ).then( cache =>{
        //     fetch(e.request).then( newResp =>{
        //         cache.put( e.request, newResp );
        //     });
        //     return cache.match( e.request );
        // });

        // e.respondWith( resp4 );
    // 5 - Cache & Network race : Busca en cache y la red al mismo tiempo, carga rapido y muestra lo mas actualizado
		// const resp5 = new Promise( (resolve, reject) =>{
		// 	let rechazada = false;

		// 	const falloUnaVez = () =>{
		// 		if( rechazada ){
		// 			if( /\.(png|jpg)$/i.test( e.request.url ) ){
		// 				resolve( caches.match('/img/logo.png') );
		// 			}else{
		// 				reject('No se encontro respuesta');
		// 			}
		// 		}else{
		// 			rechazada = true;
		// 		}
		// 	};

		// 	fetch( e.request ).then( resp =>{
		// 		resp.ok ? resolve(resp) : falloUnaVez();
				
		// 	}).catch( falloUnaVez );

		// 	caches.match( e.request ).then( resp =>{
		// 		resp ? resolve( resp ) : falloUnaVez();
		// 	}).catch( falloUnaVez );
		// });
		
		// e.respondWith( resp5 );
});