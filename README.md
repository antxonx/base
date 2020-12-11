# SISTEMA BASE

Proyecto base con control de usuarios, clientes y registros.

## Documentación

Para generar la documentación debe ejecutar en la raíz:

```console
foo@bar:~$ php phpDocumentor.phar -d src -d Antxony -t docs --title="Base"
```

## Rutas con FOS
```console
foo@bar:~$ php bin/console fos:js-routing:dump --format=json --target=assets/js/fos_js_routes.json
```
