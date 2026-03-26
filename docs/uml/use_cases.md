# Diagramme de Cas d'Utilisation

Ce diagramme illustre les interactions principales entre les acteurs (Utilisateur, Agent, Administrateur) et le système Botola Pro Inwi.

```mermaid
usecaseDiagram
    actor Utilisateur as "Utilisateur / Fan"
    actor Agent as "Agent de sécurité"
    actor Admin as "Administrateur"
    
    package "Système de Billetterie" {
        usecase UC1 as "S'inscrire / Se connecter"
        usecase UC2 as "Consulter les matchs"
        usecase UC3 as "Réserver un billet"
        usecase UC4 as "Payer en ligne"
        usecase UC5 as "Consulter l'historique"
        usecase UC6 as "Télécharger le billet (PDF)"
        
        usecase UC7 as "Scanner un billet (QR)"
        usecase UC8 as "Valider l'accès"
        
        usecase UC9 as "Gérer les matchs"
        usecase UC10 as "Gérer les équipes"
        usecase UC11 as "Gérer les stades"
        usecase UC12 as "Gérer les utilisateurs"
        usecase UC13 as "Consulter les statistiques (Dashboard)"
    }
    
    Utilisateur --> UC1
    Utilisateur --> UC2
    Utilisateur --> UC3
    Utilisateur --> UC4
    Utilisateur --> UC5
    Utilisateur --> UC6
    
    UC3 .> UC1 : <<include>>
    UC3 .> UC4 : <<include>>
    
    Agent --> UC1
    Agent --> UC7
    Agent --> UC8
    
    UC7 .> UC8 : <<include>>
    
    Admin --> UC1
    Admin --> UC9
    Admin --> UC10
    Admin --> UC11
    Admin --> UC12
    Admin --> UC13
```
