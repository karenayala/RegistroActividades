import { Component, OnInit } from '@angular/core';
import { User } from '../interfaces/user';
import { ClienteService } from 'src/app/Service/cliente.service';
import swal from 'sweetalert2';
import { tap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import {Empleados} from '../interfaces/empleados';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit {

  clientes:User[];
  emple:Empleados[];
  paginador: any;
  constructor(private serviceCliente:ClienteService,
              private activatedRoute:ActivatedRoute) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe( params => {
      let page:number = +params.get('page');
      if(!page){
        page = 0;
      }
      this.serviceCliente.getClientes().pipe(
        tap(response => {
          console.log('ClienteComponent: tap 3');
          (response as User[]).forEach(cliente => {
            console.log(cliente.titulo_actividad);
          });
        })
      ).subscribe(response => {
        this.clientes = response as User[];
        this.paginador = response;
      });
    });

    this.serviceCliente.getEmpleados().pipe(
      tap(response => {
        console.log('ClienteComponent: tap 3');
        (response as Empleados[]).forEach(emp => {
          console.log(emp.nombre);
        });
      })
    ).subscribe(response => {
      this.emple = response as Empleados[];
      this.paginador = response;
    });

  }


  /**
   * Metodo que se encarga de invocar el metodo delete para eliminar un cliente
   * @param cliente hace referencia al cliente que se eliminara
   */
  delete(cliente:User): void{
    swal.fire({
      title: '¿Esta Seguro?',
      text: "No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Eliminar'
    }).then((result) => {
      if (result.value) {
        this.serviceCliente.delete(cliente).subscribe(response=>{
          this.clientes = this.clientes.filter(cli => cli !== cliente)
          swal.fire(
            'Eliminado',
            'Cliente eliminado con éxito!',
            'success'
          );
        });
      }
    });
  }
}
