<?php

/**
 * configuration controller
 */

namespace App\Controller;

use Antxony\Def\Configuration\Configuration as ConfigDefs;
use Antxony\Util;
use App\Repository\ConfigurationRepository;
use Exception;
use ReflectionClass;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

/**
 * ConfigurationController class
 * @package App\Controller
 * @Route("/configuration")
 * @author Antxony <dantonyofcarim@gmail.com>
 */
class ConfigurationController extends AbstractController
{

    protected Util $util;

    protected ConfigurationRepository $rep;

    public function __construct(Util $util, ConfigurationRepository $rep)
    {
        $this->util = $util;
        $this->rep = $rep;
    }

    /**
     * @Route("/restore/{type}", name="configuration_restore", methods={"PUT", "PATCH"}, options={"expose" = true})
     * @IsGranted("ROLE_ADMIN")
     */
    public function restore(string $type): Response
    {
        try {
            $reflection = new ReflectionClass(ConfigDefs::class);
            $constants = array_flip($reflection->getConstants());
            $config = $this->rep->findOneBy([
                "name" => $constants[$type]
            ]);
            if ($config == null) {
                throw new Exception("No se encontró la configuración");
            }
            $config->setConfig($config->getDefaultConfig());
            $this->util->info("Se <b>restauró</b> la configuración {$constants[$type]}");
            return new Response("Configuración restaurada");
        } catch (Exception $e) {
            return $this->util->errorResponse($e);
        }
    }

    /**
     * @Route("/{type}", name="configuration_update", methods={"PUT", "PATCH"}, options={"expose" = true})
     * @IsGranted("ROLE_ADMIN")
     */
    public function update(string $type, Request $request): Response
    {
        try {
            $content = json_decode($request->getContent());
            $reflection = new ReflectionClass(ConfigDefs::class);
            $constants = array_flip($reflection->getConstants());
            $config = $this->rep->findOneBy([
                "name" => $constants[$type]
            ]);
            if ($config == null) {
                throw new Exception("No se encontró la configuración");
            }
            $config->setConfig((array)$content);
            $this->util->info("Se <b>actualizó</b> la configuración {$constants[$type]}");
            return new Response("Configuración actualizada");
        } catch (Exception $e) {
            return $this->util->errorResponse($e);
        }
    }
}
