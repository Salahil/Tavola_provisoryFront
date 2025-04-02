import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login.component';
import { DefaultLoginLayoutComponent } from '../../components/default-login-layout/default-login-layout.component';
import { PrimaryInputComponent } from '../../components/primary-input/primary-input.component';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { ToastrService } from 'ngx-toastr';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockLoginService: jasmine.SpyObj<LoginService>;
  let mockToastrService: jasmine.SpyObj<ToastrService>;

  beforeEach(async () => {
    // Criação de mocks para os serviços
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockLoginService = jasmine.createSpyObj('LoginService', ['login']);
    mockToastrService = jasmine.createSpyObj('ToastrService', ['success', 'error']);

    await TestBed.configureTestingModule({
      imports: [
        LoginComponent, 
        ReactiveFormsModule,
        DefaultLoginLayoutComponent,
        PrimaryInputComponent,
        HttpClientTestingModule 
      ],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: LoginService, useValue: mockLoginService },
        { provide: ToastrService, useValue: mockToastrService }
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar o componente de login', () => {
    expect(component).toBeTruthy();
  });

  describe('Validações do Formulário', () => {
    it('deve ser inválido quando vazio', () => {
      expect(component.loginForm.valid).toBeFalsy();
    });

    it('o campo email deve ser obrigatório', () => {
      const email = component.loginForm.controls['email'];
      expect(email.valid).toBeFalsy();
      expect(email.errors?.['required']).toBeTruthy();
    });

    it('o campo email deve ter um formato válido', () => {
      const email = component.loginForm.controls['email'];
      email.setValue('invalidEmail');
      expect(email.errors?.['email']).toBeTruthy();

      email.setValue('valid@example.com');
      expect(email.errors).toBeNull();
    });

    it('o campo senha deve ser obrigatório', () => {
      const password = component.loginForm.controls['password'];
      expect(password.valid).toBeFalsy();
      expect(password.errors?.['required']).toBeTruthy();
    });

    it('o campo senha deve ter no mínimo 6 caracteres', () => {
      const password = component.loginForm.controls['password'];
      password.setValue('12345');
      expect(password.errors?.['minlength']).toBeTruthy();
    });

    it('o campo senha deve ter no máximo 20 caracteres', () => {
      const password = component.loginForm.controls['password'];
      password.setValue('a'.repeat(21));
      expect(password.errors?.['maxlength']).toBeTruthy();
    });
  });

  describe('Função navigate', () => {
    it('deve navegar para "signup" ao chamar navigate()', () => {
      component.navigate();
      expect(mockRouter.navigate).toHaveBeenCalledWith(["signup"]);
    });
  });
});