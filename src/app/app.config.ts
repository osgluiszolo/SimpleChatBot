import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { FilterByCategoryPipe } from './pipes/filter-by-category.pipe';
import { ChatInterfaceComponent } from './components/chat-interface/chat-interface.component';
import { OrderService } from './services/order.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    FormsModule,
    FilterByCategoryPipe,
    ChatInterfaceComponent,
    OrderService
  ]
};
