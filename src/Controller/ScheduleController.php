<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use App\Repository\ScheduleRepository;
use Exception;
use Antxony\Util;

/**
* @Route("/schedule")
*/
class ScheduleController extends AbstractController
{

    /**
    * @var Util
    */
    protected $util;

    /**
    * @var ScheduleRepository
    */
    protected $rep;

    public function __construct(Util $util, ScheduleRepository $rep)
    {
        $this->util = $util;
        $this->rep = $rep;
    }
    /**
     * @Route("", name="schedule_index", methods={"GET"})
     */
    public function index(): Response
    {
        return $this->render('view/schedule/index.html.twig', [
            'controller_name' => 'CalendarController',
        ]);
    }

    /**
    * @Route("/month", name="schedule_month", methods={"GET"}, options={"expose" = true})
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
            $monthName = strftime("%B %Y", strtotime("today {$monthOffset} month"));
            $week = [];
            $eventsS = $this->rep->getBy("month", $params);
            for ($i=0; $i < 7; $i++) {
                $dif = $i - $actual;
                $week[] = strftime("%A", strtotime("{$dif} day"));
            }
            for ($i=0; $i < $last+$first; $i++) {
                if($i < $first) {
                    $month[] = ['day' => null, 'events' => []];
                } else {
                    $events = [];
                    foreach ($eventsS as $event) {
                        $eventDay = (int)$event->getDate()->format('d');
                        if($eventDay == ($i - $first + 1)) {
                            $events[] = [
                                    'color' => $event->getColor(),
                                    'title' => $event->getTitle()
                                ];
                        }
                    }
                    $month[] = ['day' => ($i - $first + 1), 'events' => $events];
                }
            }
            while(count($month) % 7 != 0) {
                $month[] = ['day' => null, 'events' => []];
            }
            return $this->render("view/schedule/types/month.html.twig", [
                'first' => $first,
                'month' => $month,
                'monthName' => $monthName,
                'week' => $week,
            ]);
        } catch (Exception $e) {
            return $this->util->errorResponse($e);
        }

    }
}
