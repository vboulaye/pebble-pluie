# pebble pluie


Appli pebble qui affiche les précipitations prévues dans l'heure d'après météo france.


recupère les infos de la ville ou on se trouve par un appel a l api de geolocalisation de pebble.

puis par une recherche reverse par lat+lon sur https://adresse.data.gouv.fr/api on obtient le code insee.

ce code insee (avec un 0 en plus???) est le parametre d'entree de l'api meteo.fr.
