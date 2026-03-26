# Diagramme de Déploiement

Ce diagramme de déploiement montre l'architecture des différents serveurs physiques ou virtuels nécessaires pour héberger le projet Botola Pro Inwi pour la soutenance PFE.

```mermaid
flowchart TD
    subgraph Client Device [Appareils Clients]
        Browser1(Navigateur Web: Chrome, Safari, etc.)
        Browser2(Navigateur Mobile)
        Browser3(Scanner Agent - Tablette)
    end

    subgraph Internet
        CDN[Réseau et DNS]
    end

    subgraph Serveur Web (Frontend) [Serveur Web Frontend - Vercel / Netlify]
        Vite[Serveur HTTP - Fichiers Statiques React]
    end

    subgraph Serveur d'Application (Backend) [Serveur Backend - VPS / Render]
        NodeApp[Node.js Runtime - Processus Express API sur port 5000]
        PM2(PM2 Process Manager)
        NodeApp --> PM2
    end

    subgraph Serveur de Base de Données [Serveur SGBD - AWS RDS / VPS]
        MySQLDb[(Base de données MySQL 8.x sur port 3306)]
    end

    Browser1 -->|Requête HTTPS| CDN
    Browser2 -->|Requête HTTPS| CDN
    Browser3 -->|Requête HTTPS (Axios)| CDN
    
    CDN -->|Fichiers Statiques| Vite
    
    Browser1 -.->|Appels REST API (HTTPS)| NodeApp
    Browser2 -.->|Appels REST API (HTTPS)| NodeApp
    Browser3 -.->|Appels REST API (HTTPS)| NodeApp
    
    NodeApp -->|Connexion TCP / Protocol MySQL| MySQLDb
```
