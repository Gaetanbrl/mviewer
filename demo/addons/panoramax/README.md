# Visualiser les photos de rues de Panoramax

[Panoramax](https://panoramax.fr/) est le géocommun des photos des territoires 📸🗺️

Cette extension permet de facilement visualiser les photos de Panoramax sur une carte MViewer :

- Affichage sur la carte des photos à proximité
- Visualisation des photos classiques ou 360° dans une boîte redimensionnable
- Filtrage des photos par date, type (360° ou classique) et score de qualité

## Configuration du fichier XML

Pour intégrer cette extension à votre **application**, ajoutez simplement le code ci-dessous :

```xml
<extensions>
    <extension type="component" id="panoramax" path="demo/addons"/>
</extensions>
```

Une fois la configuration effectuée, un nouveau bouton **Panoramax** apparaît dans la barre d'outils se situant à droite de l'application.

## Utilisation

1. Cliquez sur le bouton **Panoramax** dans la barre d'outil. Les photos disponibles s'affichent en orange sur la carte.
2. Cliquez sur n'importe laquelle des photos, la visionneuse s'ouvre en bas à gauche de l'écran.
3. Dans la légende, retrouvez les filtres interactifs pour facilement trouver les photos qui vous intéressent.

## Configuration avancée

Il est possible de modifier les configurations avancées de l'extension à travers le fichier `demo/addons/panoramax/config.json` :

- `options.panoramax.url` : URL du serveur Panoramax à utiliser (par défaut le catalogue général : `https://explore.panoramax.fr`)
- `options.panoramax.filters` : modifier les valeurs de filtres initiales
  - `minDate` : date minimale de prise de la photo au format `YYYY-MM-DD` (exemple `2025-01-01`)
  - `maxDate` : date maximale de prise de la photo au format `YYYY-MM-DD` (exemple `2025-06-01`)
  - `pic_type` : type de photo à afficher (`flat` pour photos classiques, `equirectangular` pour 360°, ne pas renseigner pour les deux)
  - `qualityscore` : score qualité des photos à afficher, valeurs de 1 à 5 (sous forme de liste, exemple `[5, 4]` pour les photos notées A ou B)
  - `user` : UUID de l'utilisateur dont on veut afficher les photos (exemple `ae24894e-31bc-437c-8d3e-8de7b1b3fc0f`). L'identifiant se retrouve sur le serveur Panoramax où vous êtes inscrits, à l'adresse `https://panoramax.ign.fr/api/users/me` (champ `id`).

Un exemple complet de configuration possible :

```json
{
  "options": {
    "panoramax": {
      "url": "https://explore.panoramax.fr",
      "filters": {
        "minDate": "2025-01-01",
        "maxDate": "2025-06-01",
        "pic_type": "equirectangular",
        "qualityscore": [5, 4],
        "user": "ae24894e-31bc-437c-8d3e-8de7b1b3fc0f"
      }
    }
  }
}
```
