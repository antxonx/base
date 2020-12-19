<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

/**
* @Route("/schedulePriority")
*/
class SchedulePriorityController extends AbstractController
{
    /**
     * @Route("", name="schedule_priority_index")
     */
    public function index(): Response
    {
        return $this->render('view/schedule_priority/index.html.twig', [
            'controller_name' => 'SchedulePriorityController',
        ]);
    }
}
