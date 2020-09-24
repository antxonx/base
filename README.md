# SISTEMA BASE

Proyecto base con control de usuarios, clientes y registros.

## Documentación

Para generar la documentación debe ejecutar en la raíz:

```console
foo@bar:~$ php phpDocumentor3.phar -d src -d Antxony -t docs --title="Base"
```

Para generar la un gráfico del proecto con graphviz:

```console
foo@bar:~$ php phpDocumentor3.phar -d src -d Antxony -t docs --title="Base" --setting="graph.enabled=true"
```
