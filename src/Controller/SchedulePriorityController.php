<?php

/**
 * Scheduler priorities controller
 */

namespace App\Controller;

use Antxony\Def\Editable\Editable;
use Antxony\Util;
use App\Entity\SchedulePriority;
use App\Repository\SchedulePriorityRepository;
use App\Repository\ScheduleRepository;
use Exception;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;

/**
 * Class SchedulePriorityController
 * @package App\Controller
 * @Route("/schedulePriority")
 * @author Antxony <dantonyofcarim@gmail.com>
 */
class SchedulePriorityController extends AbstractController
{
    protected SchedulePriorityRepository $rep;

    protected ScheduleRepository $sRep;

    protected Util $util;

    public function __construct(SchedulePriorityRepository $rep, ScheduleRepository $sRep, Util $util)
    {
        $this->rep = $rep;
        $this->sRep = $sRep;
        $this->util = $util;
    }

    /**
     * index
     * 
     * @Route("", name="schedule_priority_index", methods={"GET"})
     * @IsGranted("ROLE_ADMIN")
     */
    public function index(): Response
    {
        return $this->render('view/schedule_priority/index.html.twig', [
            'controller_name' => 'SchedulePriorityController',
        ]);
    }

    /**
     * Get priority list
     *
     * @Route("/list", name="schedule_priority_list", methods={"GET"}, options={"expose" = true})
     * @IsGranted("ROLE_ADMIN")
     */
    public function list(Request  $request): Response
    {
        try {
            $params = json_decode(json_encode($request->query->all()));
            $result = $this->rep->getBy($params);
            $showed = ((isset($params->page)) ? $params->page * $this->util::PAGE_COUNT : $this->util::PAGE_COUNT);
            $categories = $result['paginator'];
            $maxPages = ceil($categories->count() / $this->util::PAGE_COUNT);
            return $this->render("view/schedule_priority/tbody.html.twig", [
                'priorities' => $categories,
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
     * @Route("/form", name="schedule_priority_add_form", methods={"GET"}, options={"expose" = true})
     * @IsGranted("ROLE_ADMIN")
     */
    public function form(): Response
    {
        try {
            return $this->render("view/schedule_priority/form.html.twig");
        } catch (Exception $e) {
            return $this->util->errorResponse($e);
        }
    }

    /**
     * Cargar formulario de cambio de prioridad
     *
     * @Route("/changeForm/{id}", name="schedule_priority_change_form", methods={"GET"}, options={"expose" = true})
     * @IsGranted("ROLE_ADMIN")
     */
    public function changeForm(int $id): Response
    {
        try {
            $task = $this->sRep->find($id);
            $categories = $this->rep->findAll();
            return $this->render("view/schedule_priority/changeForm.html.twig", [
                'task' => $task,
                'categories' => $categories,
            ]);
        } catch (Exception $e) {
            return $this->util->errorResponse($e);
        }
    }

    /**
     * Change priority
     *
     * @Route("/change", name="schedule_priority_change", methods={"PUT", "PATCH"}, options={"expose" = true})
     * @IsGranted("ROLE_ADMIN")
     */
    public function changeTaskPriority(Request $request): Response
    {
        try {
            $content = json_decode($request->getContent());
            $task = $this->sRep->find($content->scheduleId);
            $priority = $this->rep->find($content->priorityId);
            if ($task == null)
                throw new Exception("No se pudo localizar la tarea");
            if ($priority == null)
                throw new Exception("No se pudo localizar la prioridad");
            $oldCat = $task->getPriority();
            $task->setPriority($priority);
            $this->sRep->update();
            $message = "Se ha cambiado la prioridad de la tarea <b>{$task->getId()}</b> (<em>{$task->getTitle()}</em>)";
            if ($oldCat != null) {
                $message .= " de <b>{$oldCat->getName()}</b>";
            }
            $message .= " a <b>{$priority->getName()}</b>";
            $this->util->info($message);
            return new Response($message);
        } catch (Exception $e) {
            return $this->util->errorResponse($e);
        }
    }

    /**
     * Add priority
     *
     * @Route("/", name="schedule_priority_add", methods={"POST"}, options={"expose" = true})
     * @IsGranted("ROLE_ADMIN")
     */
    public function add(Request $request): Response
    {
        try {
            $content = json_decode($request->getContent());
            $priority = (new SchedulePriority())
                ->setName($content->name)
                ->setDescription($content->description)
                ->setColor($content->color);
            $this->rep->add($priority);
            $message = "Se ha agregado la prioridad <b>{$content->name}</b>";
            $this->util->info($message);
            return new Response($message);
        } catch (Exception $e) {
            return $this->util->errorResponse($e);
        }
    }

    /**
     * Delete priority
     *
     * @Route("/{id}", name="schedule_priority_delete", methods={"DELETE"}, options={"expose" = true})
     * @IsGranted("ROLE_ADMIN")
     */
    public function delete(int $id): Response
    {
        try {
            $priority = $this->rep->find($id);
            $this->rep->delete($priority);
            $message = "Se ha eliminado la prioridad <b><em>{$priority->getName()}</em></b>";
            $this->util->info($message);
            return new Response($message);
        } catch (Exception $e) {
            return $this->util->errorResponse($e);
        }
    }

    /**
     * Show priority
     *
     * @Route("/{id}", name="schedule_priority_show", methods={"GET"}, options={"expose" = true})
     * @IsGranted("ROLE_ADMIN")
     */
    public function show(int $id): Response
    {
        try {
            $priority = $this->rep->find($id);
            return $this->render("view/schedule_priority/show.html.twig", [
                'priority' => $priority
            ]);
        } catch (Exception $e) {
            return $this->util->errorResponse($e);
        }
    }

    /**
     * update color
     * 
     * @Route("/color", name="schedule_priority_color_edit", methods={"PUT", "PATCH"}, options={"expose" = true})
     * @IsGranted("ROLE_ADMIN")
     */
    public function updateColor(Request $request): Response
    {
        try {
            $content = json_decode($request->getContent());
            $category = $this->rep->find($content->id);
            if ($category == null) {
                throw new Exception("No se encontró la prioridad");
            }
            $category->setColor($content->newColor);
            $message = "Se ha actualizado el color";
            $this->rep->update();
            $this->util->info($message . " de la prioridad <b>{$category->getId()}</b> (<em>{$category->getName()}</em>)");
            return new Response($message);
        } catch (Exception $e) {
            return $this->util->errorResponse($e);
        }
    }

    /**
     * Update priority with x-editable
     *
     * @Route("/{id}", name="schedule_priority_edit", methods={"PUT", "PATCH"})
     * @IsGranted("ROLE_ADMIN")
     */
    public function update(int $id, Request $request): Response
    {
        try {
            parse_str($request->getContent(), $content);
            $editable = new Editable($content);
            $priority = $this->rep->find($id);
            if ($priority == null) {
                throw new Exception("No se pudo localizar la prioridad");
            }
            $message = "se ha actualizado";
            if ($editable->name == "priorityName") {
                $priority->setName($editable->value);
                $message .= " el nombre";
            }
            if ($editable->name == "priorityDescription") {
                $priority->setDescription($editable->value);
                $message .= " la descripción";
            }
            $this->rep->update();
            $this->util->info($message . " para la categoría <b>{$priority->getId()}</b> (<em>{$priority->getName()}</em>)");
            return new Response($message);
        } catch (Exception $e) {
            return $this->util->errorResponse($e);
        }
    }
}
