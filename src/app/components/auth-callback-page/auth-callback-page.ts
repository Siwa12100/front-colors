import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';


@Component({
  selector: 'app-auth-callback-page',
  template: `<p>Connexion en cours...</p>`,
  standalone: true,
})
export class AuthCallbackPage implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit(): void {
    // Lire les paramètres de l'URL (?token=...&email=...&full_name=...&role=...)
    this.route.queryParams.subscribe((params: Params) => {
      const token = params['token'];
      const user_id = params['user_id'];
      const email = params['email'];
      const fullName = params['full_name'];
      const role = params['role'];

      if (token) {
        // Stocker le token JWT et les infos utilisateur dans localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('user_id', user_id ?? '');
        localStorage.setItem('email', email ?? '');
        localStorage.setItem('full_name', fullName ?? '');
        localStorage.setItem('role', role ?? '');

        console.log('Connexion réussie ! Token JWT stocké.');

        // Rediriger vers la page d'accueil
        this.router.navigateByUrl('/');
      } else {
        // Pas de token = erreur, retour au login
        const error = params['error'];
        const messages: Record<string, string> = {
          unauthorized: 'Votre compte Google doit être autorisé par un administrateur.',
          disabled: 'Votre compte a été désactivé. Contactez un administrateur.',
        };
        const msg = messages[error] ?? 'Une erreur est survenue.';
        this.router.navigateByUrl('/login?error=' + error + '&msg=' + encodeURIComponent(msg));
      }
    });
  }
}
