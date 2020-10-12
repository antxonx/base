<?php
/**
 * Controlador de inicio
 */

namespace App\Controller;

use App\Entity\Client;
use Antxony\Util;
use App\Entity\InfoLog;
use App\Entity\ErrorLog;
use Exception;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

/**
 * HomeController class
 * @Route("/")
 * @author Antxony <dantonyofcarim@gmail.com>
 */
class HomeController extends AbstractController
{
    /**
     * util
     *
     * @var Util
     */
    protected $util;

    /**
     * construct
     *
     * @param Util $util
     */
    public function __construct(Util $util)
    {
        $this->util = $util;
    }

    /**
     * @Route("", name="home_index", methods={"GET"})
     * @IsGranted("IS_AUTHENTICATED_FULLY")
     *
     * @return Response
     */
    public function index() : Response
    {
        try {
            $clients = $this->getDoctrine()->getRepository(Client::class)->findBy([
                "suspended" => "0"
            ], [
                "createdAt" => "DESC"
            ], 10);
            $infoLogs = $this->getDoctrine()->getRepository(InfoLog::class)->findBy([], [
                "createdAt" => "DESC"
            ], 10);
            $errorLogs = $this->getDoctrine()->getRepository(ErrorLog::class)->findBy([], [
                "createdAt" => "DESC"
            ], 10);
            return $this->render('view/home/index.html.twig', [
                'clients' => $clients,
                'infoLogs' => $infoLogs,
                'errorLogs' => $errorLogs
            ]);
        } catch (Exception $e) {
            return $this->util->errorResponse($e);
        }
    }
}
