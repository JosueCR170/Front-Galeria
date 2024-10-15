import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router'; 
import { User } from '../../models/user';
import Swal from 'sweetalert2';
import { UserService } from '../../services/user.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [RouterModule, FormsModule],
  templateUrl: './courses.component.html',
  styleUrl: './courses.component.css'
})
export class CoursesComponent {

  constructor(private router: Router,
    private userService: UserService) {}
  user: any;
  userAux = new User(1, "", false, "", "", null, "");

  ngOnInit(): void { ;
    this.loadLoggedUser();
  }

  navigateTo(course: string) {
    this.router.navigate([`courses/${course}`]);
  }

  loadLoggedUser() {
    this.user = sessionStorage.getItem('identity');
    console.log('User', this.user);
    this.user = JSON.parse(this.user);
    //console.log('User',this.user);
    this.userAux = { ...this.user };
  }
  
  loadAdmin() {
    this.router.navigate(['/admin'])
  }
  logOut() {
    sessionStorage.clear();
    this.router.navigate([''])
  }
  resetUserData() {
    this.user = { ...this.userAux };
  }

  updateUser() {
    this.user.id = this.user.iss;
    console.log('User antes de ', this.user);
    this.userService.update(this.user).subscribe({
      next: (response: any) => {
        console.log('Usuario actualizado', response);
        this.msgAlert('updated user', '', 'success');
        //this.loadLoggedUser();

        let storedUserInfo = sessionStorage.getItem('identity');
        let userInfo;
        if (storedUserInfo) {
          userInfo = JSON.parse(storedUserInfo);
        } else {
          // Proporcionar un objeto predeterminado en caso de que storedUserInfo sea null
          userInfo = {};
        }
        // Actualiza solo las propiedades necesarias
        userInfo.telefono = this.user.telefono;
        userInfo.nombre = this.user.nombre;
        // Guarda el objeto actualizado de nuevo en sessionStorage
        sessionStorage.setItem('identity', JSON.stringify(userInfo));
        location.reload();
        this.router.navigate(['/courses']);
        console.log('User', this.user);
        // console.log('UserAUX',this.userAux);
      },
      error: (err: any) => {
        console.error('Error al actualizar el usuario', err.error.message);
        this.msgAlert('error updating user', '', 'error');
      }
    });
  }


  msgAlert = (title: any, text: any, icon: any) => {
    Swal.fire({
      title,
      text,
      icon,
    })
  }
}
