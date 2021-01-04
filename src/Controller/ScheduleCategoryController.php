<?php

/**
 * Schedule categories controller
 */

namespace App\Controller;

use Antxony\Util;
use Antxony\Def\Editable\Editable;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use App\Repository\ScheduleCategoryRepository;
use App\Entity\ScheduleCategory;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use Exception;

/**
 * ScheduleCategoryController class
 * @package App\Controller
 * @Route("/scheduleCategory")
 * @author Antxony <dantonyofcarim@gmail.com>
 */
class ScheduleCategoryController extends AbstractController
{

    protected ScheduleCategoryRepository $rep;

    protected Util $util;

    public function __construct(ScheduleCategoryRepository $rep, Util $util)
    {
        $this->rep = $rep;
        $this->util = $util;
    }

    /**
     * @Route("", name="schedule_category_index", methods={"GET"})
     * @IsGranted("ROLE_ADMIN")
     */
    public function index(): Response
    {
        return $this->render('view/schedule_category/index.html.twig', [
            'controller_name' => 'ScheduleCategoryController',
        ]);
    }

    /**
     * @Route("/list", name="schedule_category_list", methods={"GET"}, options={"expose" = true})
     * @IsGranted("ROLE_ADMIN")
     */
    public function list(Request $request): Response
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
        } catch (Exception $e) {
            return $this->util->errorResponse($e);
        }
    }

    /**
     * @Route("/form", name="schedule_category_form", methods={"GET"}, options={"expose" = true})
     * @IsGranted("ROLE_ADMIN")
     */
    public function form(): Response
    {
        try {
            return $this->render("view/schedule_category/form.html.twig");
        } catch (Exception $e) {
            return $this->util->errorResponse($e);
        }
    }

    /**
     * @Route("/add", name="schedule_category_add", methods={"POST"}, options={"expose" = true})
     * @IsGranted("ROLE_ADMIN")
     */
    public function add(Request $request): Response
    {
        try {
            $content = json_decode($request->getContent());
            $category = (new ScheduleCategory())
                ->setName($content->name)
                ->setDescription($content->description)
                ->setBackgroundColor($content->bColor)
                ->setRoles($content->roles)
                ->setColor($content->tColor);
            $this->rep->add($category);
            $message = "Se ha agregado evento <b>{$content->name}</b>";
            $this->util->info($message);
            return new Response($message);
        } catch (Exception $e) {
            return $this->util->errorResponse($e);
        }
    }

    /**
     * @Route("/delete/{id}", name="schedule_category_delete", methods={"DELETE"}, options={"expose" = true})
     * @IsGranted("ROLE_ADMIN")
     */
    public function delete(int $id): Response
    {
        try {
            $category = $this->rep->find($id);
            if ($category == null) {
                throw new Exception("No se encontró la categoría");
            }
            $this->rep->delete($category);
            $message = "Se ha eliminado la categoría <b><em>{$category->getName()}</em></b>";
            $this->util->info($message);
            return new Response($message);
        } catch (Exception $e) {
            return $this->util->errorResponse($e);
        }
    }

    /**
     * @Route("/show/{id}", name="schedule_category_show", methods={"GET"}, options={"expose" = true})
     * @IsGranted("ROLE_ADMIN")
     */
    public function show(int $id): Response
    {
        try {
            $category = $this->rep->find($id);
            return $this->render("view/schedule_category/show.html.twig", [
                'category' => $category
            ]);
        } catch (Exception $e) {
            return $this->util->errorResponse($e);
        }
    }

    /**
     * @Route("/update/{id}", name="schedule_category_edit", methods={"PUT", "PATCH"})
     * @IsGranted("ROLE_ADMIN")
     */
    public function update(int $id, Request $request): Response
    {
        try {
            parse_str($request->getContent(), $content);
            $editable = new Editable($content);
            $category = $this->rep->find($id);
            if ($category == null) {
                throw new Exception("No se pudo localizar la categoría");
            }
            $message = "se ha actualizado";
            if ($editable->name == "categoryName") {
                $category->setName($editable->value);
                $message .= " el nombre";
            }
            if ($editable->name == "categoryDescription") {
                $category->setDescription($editable->value);
                $message .= " la descripción";
            }
            if ($editable->name == "categoryRoles") {
                $category->setRoles($editable->value);
                $message .= " los roles";
            }
            $this->rep->update();
            $this->util->info($message . " para la categoría <b>{$category->getId()}</b> (<em>{$category->getName()}</em>)");
            return new Response($message);
        } catch (Exception $e) {
            return $this->util->errorResponse($e);
        }
    }

    /**
     * @Route("/color", name="schedule_category_color_edit", methods={"PUT", "PATCH"}, options={"expose" = true})
     * @IsGranted("ROLE_ADMIN")
     */
    public function updateColor(Request $request): Response
    {
        try {
            $content = json_decode($request->getContent());
            $category = $this->rep->find($content->id);
            if ($category == null) {
                throw new Exception("No se encontró la categoría");
            }
            $message = "Se ha actualizado el color del ";
            if ($content->type == "background") {
                $category->setBackgroundColor($content->newColor);
                $message .= "fondo";
            } else {
                $category->setColor($content->newColor);
                $message .= "texto";
            }
            $this->rep->update();
            $this->util->info($message . " de la categoría <b>{$category->getId()}</b> (<em>{$category->getName()}</em>)");
            return new Response($message);
        } catch (Exception $e) {
            return $this->util->errorResponse($e);
        }
    }
}
