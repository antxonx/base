<?php
/**
 * Elementos útiles
 */

namespace Antxony;

use Exception;
use Psr\Log\LoggerInterface;
use Symfony\Component\HttpFoundation\Response;

/**
 * Util class
 * @author Antxony <dantonyofcarim@gmail.com>
 */
class Util {

    /**
     * Cantidad de elementos por página
     * @var int
     */
    public const PAGE_COUNT = 30;

    /**
     * Logger para escribir registros
     *
     * @var LoggerInterface
     */
    private $logger;

    /**
     * constructor
     *
     * @param LoggerInterface $logger
     */
    public function __construct(LoggerInterface $logger)
    {
        $this->logger = $logger;
    }

    /**
     * Escribir un registro de error
     *
     * @param string $message Mensaje a resgistrar
     * @return void
     */
    public function error(string $message) : void
    {
            $this->logger->error($message, [
                'user_log' => true
            ]);
    }

    /**
     * Escribir un registro de error a partir de una excepción
     *
     * @param Exception $e Excepción
     * @return void
     */
    public function errorException(Exception $e) : void
    {
        $this->logger->error($e->getMessage(), [
            'user_log' => true,
            'file' => $e->getFile(),
            'line' => $e->getLine()
        ]);
    }

    /**
     * Escribir un registro de información
     *
     * @param string $message Mensaje a Registrar
     * @return void
     */
    public function info(string $message) : void
    {
        $this->logger->info($message, [
            'user_log' => true
        ]);
    }

    /**
     * Devolver una respuesta de error y escribir un registro a partir de la excepción
     *
     * @param Exception $e Excepción
     * @return Response
     */
    public function errorResponse(Exception $e) : Response
    {
        $this->logger->error($e->getMessage(), [
            'user_log' => true,
            'file' => $e->getFile(),
            'line' => $e->getLine()
        ]);
        if ((bool)$_ENV["APP_DEBUG"]) {
            return new Response(
                $e->getFile() . ":" .  $e->getLine() . " " . $e->getMessage(),
                Response::HTTP_INTERNAL_SERVER_ERROR
            );
        } else {
            return new Response($e->getMessage(), Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Ver si existe o no una cadena de texto dentro de otra
     *
     * @param string $haystack Cadena de origen
     * @param string $needle Cadena que estamos buscando
     * @return boolean
     */
    public function containsString(string $haystack, string $needle) : bool
    {
        return (strpos($haystack, $needle) !== false);
    }
}
