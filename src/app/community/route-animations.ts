import { 
    trigger,
    transition,
    style,
    query,
    animate
  } from '@angular/animations';
  
  export const fadeAnimation = trigger('routeAnimations', [
    transition('* <=> *', [
      query(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' })
      ], { optional: true }),
      query(':leave', [
        animate('300ms ease', style({ opacity: 0 }))
      ], { optional: true }),
      query(':enter', [
        animate('400ms 100ms ease', 
          style({ opacity: 1, transform: 'translateY(0)' }))
      ], { optional: true })
    ])
  ]);