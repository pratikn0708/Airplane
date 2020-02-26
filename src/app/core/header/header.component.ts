import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  private flag = '';
  constructor(private router: Router, private authService: AuthService) {
    const url: string = window.location.href;
    this.activeLink = '';

    if (url.includes('flights')) {
      this.activeLink = 'flights';
    } else if (url.includes('about')) {
      this.activeLink = 'about';
    } else if (url.includes('login')) {
      this.activeLink = 'login';
    }
    this.flag = this.authService.fetchAuthStatusListener();
  }

  activeLink: string;

  ngOnInit(): void {
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((e: NavigationEnd) => {
        this.flag = this.authService.fetchAuthStatusListener();
        this.activeLink = e.url;
      });
  }

  handleNavigation(location: string): void {
    this.router.navigate([`/${location}`]);
    this.activeLink = location;
    this.flag = this.authService.fetchAuthStatusListener();
  }

}
