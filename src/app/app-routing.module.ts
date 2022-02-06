import { AdminManageHostListComponent } from './admin-manage-host-list/admin-manage-host-list.component';
import { AdminManageLocationBlogNewComponent } from './admin-manage-location-blog-new/admin-manage-location-blog-new.component';
import { AdminManageSettingComponent } from './admin-manage-setting/admin-manage-setting.component';
import { AdminManageLocationBlogListComponent } from './admin-manage-location-blog-list/admin-manage-location-blog-list.component';
import { AdminManageLocationFoodListComponent } from './admin-manage-location-food-list/admin-manage-location-food-list.component';
import { AdminManageLocationListComponent } from './admin-manage-location-list/admin-manage-location-list.component';
import { AdminManageAccountListComponent } from './admin-manage-account-list/admin-manage-account-list.component';
import { AdminComponent } from './admin/admin.component';
import { HostHomestayBookingDetailComponent } from './host-homestay-booking-detail/host-homestay-booking-detail.component';
import { HostHomestayFeedbackComponent } from './host-homestay-feedback/host-homestay-feedback.component';
import { HostHomestayNewComponent } from './host-homestay-new/host-homestay-new.component';
import { HostHomestayDetailComponent } from './host-homestay-detail/host-homestay-detail.component';
import { HostRevenueComponent } from './host-revenue/host-revenue.component';
import { HostBookingRequestListComponent } from './host-booking-request-list/host-booking-request-list.component';
import { HostHomestayListComponent } from './host-homestay-list/host-homestay-list.component';
import { HostComponent } from './host/host.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { ProfileComponent } from './profile/profile.component';
import { RegisterComponent } from './register/register.component';
import { AuthComponent } from './auth/auth.component';
import { HomeComponent } from './home/home.component';
import { HomestayDetailComponent } from './homestay-detail/homestay-detail.component';
import { SignseeingHomestayComponent } from './signseeing-homestay/signseeing-homestay.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BookingComponent } from './booking/booking.component';
import { PlaceHomestayComponent } from './place-homestay/place-homestay.component';
import { BlogListComponent } from './blog-list/blog-list.component';
import { BlogDetailComponent } from './blog-detail/blog-detail.component';
import { MyBookingComponent } from './my-booking/my-booking.component';
import { LoginComponent } from './login/login.component';
import { ForgotPassComponent } from './forgot-pass/forgot-pass.component';
import { RecoverPassComponent } from './recover-pass/recover-pass.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { HostHomestayDetailMenuComponent } from './host-homestay-detail-menu/host-homestay-detail-menu.component';
import { HomeSearchListComponent } from './home-search-list/home-search-list.component';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import { AdminManageLocationBlogDetailComponent } from './admin-manage-location-blog-detail/admin-manage-location-blog-detail.component';

const routes: Routes = [
  {path: '', component: HomeComponent, pathMatch: 'full'},
  {path: 'home', component: HomeComponent},
  {path: 'about', component: AboutComponent},
  {path: 'contact', component: ContactComponent},
  {path: 'place', component: PlaceHomestayComponent},
  {path: 'sightseeing', component: SignseeingHomestayComponent},
  {path: 'homestay-detail', component: HomestayDetailComponent},
  {path: 'booking', component: BookingComponent},
  {path: 'blog-list', component: BlogListComponent},
  {path: 'blog-detail', component: BlogDetailComponent},
  {path: 'my-booking', component: MyBookingComponent},
  {path: 'searching-found', component: HomeSearchListComponent},
  {path: 'profile', component: ProfileComponent,
    children: [
      {path: '', component: PageNotFoundComponent},
      {path: 'edit', component: EditProfileComponent},
      {path: 'change-password', component: ChangePasswordComponent},
    ],
  },
  {path: 'host', component: HostComponent,
    children: [
      {path: '', component: PageNotFoundComponent},
      {path: 'homestay-list',
        children: [
          {path: '', component: HostHomestayListComponent},
          {path: 'add', component: HostHomestayNewComponent},
          {path: 'detail', component: HostHomestayDetailMenuComponent,
            children: [
              {path: 'edit', component: HostHomestayDetailComponent},
              {path: 'feedback', component: HostHomestayFeedbackComponent},
            ],
          },
        ],
      },
      {path: 'booking-request',
        children: [
          {path: '', component: HostBookingRequestListComponent},
          {path: 'detail', component: HostHomestayBookingDetailComponent},
        ],
      },
      {path: 'revenue', component: HostRevenueComponent},
    ],
  },
  {path: 'auth', component: AuthComponent,
    children: [
      {path: '', component: PageNotFoundComponent},
      {path: 'login', component: LoginComponent},
      {path: 'forgot-password', component: ForgotPassComponent},
      {path: 'recover-password', component: RecoverPassComponent},
      {path: 'register', component: RegisterComponent},

    ],
  },
  {path: 'admin', component: AdminComponent,
    children: [
      {path: '', component: AdminManageAccountListComponent},
      {path: 'account-host-list', component: AdminManageHostListComponent},
      {path: 'account-list', component: AdminManageAccountListComponent},
      {path: 'location-list', component: AdminManageLocationListComponent},
      {path: 'food-list', component: AdminManageLocationFoodListComponent},
      {path: 'blog-list',
        children: [
          {path: '', component: AdminManageLocationBlogListComponent},
          {path: 'add', component: AdminManageLocationBlogNewComponent},
          {path: 'detail', component: AdminManageLocationBlogDetailComponent},
        ]
      },
      {path: 'setting-website', component: AdminManageSettingComponent},
    ],
  },
  {path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
