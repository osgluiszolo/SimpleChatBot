import { Routes } from '@angular/router';
import { ChatInterfaceComponent } from './components/chat-interface/chat-interface.component';

export const routes: Routes = [
  { path: '', component: ChatInterfaceComponent },
  { path: '**', redirectTo: '' }
];
