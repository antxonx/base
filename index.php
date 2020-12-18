<?php

use App\Kernel;
use Symfony\Component\Dotenv\Dotenv;
use Symfony\Component\ErrorHandler\Debug;
use Symfony\Component\HttpFoundation\Request;

define("IS_WINDOWS", strtoupper(substr(PHP_OS, 0, 3)) === 'WIN');
if(IS_WINDOWS) {
    setlocale(LC_TIME, "esm.utf8");
} else {
    setlocale(LC_TIME, "es_MX.UTF8");
}
date_default_timezone_set("America/Mexico_City");

require __DIR__.'/vendor/autoload.php';

(new Dotenv())->bootEnv(__DIR__.'/.env');

if ($_SERVER['APP_DEBUG']) {
    umask(0000);

    Debug::enable();
}

if ($trustedProxies = $_SERVER['TRUSTED_PROXIES'] ?? false) {
    Request::setTrustedProxies(explode(',', $trustedProxies), Request::HEADER_X_FORWARDED_ALL ^ Request::HEADER_X_FORWARDED_HOST);
}

if ($trustedHosts = $_SERVER['TRUSTED_HOSTS'] ?? false) {
    Request::setTrustedHosts([$trustedHosts]);
}

$kernel = new Kernel($_SERVER['APP_ENV'], (bool) $_SERVER['APP_DEBUG']);
$request = Request::createFromGlobals();
/** @noinspection PhpUnhandledExceptionInspection */
$response = $kernel->handle($request);
$response->send();
$kernel->terminate($request, $response);
