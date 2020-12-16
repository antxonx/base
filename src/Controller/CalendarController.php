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
            setlocale(LC_TIME, "es_MX.UTF8");
            $month = [];
            $first = (int)strftime("%w", strtotime("first day of this month"));
            $last = (int)strftime("%e", strtotime("last day of this month"));
            $monthName = strftime("%B", strtotime("this month"));
            $week = [];
            for ($i=0; $i < 7; $i++) {
                $dif = $i - $first -1;
                $week[] = strftime("%A", strtotime("{$dif} day"));
            }
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
                'month' => $month,
                'monthName' => $monthName,
                'week' => $week
            ]);
        } catch (Exception $e) {
            return $this->util->errorResponse($e);
        }

    }
}
