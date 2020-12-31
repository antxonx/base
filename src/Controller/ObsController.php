<?php
/**
 * Obs controller
 */

namespace App\Controller;

use Antxony\Util;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Security;
use Exception;

/**
 * Observations
 * @package App\Controller
 * @Route("/obs")
 * @author Antxony <dantonyofacrim@gmail.com>
 */
class ObsController extends AbstractController
{

    protected Security $security;
    
    protected Util $util;

    public function __construct(Security $security, Util $util)
    {
        $this->security = $security;
        $this->util = $util;
    }

    /**
     * Agregar observación a una entidad
     * @Route("", name="obs_add", methods={"POST"}, options={"expose" = true})
     * @IsGranted("ROLE_COMMON")
     */
    public function addObs(Request $request) : Response
    {
        try {
            $content = json_decode($request->getContent());
            $entityF = $this->getDoctrine()->getRepository("App\\Entity\\$content->entity")->find($content->id);
            if ($entityF == null) {
                throw new Exception("No se pudo encontrar la entidad");
            }
            $em = $this->getDoctrine()->getManager();
            $obsClassName = "App\\Entity\\" . $content->entity . "Obs";
            $obs = new $obsClassName;
            $obs
                ->setEntity($entityF)
                ->setDescription($content->description)
                ->created($this->security->getUser());
            $em->persist($obs);
            $message = "Se ha agregar una observación a <b>{$entityF->getId()}</b> (<em>{$content->entity}</em>)";
            $this->util->info($message);
            return new Response("Observación agregada");
        } catch (Exception $e) {
            return $this->util->errorResponse($e);
        }
    }

    /**
     * Conseguir las obervaciones
     * @Route("/{entity}/{id}", name="obs_get", methods={"GET"}, options={"expose" = true})
     * @IsGranted("ROLE_COMMON")
     */
    public function getObs(string $entity, int $id) : Response
    {
        try {
            $obs = $this->getDoctrine()->getRepository("App\\Entity\\$entity" . "Obs")->findBy([
                'entity' => $id
            ], [
                'createdAt' => 'DESC'
            ]);
            $obsJson = [];
            foreach($obs as $ob) {
                $obsJson[] = [
                    'createdAt' => $ob->getCreatedAt(),
                    'createdBy' => $ob->getCreatedBy()->getName(),
                    'description' => $ob->getDescription()
                ];
            }
            return new Response(json_encode($obsJson));
        } catch (\Exception $e) {
            return $this->util->errorResponse($e);
        }
    }
}
