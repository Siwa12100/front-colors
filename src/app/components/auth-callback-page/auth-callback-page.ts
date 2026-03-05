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
  ) {}

  ngOnInit(): void {
    // Lire les paramètres de l'URL (?token=...&email=...&full_name=...&role=...)
    this.route.queryParams.subscribe((params: Params) => {
      const token = params['token'];
      const email = params['email'];
      const fullName = params['full_name'];
      const role = params['role'];

      if (token) {
        // Stocker le token JWT et les infos utilisateur dans localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('email', email ?? '');
        localStorage.setItem('full_name', fullName ?? '');
        localStorage.setItem('role', role ?? '');

        console.log('Connexion réussie ! Token JWT stocké.');

        // Rediriger vers la page d'accueil
        this.router.navigateByUrl('/home');
      } else {
        // Pas de token = erreur, retour au login
        console.error('Aucun token reçu de l\'API.');
        this.router.navigateByUrl('/login');
      }
    });
  }
}
