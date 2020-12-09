<?php

namespace App\Controller;

use Antxony\Util;
use App\Entity\ClientCategory;
use App\Repository\ClientCategoryRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

/**
 * Class ClientCategoryController
 * @package App\Controller
 * @Route("/client_category")
 */
class ClientCategoryController extends AbstractController
{
    /**
     * @var ClientCategoryRepository;
     */
    protected $rep;

    /**
     * herramientas útiles
     *
     * @var Util
     */
    protected $util;

    public function __construct(ClientCategoryRepository $rep, Util $util)
    {
        $this->rep = $rep;
        $this->util = $util;
    }

    /**
     * @Route("", name="client_category_index", methods={"GET"})
     */
    public function index(): Response
    {
        return $this->render('view/client_category/index.html.twig', [
            'controller_name' => 'ClientCategoryController',
        ]);
    }

    /**
     * Get category list
     *
     * @Route("/list", name="client_category_list", methods={"GET"})
     * @param Request $request
     * @return Response
     */
    public function list(Request  $request) : Response
    {
        try {
            $params = json_decode(json_encode($request->query->all()));
            $result = $this->rep->getBy($params);
            $showed = ((isset($params->page)) ? $params->page * $this->util::PAGE_COUNT : $this->util::PAGE_COUNT);
            $categories = $result['paginator'];
            $maxPages = ceil($categories->count() / $this->util::PAGE_COUNT);
            return $this->render("view/client_category/tbody.html.twig", [
                'categories' => $categories,
                'maxPages' => $maxPages,
                'thisPage' => ((isset($params->page)) ? $params->page : 1),
                'showed' => (($showed > $categories->count()) ? $categories->count() : $showed),
            ]);
        } catch (\Exception $e) {
            return $this->util->errorResponse($e);
        }
    }
}
