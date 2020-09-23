<?php
/**
 * Registro de acciones y errores
 */

namespace Antxony;

use App\Entity\ErrorLog;
use App\Entity\InfoLog;
use Doctrine\ORM\EntityManagerInterface;
use Monolog\Handler\AbstractProcessingHandler;
use Monolog\Logger as MonologLogger;
use Symfony\Component\Routing\RouterInterface;

/**
 * Clase para generar registros con errores o información en base de datos
 * @author Alejandro Antonio <dantonyofcarim@gmail.com>
 */
class Logger extends AbstractProcessingHandler
{
    /**
     * Saber si está inicializado el servicio
     *
     * @var bool
     */
    private $initialized;

    /**
     * Registro hecho por el sistema
     * 
     * @var bool 
     */
    public const LOG_SYSTEM = true;

    /**
     * Registro hecho por el usuario
     * 
     * @var bool
     */
    public const LOG_USER = false;

    /**
     * Entity Manager, nos ayuda a guardar registros en la base de datos
     *
     * @var EntityManagerInterface
     */
    private $em;

    /**
     * Router, nos ayuda a conseguir la ruta y el método de la petición
     *
     * @var RouterInterface
     */
    private $router;

    /**
     * Constructor
     *
     * @param EntityManagerInterface $em
     * @param RouterInterface $router
     */
    public function __construct(EntityManagerInterface $em, RouterInterface $router)
    {
        parent::__construct();
        $this->em = $em;
        $this->router = $router;
    }

    /**
     * Se escribe un registro en base de datos
     *
     * @param array $record información completa del registro
     * @return void
     */
    protected function write(array $record) : void
    {

        /* ----------------- Marcamos el servicio como inicializado ----------------- */

        if (!$this->initialized) {
            $this->initialize();
        }

        /* ------------------------------------ . ----------------------------------- */
       
        if (
            $record['level'] == MonologLogger::NOTICE ||
            $record['level'] ==  MonologLogger::INFO
        ) {

            /* -------------------------------------------------------------------------- */
            /*                                    INFO                                    */
            /* -------------------------------------------------------------------------- */

            // Si el registro es de tipo INFO o NOTICE lo guardamos en InfoLog
            if (
                $record['level'] == MonologLogger::INFO &&
                !(isset($record['context']['user_log']) &&
                $record['context']['user_log'])
            ) {
                //Pero los de tipo INFO Solamente los guardamos si son de usuario (Para evitar demasiados registros inecesarios)
                return;
            }

            if (!$this->em->isOpen()) {
                $this->em = $this->em->create(
                    $this->em->getConnection(),
                    $this->em->getConfiguration()
                );
            }

            /* --------- Marcamos por defecto como si fuera registro del sistema -------- */

            $system = self::LOG_SYSTEM;

            if (
                isset($record['context']['user_log']) &&
                $record['context']['user_log']
            ) {

                /* ------------ Pero lo cambiamos si detectamos que es de usuario ----------- */

                $system = self::LOG_USER;
            }

            /* ------------------------- Crear un objeto InfoLog ------------------------ */

            $infoLog = (new InfoLog)
             ->setRoute($this->router->getContext()->getPathInfo())
             ->setMethod($this->router->getContext()->getMethod())
             ->setClientip($_SERVER['REMOTE_ADDR'])
             ->setLevel($record['level_name'])
             ->setSystem($system)
             ->setMessage($record['message']);

            /* ---------------------- Insertar en la base de datos ---------------------- */

            $this->em->persist($infoLog);
            $this->em->flush();

            /* -------------------------------------------------------------------------- */
            /*                                      .                                     */
            /* -------------------------------------------------------------------------- */
        } elseif (
            $record['level'] == MonologLogger::ERROR ||
            $record['level'] == MonologLogger::WARNING ||
            $record['level'] == MonologLogger::CRITICAL ||
            $record['level'] == MonologLogger::ALERT ||
            $record['level'] == MonologLogger::EMERGENCY ||
            $record['level'] == MonologLogger::API
        ) {

            /* -------------------------------------------------------------------------- */
            /*                                    ERROR                                   */
            /* -------------------------------------------------------------------------- */

            // Si el registro es de tipo ERROR, WARNING, CRITICAL, ALERT, EMERGENCY o API lo guardamos en ErrorLog

            if (!$this->em->isOpen()) {
                $this->em = $this->em->create(
                    $this->em->getConnection(),
                    $this->em->getConfiguration()
                );
            }

            /* ------- Inicializamos información de archivo en caso de que no haya ------ */

            $file = "";
            $line = 0;

            /* --------- Marcamos por defecto como si fuera registro del sistema -------- */

            $system = true;

            if (
                isset($record['context']['user_log']) &&
                $record['context']['user_log']
            ) {

                /* ------------ Pero lo cambiamos si detectamos que es de usuario ----------- */

                $system = false;

                /* - También llenamos la información del archivo y la linea de la excepción - */

                $file = $record['context']['file'];
                $line = $record['context']['line'];
            } elseif (isset($record['context']['exception'])) {
                //Verificamos si aún siendo del sistema se trata de una excepción y tratamos de conseguir archivo y linea
                $file = $record['context']['exception']->getFile();
                $line = $record['context']['exception']->getLine();
            } elseif (isset($record['context']['route_parameters']['_controller'])) {
                //Como última esperanza tratamos de econtrar por lo menos en controlador que causó el error
                $file = $record['context']['route_parameters']['_controller'];
            }

            /* ------------------------ Crear un objeto ErrorLog ------------------------ */

            $errorLog = (new ErrorLog)
                ->setFile($file)
                ->setRoute($this->router->getContext()->getPathInfo())
                ->setLine($line)
                ->setClientip($_SERVER['REMOTE_ADDR'])
                ->setMethod($this->router->getContext()->getMethod())
                ->setLevel($record['level_name'])
                ->setSystem($system)
                ->setMessage($record['message']);

            /* ---------------------- Insertar en la base de datos ---------------------- */

            $this->em->persist($errorLog);
            $this->em->flush();
        }
    }

    /**
     * iniciar el servicio
     *
     * @return void
     */
    private function initialize()
    {
        $this->initialized = true;
    }
}
