import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {environment} from "../../../environments/environment";

@Component({
  selector: 'app-bootstrap-carousel',
  templateUrl: './bootstrap-carousel.component.html',
  styleUrls: ['./bootstrap-carousel.component.css'],
  encapsulation: ViewEncapsulation.Emulated
})
export class BootstrapCarouselComponent implements OnInit{
  @Input() imageUrls: string[] = [];
  baseUrl: string = environment.apiUrlImg;

  ngOnInit(): void {
    if (!document.querySelector('script[src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"]')) {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }
}
