<?php
/**
 * Util tools
 */

namespace Antxony;

use Exception;
use Psr\Log\LoggerInterface;
use Symfony\Component\HttpFoundation\Response;

/**
 * Utilities
 * @package Antxony
 * @author Antxony <dantonyofcarim@gmail.com>
 */
class Util {

    /**
     * Max elements per page
     * @var int
     */
    public const PAGE_COUNT = 30;

    /**
     * Logger interface
     *
     * @var LoggerInterface
     */
    private $logger;

    /**
     * Random string charset
     *
     * @var string
     */
    public const CHARSET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

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
     * Write error log
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
     * Write error log from exception
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
     * Write info log
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
     * Write error log from exception and return error Response
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
     * Is the needle in the haystack?
     *
     * @param string $haystack Cadena de origen
     * @param string $needle Cadena que estamos buscando
     * @return boolean
     */
    public function containsString(string $haystack, string $needle) : bool
    {
        return (strpos($haystack, $needle) !== false);
    }

    /**
     * Generate random string
     *
     * @param int $size
     * @param string $identifier
     * @return string
     */
    public function generateRandomString(int $size, string $identifier = "")
    {
        $charsetSize = strlen(self::CHARSET);
        $result = "";
        for($i = 0; $i < $size; $i++){
            $result .= self::CHARSET[rand(0, $charsetSize - 1)];
        }
        return ($result . $identifier);
    }

    public function getObservationEntityName(string $entity) {
        switch($entity) {
            case "Schedule":
                return "la tarea";
                break;
            case "Client":
                return "el cliente";
                break;
            default:
                return "indefinido";
                break;
        }
    }
}
