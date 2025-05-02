import { Component, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import { ChatBotService } from '../services/chat.service';

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css']
})
export class ChatbotComponent implements AfterViewChecked {
  @ViewChild('chatBox') private chatBox!: ElementRef;

  isChatOpen = false;
  userMessage = '';
  messages: {
    sender: 'user' | 'bot';
    text: string;
    options?: string[];
  }[] = [];
  
  chatContext = {
    language: 'English',
    reclamationInProgress: false
  };

  constructor(private deepSeek: ChatBotService) {
    this.initializeChat();
  }

  ngAfterViewChecked() {
    // This ensures that the scroll happens after Angular checks the view.
    this.scrollToBottom();
  }

  initializeChat() {
    this.messages.push({
      sender: 'bot',
      text: 'Welcome to GameMax Support! How can I help you today?',
      options: [
        'File a reclamation',
        'Troubleshoot issue',
        'Ask about features'
      ]
    });
  }

  toggleChat() {
    this.isChatOpen = !this.isChatOpen;
    if (this.isChatOpen) {
      setTimeout(() => this.scrollToBottom(), 100);
    }
  }

  sendMessage() {
    if (!this.userMessage.trim()) return;

    this.messages.push({
      sender: 'user',
      text: this.userMessage
    });

    this.deepSeek.getChatResponse(this.userMessage, this.messages).subscribe(response => {
      const options = this.extractOptions(response);
      this.messages.push({
        sender: 'bot',
        text: response,
        options: options.length ? options : undefined
      });
      // Scroll after receiving bot response
    });

    this.userMessage = '';
  }

  onOptionClick(option: string) {
    this.userMessage = option;
    this.sendMessage();
  }

  private extractOptions(text: string): string[] {
    const optionRegex = /\n\d\)\s*(.+)/g;
    const options = [];
    let match;
    
    while ((match = optionRegex.exec(text)) !== null) {
      options.push(match[1]);
    }
    
    return options.slice(0, 3); // Return max 3 options
  }

  private scrollToBottom() {
    try {
      this.chatBox.nativeElement.scrollTop = this.chatBox.nativeElement.scrollHeight;
    } catch (err) { 
      console.error("Error scrolling to bottom: ", err); 
    }
  }
}
