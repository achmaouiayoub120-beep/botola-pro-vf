# Diagramme d'État : Cycle de Vie d'un Billet

Ce diagramme d'état illustre les différentes phases par lesquelles passe un billet de match Botola Pro Inwi, depuis sa réservation jusqu'à son utilisation ou annulation.

```mermaid
stateDiagram-v2
    [*] --> PENDING : Réservation initiée
    
    PENDING --> CONFIRMED : Paiement validé
    PENDING --> CANCELLED : Paiement refusé / Temps écoulé
    
    state CONFIRMED {
        [*] --> Billet_PDF_QR
        Billet_PDF_QR --> [*] : Téléchargé
    }
    
    CONFIRMED --> CANCELLED : Annulation Admin / Utilisateur
    CONFIRMED --> USED : Scanné à l'entrée du stade
    
    USED --> [*] : Billet invalidé (ne peut plus être scanné)
    CANCELLED --> [*] : Billet non valide
```
