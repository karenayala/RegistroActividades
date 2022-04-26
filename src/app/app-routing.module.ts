import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ClientesComponent } from './Clientes/clientes/clientes.component';
import { FormComponent } from './Clientes/form/form.component';


const routes: Routes = [
  {path:'', redirectTo: '/users', pathMatch:'full'},
  {path:'users', component:ClientesComponent},
  {path:'users/page/:page', component:ClientesComponent},
  {path:'users/form', component:FormComponent},
  {path:'users/form/:id', component:FormComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
