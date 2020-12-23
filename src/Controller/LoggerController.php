<?php

/**
 * Logger controller
 */

namespace App\Controller;

use App\Entity\User;
use App\Repository\UserRepository;
use Exception;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use App\Repository\ErrorLogRepository;
use App\Repository\InfoLogRepository;
use Antxony\Util;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use Symfony\Component\Security\Core\Security;

/**
 * LoggerController class
 * @package App\Controller
 * @Route("/logger")
 * @author Antxony <dantonyofcarim@gmail.com>
 */
class LoggerController extends AbstractController
{

    protected ErrorLogRepository $eRep;

    protected UserRepository $uRep;

    protected InfoLogRepository $iRep;

    protected User $actualUser;

    protected Util $util;

    public function __construct(ErrorLogRepository $eRep, InfoLogRepository $iRep, UserRepository $uRep, Util $util, Security $security)
    {
        $this->util = $util;
        $this->eRep = $eRep;
        $this->iRep = $iRep;
        $this->uRep = $uRep;
        $this->actualUser = $security->getUser();
    }

    /**
     * get all info logs
     * 
     * @Route("/info", name="logger_info_list", methods={"GET"}, options={"expose" = true})
     * @IsGranted("ROLE_GOD")
     */
    public function indexInfo(Request $request): Response
    {
        try {
            $params = json_decode(json_encode($request->query->all()));
            $result = $this->iRep->getBy($params);
            $showed = ((isset($params->page)) ? $params->page * Util::PAGE_COUNT : Util::PAGE_COUNT);
            $entities = $result['paginator'];
            $maxPages = ceil($entities->count() / Util::PAGE_COUNT);
            return $this->render("view/logger/tbodyInfo.html.twig", [
                'entities' => $entities,
                'maxPages' => $maxPages,
                'thisPage' => ((isset($params->page)) ? $params->page : 1),
                'showed' => (($showed > $entities->count()) ? $entities->count() : $showed),
            ]);
        } catch (Exception $e) {
            return $this->util->errorResponse($e);
        }
    }

    /**
     * get all error logs
     * 
     * @Route("/error", name="logger_error_list", methods={"GET"}, options={"expose" = true})
     * @IsGranted("ROLE_GOD")
     */
    public function indexError(Request $request): Response
    {
        try {
            $params = json_decode(json_encode($request->query->all()));
            $result = $this->eRep->getBy($params);
            $showed = ((isset($params->page)) ? $params->page * Util::PAGE_COUNT : Util::PAGE_COUNT);
            $entities = $result['paginator'];
            $maxPages = ceil($entities->count() / Util::PAGE_COUNT);
            return $this->render("view/logger/tbodyError.html.twig", [
                'entities' => $entities,
                'maxPages' => $maxPages,
                'thisPage' => ((isset($params->page)) ? $params->page : 1),
                'showed' => (($showed > $entities->count()) ? $entities->count() : $showed),
            ]);
        } catch (Exception $e) {
            return $this->util->errorResponse($e);
        }
    }

    /**
     * Index
     * *  
     * @Route("/{user}", name="logger_index", methods={"GET"}, options={"expose" = true})
     * @IsGranted("ROLE_GOD")
     */
    public function index(int $user = 0): Response
    {
        try {
            $userEntity = null;
            if ($user > 0) {
                $userEntity = $this->uRep->find($user);
            }
            return $this->render('view/logger/index.html.twig', [
                'user' => $user,
                'userEntity' => $userEntity
            ]);
        } catch (Exception $e) {
            return $this->util->errorResponse($e);
        }
    }
}
