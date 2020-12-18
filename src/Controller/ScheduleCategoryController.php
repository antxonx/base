<?php

namespace App\Controller;

use Antxony\Util;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use App\Repository\ScheduleCategoryRepository;
use App\Entity\ScheduleCategory;

/**
 * ScheduleCategoryController class
 * @Route("/scheduleCategory")
 * @author Antxony <dantonyofcarim@gmail.com>
 */
class ScheduleCategoryController extends AbstractController
{
    /**
    * @var ScheduleCategoryRepository
    */
    protected $rep;

    /**
     * @var Util
     */
    protected $util;

    public function __construct(ScheduleCategoryRepository $rep, Util $util)
    {
        $this->rep = $rep;
        $this->util = $util;
    }

    /**
     * @Route("", name="schedule_category_index", methods={"GET"})
     */
    public function index(): Response
    {
        return $this->render('view/schedule_category/index.html.twig', [
            'controller_name' => 'ScheduleCategoryController',
        ]);
    }

    /**
    * @Route("/list", name="schedule_category_list", methods={"GET"}, options={"expose" = true})
    */
    public function list(Request $request) : Response
    {
        try {
            $params = json_decode(json_encode($request->query->all()));
            $result = $this->rep->getBy($params);
            $showed = ((isset($params->page)) ? $params->page * $this->util::PAGE_COUNT : $this->util::PAGE_COUNT);
            $categories = $result['paginator'];
            $maxPages = ceil($categories->count() / $this->util::PAGE_COUNT);
            return $this->render("view/schedule_category/tbody.html.twig", [
                'categories' => $categories,
                'maxPages' => $maxPages,
                'thisPage' => ((isset($params->page)) ? $params->page : 1),
                'showed' => (($showed > $categories->count()) ? $categories->count() : $showed),
            ]);
        } catch(Exception $e) {
            return $this->util->errorResponse($e);
        }
    }

    /**
    * @Route("/form", name="schedule_category_form", methods={"GET"}, options={"expose" = true})
    */
    public function form() : Response
    {
        try {
            return $this->render("view/schedule_category/form.html.twig");
        } catch (Exception $e) {
            return $this->util->errorResponse($e);
        }
    }

    /**
    * @Route("/add", name="schedule_category_add", methods={"POST"}, options={"expose" = true})
    */
    public function add(Request $request) : Response
    {
        try {
            $content = json_decode($request->getContent());
            $category = (new ScheduleCategory())
                ->setName($content->name)
                ->setDescription($content->description)
                ->setBackgroundColor($content->bColor)
                ->setColor($content->tColor);
            $this->rep->add($category);
            $message = "Se ha agregado evento <b>{$content->name}</b>";
            $this->util->info($message);
            return new Response($message);
        } catch (Exception $e) {
            return $this->util->errorResponse($e);
        }
    }
}
