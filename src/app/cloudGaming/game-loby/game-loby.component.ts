import { Component, OnInit } from '@angular/core';
import { CloudService } from '../services/cloud.service';

@Component({
  selector: 'app-game-loby',
  templateUrl: './game-loby.component.html',
  styleUrls: ['./game-loby.component.css']
})


  export class GameLobyComponent implements OnInit {
    instances: any[] = [];
    onlineInstances: any[] = [];
    gameId: number = 1; // Valeur par défaut (modifiable depuis l'interface)
  
    constructor(private cloudService: CloudService) {}
  
    ngOnInit(): void {
      this.loadInstances();
      this.loadOnlineInstances();
    }
  
    loadInstances(): void {
      this.cloudService.getInstancesAll().subscribe(data => {
        this.instances = data;
      });
    }
  
    loadOnlineInstances(): void {
      this.cloudService.getInstancesOnline().subscribe(data => {
        this.onlineInstances = data;
      });
    }
  
    launchInstance(): void {
      this.cloudService.postInstances(this.gameId).subscribe({
        next: (res) => {
          console.log('Instance launched:', res);
          this.loadInstances();
          this.loadOnlineInstances();
        },
        error: (err) => console.error('Erreur lancement:', err)
      });
    }
  }


