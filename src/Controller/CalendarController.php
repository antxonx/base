<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;
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
    * @Route("/month", name="calendar_month", methods={"GET"}, options={"expose" = true})
    */
    public function month(Request $request): Response
    {
        try {
            setlocale(LC_TIME, "es_MX.UTF8");
            $params = json_decode(json_encode($request->query->all()));
            $monthOffset = $params->offset;
            $month = [];
            $first = (int)strftime("%w", strtotime("first day of {$monthOffset} month"));
            $last = (int)strftime("%e", strtotime("last day of {$monthOffset} month"));
            $actual = (int)strftime("%w", strtotime("0 day"));
            $monthName = strftime("%B %Y", strtotime("{$monthOffset} month"));
            $week = [];
            for ($i=0; $i < 7; $i++) {
                $dif = $i - $actual;
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
                'first' => $first,
                'month' => $month,
                'monthName' => $monthName,
                'week' => $week
            ]);
        } catch (Exception $e) {
            return $this->util->errorResponse($e);
        }

    }
}
