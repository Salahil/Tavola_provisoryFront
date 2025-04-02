import { Component, inject } from '@angular/core';
import { DefaultLoginLayoutComponent } from '../../components/default-login-layout/default-login-layout.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { ToastrService } from 'ngx-toastr';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

interface LoginForm {
  email: FormControl;
  password: FormControl;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    DefaultLoginLayoutComponent,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule
  ],
  providers: [
    LoginService
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup<LoginForm>;

  // ✅ Nova forma de injeção no Angular 19
  private router = inject(Router);
  private loginService = inject(LoginService);
  private toastService = inject(ToastrService);

  constructor() {
    this.loginForm = new FormGroup<LoginForm>({
      email: new FormControl('', [
        Validators.required,
        Validators.email,
        this.emailWithTLDValidator
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(20)
      ])
    });
  }

  emailWithTLDValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value as string;
    // Regex para verificar se o e-mail termina com um TLD válido
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (value && !regex.test(value)) {
      return { emailTLD: true };
    }
    return null;
  }

  submit(){
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const email = this.loginForm.get('email')?.value;
    const password = this.loginForm.get('password')?.value;

    if (email && password) {
      this.loginService.login(email, password).subscribe({
        next: () => {
          this.toastService.success("Login feito com sucesso!");
          this.router.navigate(["user"]);
        },
        error: (err) => {
          const errorMessage = err.error?.message || "Erro inesperado! Tente novamente mais tarde";
          this.toastService.error(errorMessage);
        }
      });
    } else {
      this.toastService.error("Email ou senha inválidos.");
    }
  }

  navigate(){
    this.router.navigate(["signup"]);
  }

  forgotPassword(){
    this.toastService.info("Funcionalidade de recuperação de senha ainda não implementada.");
  }
}
