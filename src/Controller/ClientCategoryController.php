<?php

namespace App\Controller;

use Antxony\Util;
use App\Entity\ClientCategory;
use App\Repository\ClientCategoryRepository;
use Exception;
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
        } catch (Exception $e) {
            return $this->util->errorResponse($e);
        }
    }

    /**
     * add form
     *
     * @Route("/form", name="client_category_add_form", methods={"GET"})
     * @return Response
     */
    public function form() : Response
    {
        try {
            return $this->render("view/client_category/form.html.twig");
        } catch(Exception $e) {
            return $this->util->errorResponse($e);
        }
    }

    /**
     * Add category
     *
     * @Route("/add", name="client_category_add", methods={"POST"})
     * @param Request $request
     * @return Response
     */
    public function add(Request $request) : Response
    {
        try {
            $content = json_decode($request->getContent());
            $category = (new ClientCategory())
                ->setName($content->name)
                ->setDescription($content->description)
                ->setColor($content->color);
            $this->rep->add($category);
            $message = "Se ha agregado la categoría <b>{$content->name}</b>";
            $this->util->info($message);
            return new Response($message);
        } catch (Exception $e) {
            return $this->util->errorResponse($e);
        }
    }

    /**
     * Delete Category
     *
     * @Route("/delete/{id}", name="client_category_delete", methods={"DELETE"})
     * @param int $id
     * @return Response
     */
    public function delete(int $id) : Response
    {
        try {
            $category = $this->rep->find($id);
            $this->rep->delete($category);
            $message = "Se ha eliminado la categoría <b><em>{$category->getName()}</em></b>";
            $this->util->info($message);
            return new Response($message);
        } catch (Exception $e) {
            return $this->util->errorResponse($e);
        }
    }
}
