# Counter
----
Cette application est un timer (compte à  rebours) destiné à mettre en avant l'utilisation rationnelle du temps.

## État du timer

*hasStarted* : cette propriété définie un timer qui a été lancé, qu'il soit en cours ou pausé.
- true : quand le timer est lancé ;
- false : valeur par défaut, et valeur après réinitialisation.

*hasFinished* : elle définie si le compte à rebours est terminé ou non;
- true : quand la décompte est terminée, le timer n'est pas en pause ou supprimé;
- false : valeur par défaut, pendant une pause, ou après réinitialisation;

*hasNotified* : définie si l'avertissement relatif à la fin imminente du temps a été alertée par une action visuelle 
