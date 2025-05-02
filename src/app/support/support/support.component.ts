import { Component } from '@angular/core';
import { Router } from '@angular/router';
// Removed FontAwesome imports:
// import { faLaptop, faCreditCard, faQuestionCircle } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-support',
  templateUrl: './support.component.html',
  styleUrls: ['./support.component.css']
})
export class SupportComponent {
  constructor(private router: Router) {}
  searchQuery: string = '';

  // --- Option 1: Using Emojis ---
  // Define simple string representations (emojis) for each category
  // Note: Ensure your project/browser supports rendering these correctly.
  categoryIcons: { [key: string]: string } = { // Type changed to string
    'Technical Support': '💻',  // Laptop emoji
    'Billing and Account': '💳', // Credit Card emoji
    'FAQ': '❓',              // Question Mark emoji
  };

  // --- Option 2: Using Placeholders for SVGs or Image Paths ---
  /*
  categoryIcons: { [key: string]: string } = { // Type is string
    'Technical Support': '/assets/icons/laptop.svg', // Example path
    'Billing and Account': '/assets/icons/credit-card.png', // Example path
    'FAQ': 'M10 18a8 8 0 100-16 8 8 0 000 16zm-1-9a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1zm1-4a1 1 0 011 1v3a1 1 0 11-2 0V6a1 1 0 011-1z', // Example SVG path data (needs <svg> wrapper in template)
    // Or you could store full inline SVG strings here
  };
  */

  categories: string[] = [
    'Technical Support',
    'Billing and Account',
    'FAQ',
  ];

  selectedCategory: string = '';

  categoryRoutes: { [key: string]: string } = {
    'Technical Support': '/support/technical',
    'Billing and Account': '/support/sub-pay',
    'FAQ': '/support/faq',
  };

  onSearch() {
    if (this.searchQuery) {
      console.log('Search for:', this.searchQuery);
      // You can integrate this with a service for search results
    }
  }

  onCategorySelect(category: string) {
    this.selectedCategory = category;
    const route = this.categoryRoutes[category];
    if (route) {
      this.router.navigate([route]);
    }
  }

  // Method now returns a string (emoji, path, or SVG data)
  getCategoryIcon(category: string): string {
    // Provide a default empty string or a default icon string if needed
    return this.categoryIcons[category] || '';
  }
}