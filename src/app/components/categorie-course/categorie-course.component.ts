import { Component } from '@angular/core';
import { TallerService } from '../../services/taller.service';
import { ofertaService } from '../../services/oferta.service';
import { Taller } from '../../models/Taller';
import { Oferta } from '../../models/Oferta';

@Component({
  selector: 'app-categorie-course',
  standalone: true,
  imports: [],
  templateUrl: './categorie-course.component.html',
  styleUrl: './categorie-course.component.css'
})
export class CategorieCourseComponent {
/*Icons:
<span class="material-symbols-outlined"> apparel </span>  <-- fasion 
<span class="material-symbols-outlined"> brush </span> <-- arte
<span class="material-symbols-outlined">photo_camera</span> <--foto
<span class="material-symbols-outlined"> deployed_code </span> <-- 3D
<span class="material-symbols-outlined">person_check</span> <-- UX
*/
constructor(
  private _talleresService:TallerService,
  private _ofertaService:ofertaService
){}
courses: Taller[] = []
oferta: Oferta[] =[]

ngOnInit(): void { }

}
