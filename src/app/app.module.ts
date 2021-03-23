import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { RoutingModule } from './routing.module';
import { ProductModule } from './products/product.module';
import { ProductRoutingModule } from './products/product-routing.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MockApiInterceptor } from './http/mock-api-interceptor.interceptor';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    RoutingModule,
    ProductModule,
    ProductRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: MockApiInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
