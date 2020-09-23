# SISTEMA BASE

Proyecto base con usuarios.

## Documentación

Para generar la documentación debe ejecutar en la raíz:

```console
foo@bar:~$ php phpDocumentor3.phar -d src -t docs --title="UserBase"
```

Para generar la un gráfico del proecto con graphviz:

```console
foo@bar:~$ php phpDocumentor3.phar -d src -t docs --title="UserBase" --setting="graph.enabled=true"
```
