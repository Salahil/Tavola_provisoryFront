import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { SignUpComponent } from './signup.component';
import { DefaultLoginLayoutComponent } from '../../components/default-login-layout/default-login-layout.component';
import { PrimaryInputComponent } from '../../components/primary-input/primary-input.component';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { ToastrService } from 'ngx-toastr';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('SignUpComponent', () => {
  let component: SignUpComponent;
  let fixture: ComponentFixture<SignUpComponent>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockLoginService: jasmine.SpyObj<LoginService>;
  let mockToastrService: jasmine.SpyObj<ToastrService>;

  beforeEach(async () => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockLoginService = jasmine.createSpyObj('LoginService', ['signup']);
    mockToastrService = jasmine.createSpyObj('ToastrService', ['success', 'error']);

    await TestBed.configureTestingModule({
      imports: [
        SignUpComponent, 
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
    fixture = TestBed.createComponent(SignUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar o componente de signup', () => {
    expect(component).toBeTruthy();
  });

  describe('Validações do Formulário', () => {
    it('deve ser inválido quando vazio', () => {
      expect(component.signupForm.valid).toBeFalsy();
    });

    it('o campo name deve ser obrigatório', () => {
      const name = component.signupForm.controls['name'];
      expect(name.valid).toBeFalsy();
      expect(name.errors?.['required']).toBeTruthy();
    });

    it('o campo name deve ter no mínimo 3 caracteres', () => {
      const name = component.signupForm.controls['name'];
      name.setValue('Jo');
      expect(name.errors?.['minlength']).toBeTruthy();
    });

    it('o campo name deve ter no máximo 50 caracteres', () => {
      const name = component.signupForm.controls['name'];
      name.setValue('J'.repeat(51));
      expect(name.errors?.['maxlength']).toBeTruthy();
    });

    it('o campo email deve ser obrigatório', () => {
      const email = component.signupForm.controls['email'];
      expect(email.valid).toBeFalsy();
      expect(email.errors?.['required']).toBeTruthy();
    });

    it('o campo email deve ter um formato válido', () => {
      const email = component.signupForm.controls['email'];
      email.setValue('invalidEmail');
      expect(email.errors?.['email']).toBeTruthy();

      email.setValue('valid@example.com');
      expect(email.errors).toBeNull();
    });

    it('o campo password deve ser obrigatório', () => {
      const password = component.signupForm.controls['password'];
      expect(password.valid).toBeFalsy();
      expect(password.errors?.['required']).toBeTruthy();
    });

    it('o campo password deve ter no mínimo 6 caracteres', () => {
      const password = component.signupForm.controls['password'];
      password.setValue('12345');
      expect(password.errors?.['minlength']).toBeTruthy();
    });

    it('o campo password deve ter no máximo 20 caracteres', () => {
      const password = component.signupForm.controls['password'];
      password.setValue('a'.repeat(21));
      expect(password.errors?.['maxlength']).toBeTruthy();
    });

    it('o campo passwordConfirm deve ser obrigatório', () => {
      const passwordConfirm = component.signupForm.controls['passwordConfirm'];
      expect(passwordConfirm.valid).toBeFalsy();
      expect(passwordConfirm.errors?.['required']).toBeTruthy();
    });

    it('o campo passwordConfirm deve ter no mínimo 6 caracteres', () => {
      const passwordConfirm = component.signupForm.controls['passwordConfirm'];
      passwordConfirm.setValue('12345');
      expect(passwordConfirm.errors?.['minlength']).toBeTruthy();
    });

    it('o campo passwordConfirm deve ter no máximo 20 caracteres', () => {
      const passwordConfirm = component.signupForm.controls['passwordConfirm'];
      passwordConfirm.setValue('a'.repeat(21));
      expect(passwordConfirm.errors?.['maxlength']).toBeTruthy();
    });

    it('o campo passwordConfirm deve corresponder ao campo password', () => {
      const password = component.signupForm.controls['password'];
      const passwordConfirm = component.signupForm.controls['passwordConfirm'];

      password.setValue('password123');
      passwordConfirm.setValue('password321');
    });
  });

  describe('Função navigate', () => {
    it('deve navegar para a página inicial ao chamar navigate()', () => {
      component.navigate();
      expect(mockRouter.navigate).toHaveBeenCalledWith([""]);
    });
  });
});
