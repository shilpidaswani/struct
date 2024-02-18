import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { CanEnterGuard } from './gaurds/canEnter';
import { LoginRequiredGuard } from './gaurds/loginRequired';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'landing',
    pathMatch: 'full'
  },
  {
    path: 'landing',
    loadChildren: () => import('./screens/landing/landing.module').then( m => m.LandingPageModule),
    canActivate: [CanEnterGuard],
  },
  {
    path: 'register',
    loadChildren: () => import('./screens/registeration/registeration.module').then( m => m.RegisterationPageModule),
    canActivate: [CanEnterGuard],
  },
  {
    path: 'onboarding',
    loadChildren: () => import('./screens/onboarding/onboarding.module').then( m => m.OnboardingPageModule),
    canActivate: [CanEnterGuard]

  },
  {
    path: 'home',
    loadChildren: () => import('./screens/home/home.module').then( m => m.HomePageModule),
    canActivate: [LoginRequiredGuard]
  },
  {
    path: 'display-feed',
    loadChildren: () => import('./screens/display-feed/display-feed.module').then( m => m.DisplayFeedPageModule)
  },
  {
    path: 'event-component',
    loadChildren: () => import('./screens/event-component/event-component.module').then( m => m.EventComponentPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules, useHash: true })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
