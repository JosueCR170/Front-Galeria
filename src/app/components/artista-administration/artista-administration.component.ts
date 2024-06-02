import { Component } from '@angular/core';
import { ObraService } from '../../services/obra.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Obra } from '../../models/Obra';

@Component({
  selector: 'app-artista-administration',
  standalone: true,
  imports: [],
  templateUrl: './artista-administration.component.html',
  styleUrl: './artista-administration.component.css'
})
export class ArtistaAdministrationComponent {
  flag: boolean = false;
  obras: Obra[] = [];
  obrasPorArtista: any[] = [];
  public status: number;
  public obra: Obra;
  selectedArtistId: number = 1;
  constructor(
    private _obraService: ObraService,
    private _router: Router,
    private _routes: ActivatedRoute
  ) {
    this.status = -1;
    this.obra = new Obra(1, 1, "", "", "", 1, true, "", null, null, null);
  }


  ngOnInit(): void {
    this.index();
  }

  index() {
    this._obraService.index().subscribe({
      next: (response: any) => {
        this.obras = response['data'];
        this.filterObrasByArtista(this.selectedArtistId);
      },
      error: (err: Error) => {
        console.error('Error al cargar las obras', err);
      }
    });
  }

  filterObrasByArtista(idArtista: number) {
    this.obrasPorArtista = this.obras.filter(obra => obra.idArtista === idArtista);
  }

  showHome(show: boolean) {
    this.flag = show;
  }

}
