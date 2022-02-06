import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import {NgxPaginationModule} from 'ngx-pagination';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ImageCropperModule } from 'ngx-image-cropper';
import { HttpClientModule } from '@angular/common/http';
import { QuillModule } from 'ngx-quill'

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { BookingComponent } from './booking/booking.component';
import { PlaceHomestayComponent } from './place-homestay/place-homestay.component';
import { SignseeingHomestayComponent } from './signseeing-homestay/signseeing-homestay.component';
import { HomestayDetailComponent } from './homestay-detail/homestay-detail.component';
import { HomeComponent } from './home/home.component';
import { MyBookingComponent } from './my-booking/my-booking.component';
import { BlogListComponent } from './blog-list/blog-list.component';
import { BlogDetailComponent } from './blog-detail/blog-detail.component';
import { LoginComponent } from './login/login.component';
import { AuthComponent } from './auth/auth.component';
import { ForgotPassComponent } from './forgot-pass/forgot-pass.component';
import { RecoverPassComponent } from './recover-pass/recover-pass.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { RegisterComponent } from './register/register.component';
import { ProfileComponent } from './profile/profile.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { HostComponent } from './host/host.component';
import { HostHomestayListComponent } from './host-homestay-list/host-homestay-list.component';
import { HostBookingRequestListComponent } from './host-booking-request-list/host-booking-request-list.component';
import { HostRevenueComponent } from './host-revenue/host-revenue.component';
import { HostHomestayDetailComponent } from './host-homestay-detail/host-homestay-detail.component';
import { HostHomestayNewComponent } from './host-homestay-new/host-homestay-new.component';
import { HostHomestayFeedbackComponent } from './host-homestay-feedback/host-homestay-feedback.component';
import { HostHomestayDetailMenuComponent } from './host-homestay-detail-menu/host-homestay-detail-menu.component';
import { HostHomestayBookingDetailComponent } from './host-homestay-booking-detail/host-homestay-booking-detail.component';
import { AdminComponent } from './admin/admin.component';
import { AdminManageAccountListComponent } from './admin-manage-account-list/admin-manage-account-list.component';
import { AdminManageLocationListComponent } from './admin-manage-location-list/admin-manage-location-list.component';
import { AdminManageLocationFoodListComponent } from './admin-manage-location-food-list/admin-manage-location-food-list.component';
import { AdminManageLocationBlogListComponent } from './admin-manage-location-blog-list/admin-manage-location-blog-list.component';
import { AdminManageSettingComponent } from './admin-manage-setting/admin-manage-setting.component';
import { AdminManageLocationBlogDetailComponent } from './admin-manage-location-blog-detail/admin-manage-location-blog-detail.component';
import { AdminManageLocationBlogNewComponent } from './admin-manage-location-blog-new/admin-manage-location-blog-new.component';
import { authInterceptorProviders } from './_helpers/auth.interceptor';
import { AdminManageSliderComponent } from './admin-manage-slider/admin-manage-slider.component';
import { HomeSearchListComponent } from './home-search-list/home-search-list.component';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import { AdminManageHostListComponent } from './admin-manage-host-list/admin-manage-host-list.component';
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    BookingComponent,
    PlaceHomestayComponent,
    SignseeingHomestayComponent,
    HomestayDetailComponent,
    HomeComponent,
    MyBookingComponent,
    BlogListComponent,
    BlogDetailComponent,
    LoginComponent,
    AuthComponent,
    ForgotPassComponent,
    RecoverPassComponent,
    PageNotFoundComponent,
    RegisterComponent,
    ProfileComponent,
    EditProfileComponent,
    ChangePasswordComponent,
    HostComponent,
    HostHomestayListComponent,
    HostBookingRequestListComponent,
    HostRevenueComponent,
    HostHomestayDetailComponent,
    HostHomestayNewComponent,
    HostHomestayFeedbackComponent,
    HostHomestayDetailMenuComponent,
    HostHomestayBookingDetailComponent,
    AdminComponent,
    AdminManageAccountListComponent,
    AdminManageLocationListComponent,
    AdminManageLocationFoodListComponent,
    AdminManageLocationBlogListComponent,
    AdminManageSettingComponent,
    AdminManageLocationBlogDetailComponent,
    AdminManageLocationBlogNewComponent,
    AdminManageSliderComponent,
    HomeSearchListComponent,
    AboutComponent,
    ContactComponent,
    AdminManageHostListComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgxPaginationModule,
    FormsModule,
    ReactiveFormsModule,
    ImageCropperModule,
    HttpClientModule,
    QuillModule.forRoot(),
  ],
  providers: [authInterceptorProviders],
  bootstrap: [AppComponent]
})
export class AppModule { }
