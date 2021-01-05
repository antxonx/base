<?php
/**
 * Obs controller
 */

namespace App\Controller;

use Antxony\Observation;
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
    public function addObs(Request $request, Observation $ob) : Response
    {
        try {
            $content = json_decode($request->getContent());
            $ob->add($content->id, $content->entity, $content->description);
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
                'createdAt' => 'ASC'
            ]);
            $obsJson = [];
            foreach($obs as $ob) {
                $obsJson[] = [
                    'createdAt' => [
                        'date' => $ob->getCreatedAt()->format("d/m/Y"),
                        'time' => $ob->getCreatedAt()->format("H:i"),
                    ],
                    'createdBy' => $ob->getCreatedBy()->getName(),
                    'description' => $ob->getDescription(),
                    'customClass' => (($ob->getCreatedBy()->getUsername() == $this->security->getUser()->getUsername())?'obs-right':'obs-left')
                ];
            }
            return new Response(json_encode($obsJson));
        } catch (\Exception $e) {
            return $this->util->errorResponse($e);
        }
    }
}
