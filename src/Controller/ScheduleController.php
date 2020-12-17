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
                            $events[] = $event;
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

    /**
    * @Route("/week", name="schedule_week", methods={"GET"}, options={"expose" = true})
    */
    public function week(Request $request) : Response
    {
        try {
            setlocale(LC_TIME, "es_MX.UTF8");
            $params = json_decode(json_encode($request->query->all()));
            $offset = $params->offset;
            $monthName = strftime("%B %Y", strtotime("today {$offset} week"));
            $week = [];
            $actual = (int)strftime("%w", strtotime("0 day"));
            $eventsS = $this->rep->getBy("week", $params);
            for ($i=0; $i < 7; $i++) {
                $dif = $i - $actual;
                $evDay = strftime("%d-%m-%Y", strtotime("{$dif} day {$offset} week"));
                $events = [];
                foreach ($eventsS as $event) {
                    if($evDay == $event->getDate()->format("d-m-Y")) {
                        $events[] = $event;
                    }
                }
                $week[] = [
                    "name" => strftime("%A", strtotime("{$dif} day {$offset} week")),
                    "day" => strftime("%d", strtotime("{$dif} day {$offset} week")),
                    "date" => strftime("%d-%m-%Y", strtotime("{$dif} day {$offset} week")),
                    "events" => $events
                ];
            }
            return $this->render("view/schedule/types/week.html.twig", [
                'monthName' => $monthName,
                'week' => $week,
            ]);
        } catch (Exception $e) {
            return $this->util->errorResponse($e);
        }
    }

    /**
    * @Route("/day", name="schedule_day", methods={"GET"}, options={"expose" = true})
    */
    public function day(Request $request) : Response
    {
        try {
            setlocale(LC_TIME, "es_MX.UTF8");
            $day = [];
            $params = json_decode(json_encode($request->query->all()));
            $offset = $params->offset;
            $monthName = strftime("%B %Y", strtotime("today {$offset} day"));
            $day += ["name" => strftime("%A", strtotime("today {$offset} day"))];
            $day += ["day" => strftime("%d", strtotime("today {$offset} day"))];
            $day += ["date" => strftime("%d-%m-%Y", strtotime("today {$offset} day"))];
            $eventsS = $this->rep->getBy("week", $params);
            $events = [];
            $evDay = strftime("%d-%m-%Y", strtotime("today {$offset} day"));
            foreach ($eventsS as $event) {
                if($evDay == $event->getDate()->format("d-m-Y")) {
                    $events[] = $event;
                }
            }
            $day += ["events" => $events ];
            return $this->render("view/schedule/types/day.html.twig", [
                'monthName' => $monthName,
                'day' => $day,
            ]);
        } catch (Exception $e) {
            return $this->util->errorResponse($e);
        }
    }
}
