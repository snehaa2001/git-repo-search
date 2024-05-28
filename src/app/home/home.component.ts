import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  searchForm: FormGroup;
  searchResults: any[] = [];
  loading = false;
  error: string | null = null;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.searchForm = this.fb.group({
      username: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.searchForm.valid) {
      const username = this.searchForm.value.username;
      this.loading = true;
      this.error = null;
      this.http.get(`https://api.github.com/users/${username}`).subscribe(
        (userData: any) => {
          this.http.get<any[]>(userData.repos_url).subscribe(
            (repoData: any[]) => {  
              this.searchResults = [{ user: userData }, ...repoData];
              this.loading = false;
            },
          );
        },
      );
    }
  }
}
