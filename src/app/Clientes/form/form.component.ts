import {Component, OnInit} from '@angular/core';
import {User} from '../interfaces/user';
import {ClienteService} from 'src/app/Service/cliente.service';
import {Router, ActivatedRoute} from '@angular/router';
import swal from 'sweetalert2';
import {Departaments} from '../interfaces/cities';
import {Empleados} from '../interfaces/empleados';


@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {

  cliente: User = new User();
  empleados: Empleados[];
  errores: String[];
 



  constructor(private clienteService: ClienteService,
              private router: Router,
              private activatedRoute: ActivatedRoute,private serviceCliente:ClienteService) {
   
  }

  ngOnInit(): void {
    
    this.cargarCliente();
    this.serviceCliente.getEmpleados().subscribe(response => {
      this.empleados = response as Empleados[];
      
    });
  }

  /**
   * Metodo que se encarga de cargar en el formulario
   * los datos de las actividades que se desea editar, utilizando el clienteService
   */
  cargarCliente(): void {
    this.activatedRoute.params.subscribe(params => {
      let id = params['id'];
      if (id) {
        this.clienteService.getCliente(id).subscribe((cliente) => {
          this.cliente = cliente;
        });
      }
    });
  }


  /**
   * Metodo que hace la peticion a clienteService para crear un cliente
   */
  create(): void {
    if (this.cliente.titulo_actividad == undefined || this.cliente.descripcion == undefined || this.cliente.empleado == undefined
      || this.cliente.fecha_ejecucion == undefined || this.cliente.estado == undefined ){
      swal.fire(
        'Datos',
        'Todos los datos son obligatorios!',
        'error'
      );
    }else {
      this.cliente.fecha_ejecucion=this.cliente.fecha_ejecucion
      this.clienteService.create(this.cliente).subscribe(response => {
          this.router.navigate(['users']);
          swal.fire({
            position: 'center',
            icon: 'success',
            title: 'usuario registrado con éxito!',
            showConfirmButton: false,
            timer: 1500
          });
        },
        err => {
          this.errores = err.error.errors as string[];
          console.error('Codigo del error desde el backend: ' + err.status);
          console.error(err.error.errors);
        });
    }
  }

  update(): void {
    if (this.cliente.titulo_actividad == undefined || this.cliente.descripcion == undefined || this.cliente.empleado == undefined
      || this.cliente.fecha_ejecucion == undefined || this.cliente.estado == undefined ) {
      swal.fire(
        'Datos',
        'Todos los datos son obligatorios!',
        'error'
      );
    } else {
      this.clienteService.update(this.cliente).subscribe(response => {
          this.router.navigate(['/clientes']);
          swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Usuario actualizado con éxito!',
            showConfirmButton: false,
            timer: 1500
          });
        },
        err => {
          this.errores = err.error.errors as string[];
          console.error('Codigo del error desde el backend: ' + err.status);
          console.error(err.error.errors);
        });
    }
  }


}
