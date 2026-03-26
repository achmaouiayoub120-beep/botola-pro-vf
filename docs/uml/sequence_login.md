# Diagramme de Séquence : Connexion (Login)

Ce diagramme explique le flux d'authentification d'un utilisateur sur l'application Botola Pro Inwi, y compris la génération et vérification du token JWT.

```mermaid
sequenceDiagram
    actor User as "Utilisateur"
    participant UI as "React App (AuthContext)"
    participant API as "Express API"
    participant DB as "MySQL Database"
    participant JWT as "JWT Service"

    User->>UI: Saisit email et mot de passe
    UI->>UI: Validation front-end (format email)
    UI->>API: POST /api/auth/login (email, password)
    
    API->>DB: SELECT * FROM users WHERE email = ?
    
    alt Utilisateur non trouvé
        DB-->>API: null
        API-->>UI: 401 Unauthorized "Identifiants invalides"
        UI-->>User: Affiche message d'erreur "Identifiants incorects"
    else Utilisateur trouvé
        DB-->>API: Données d'utilisateur + Password Hash
        API->>API: bcrypt.compare(password, hash)
        
        alt Mot de passe incorrect
            API-->>UI: 401 Unauthorized "Identifiants invalides"
            UI-->>User: Affiche message d'erreur
        else Compte Bloqué (status == 'BLOCKED')
            API-->>UI: 403 Forbidden "Compte bloqué"
            UI-->>User: Affiche "Veuillez contacter l'administrateur"
        else Connexion Validée
            API->>JWT: jwt.sign(id, role)
            JWT-->>API: Token JWT
            
            API-->>UI: 200 OK (Token + User Data)
            
            UI->>UI: Stocke le token (localStorage)
            UI->>UI: AuthContext.setUser() effectif
            
            alt Rôle = "ADMIN"
                UI-->>User: Redirige vers /admin/dashboard
            else Rôle = "USER"
                UI-->>User: Redirige vers la page d'accueil ou tableau de bord
            end
        end
    end
```
