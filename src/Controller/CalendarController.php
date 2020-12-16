<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Exception;
use Antxony\Util;

/**
* @Route("/calendar")
*/
class CalendarController extends AbstractController
{

    /**
    * @var Util
    */
    protected $util;

    public function __construct(Util $util)
    {
        $this->util = $util;
    }
    /**
     * @Route("", name="calendar_index", methods={"GET"})
     */
    public function index(): Response
    {
        return $this->render('view/calendar/index.html.twig', [
            'controller_name' => 'CalendarController',
        ]);
    }

    /**
    * @Route("/view", name="calendar_view", methods={"GET"}, options={"expose" = true})
    */
    public function view(): Response
    {
        try {
            $month = [];
            $first = (int)date("w", strtotime("first day of this month"));
            $last = (int)date("d", strtotime("last day of this month"));
            for ($i=0; $i < $last+$first; $i++) {
                if($i < $first) {
                    $month[] = null;
                } else {
                    $month[] = ($i - $first + 1);
                }
            }
            while(count($month) % 7 != 0) {
                $month[] = null;
            }
            return $this->render("view/calendar/types/month.html.twig", [
                'month' => $month
            ]);
        } catch (Exception $e) {
            return $this->util->errorResponse($e);
        }

    }
}
