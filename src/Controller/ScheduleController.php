<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use App\Repository\ScheduleRepository;
use App\Repository\ScheduleCategoryRepository;
use App\Repository\SchedulePriorityRepository;
use Exception;
use Antxony\Util;
use DateTime;
use DateTimeZone;

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

    /**
    * @var ScheduleCategoryRepository
    */
    protected $scRep;

    /**
    * @var SchedulePriorityRepository
    */
    protected $spRep;

    public function __construct(Util $util, ScheduleRepository $rep, ScheduleCategoryRepository $scRep, SchedulePriorityRepository $spRep)
    {
        $this->util = $util;
        $this->rep = $rep;
        $this->scRep = $scRep;
        $this->spRep = $spRep;
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
                $day = ($i - $first + 1);
                if($i < $first) {
                    $month[] = [
                        'day' => null,
                        'date' => '',
                        'events' => []
                    ];
                } else {
                    $events = [];
                    foreach ($eventsS as $event) {
                        $eventDay = (int)$event->getDate()->format('d');
                        if($eventDay == $day) {
                            $events[] = $event;
                        }
                    }
                    $today = strftime("%d", strtotime("today"));
                    $diff = $day - $today;
                    $month[] = [
                        'day' => $day,
                        'date' => strftime("%d-%m-%Y", strtotime("{$diff} day {$monthOffset} month")),
                        'events' => $events
                    ];
                }
            }
            while(count($month) % 7 != 0) {
                $month[] = [
                    'day' => null,
                    'date' => '',
                    'events' => []
                ];
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

    /**
    * @Route("/form", name="schedule_form", methods={"GET"}, options={"expose" = true})
    */
    public function form() : Response
    {
        try {
            $categories = $this->scRep->findAll();
            $priorities = $this->spRep->findAll();
            return $this->render("view/schedule/form.html.twig", [
                'categories' => $categories,
                'priorities' => $priorities
            ]);
        } catch (Exception $e) {
            return $this->util->errorResponse($e);
        }
    }

    /**
    * @Route("/", name="schedule_add", methods={"POST"}, options={"expose" = true})
    */
    public function add() : Response
    {
        try {
            return new Response("ok");
        } catch (Exception $e) {
            return $this->util->errorResponse($e);
        }
    }
}
