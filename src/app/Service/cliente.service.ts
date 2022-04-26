import { Injectable } from '@angular/core';
import { formatDate, DatePipe } from '@angular/common';
import { User } from '../Clientes/interfaces/user';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, catchError, tap } from 'rxjs/operators';
import swal from 'sweetalert2';
import { Router } from '@angular/router';
import {Departaments} from '../Clientes/interfaces/cities';
import {Empleados} from '../Clientes/interfaces/empleados';

@Injectable({

  providedIn: 'root'
})
export class ClienteService {

  //URL de conexion a la api-rest
  private urlEndPoint:string = 'http://localhost:8080/api/users';


  //URL de conexion api-rest interfaces colombia
  private urlEndPointCities:string='https://raw.githubusercontent.com/marcovega/colombia-json/master/colombia.min.json';


  //httpHeaders
  private httpHeaders = new HttpHeaders({'Content-type':'application/json'});

  constructor(private http: HttpClient, private router:Router) { }

  /**
   * Obtiene un cliente por su id
   * @param id hace referencia al id del cliente que se quiere obtener
   */
  getCliente(id:String):Observable<User>{
    return this.http.get<User>(this.urlEndPoint+'/'+id).pipe(
      catchError(e => {
        this.router.navigate(['users']);
        console.log(e.error.mensaje);
        swal.fire('Error al editar', e.error.mensaje, 'error');
        return throwError(e);
      })
    );
  }
  getEmpleados():Observable<any>{
    return this.http.get<any>(this.urlEndPoint+'/empleados').pipe(
      catchError(e => {
        this.router.navigate(['users']);
        console.log(e.error.mensaje);
        swal.fire('Error al editar', e.error.mensaje, 'error');
        return throwError(e);
      })
    );
  }


  /**
   * Obtiene listado de actividades de la APIREST
   */
  getClientes():Observable<any>{
    return this.http.get(this.urlEndPoint).pipe(
      tap((response:any) => {
        console.log('ClienteService: tap 1');
        (response as User[]).forEach(cliente => {
          console.log(cliente.titulo_actividad);
        })
      }),
      map((response:any) => {
        (response as User[]).map(cliente => {
          cliente.titulo_actividad = cliente.titulo_actividad.toUpperCase();
          let datePipe = new DatePipe('es');
          cliente.fecha_ejecucion = datePipe.transform(cliente.fecha_ejecucion, 'EEEE dd, MMMM yyyy')
          return cliente;
        });
        return response;
      }),
      tap(response => {
        console.log('ClienteService: tap 2');
        (response as User[]).forEach(cliente => {
          console.log(cliente.titulo_actividad);
        })
      })
    );
  }

  /**
   * Enviar peticio post al back para guardar un cliente
   * @param cliente hace referencia al cliente que se captura en el formulario
   */
  create(cliente:User): Observable<User>{
    return this.http.post(this.urlEndPoint, cliente, {headers: this.httpHeaders}).pipe(
      map((response:any) => response.cliente as User),
      catchError(e => {
        if(e.status==400){
          return throwError(e);
        }
        console.log(e.error.mensaje)
        swal.fire(e.error.mensaje, "Error consumiendo el servicio usuarios", 'error');
        return throwError(e);
      })
    );
  }

  /**
   * Metodo que hace peticion al api rest para actualizar un cliente
   * @param cliente hace referencia a los datos que se actualizaron en el formulario
   */
  update(cliente:User): Observable<User>{
    return this.http.put<User>(this.urlEndPoint+'/'+cliente.id, cliente, {headers: this.httpHeaders}).pipe(
      catchError(e => {
        if(e.status==400){
          return throwError(e);
        }
        console.log(e.error.mensaje)
        swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    );
  }

  /**
   * Metodo que hace peticion al api rest para eliminar un cliente
   * @param id hace referencia al id del cliente que se eliminara
   */
  delete(cliente:User): Observable<User>{
    return this.http.delete<User>(this.urlEndPoint+'/'+cliente.id, {headers: this.httpHeaders}).pipe(
      catchError(e => {
        console.log(e.error.mensaje)
        swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    );
  }

  /**
   * Obtiene listado de interfaces de la APIREST cities
   */
  getCiudades():Observable<Departaments[]>{
    return this.http.get<Departaments[]>(this.urlEndPointCities).pipe(
      catchError(e => {
        console.log(e.error.mensaje)
        swal.fire(e.error.mensaje, "Error consumiendo el servicio ciudades ", 'error');
        return throwError(e);
      })
    );
  }
}
