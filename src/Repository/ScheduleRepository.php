<?php

namespace App\Repository;

use App\Entity\Schedule;
use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ORM\OptimisticLockException;
use Doctrine\ORM\ORMException;
use Doctrine\ORM\Query\QueryException;
use Doctrine\Persistence\ManagerRegistry;
use Doctrine\Common\Collections\Criteria;
use DateTime;
use DateTimeZone;
use Doctrine\ORM\Query\Expr\Join;
use Exception;

/**
 * @method Schedule|null find($id, $lockMode = null, $lockVersion = null)
 * @method Schedule|null findOneBy(array $criteria, array $orderBy = null)
 * @method Schedule[]    findAll()
 * @method Schedule[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ScheduleRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Schedule::class);
    }

    public function getBy(string $type, $params): array
    {
        $offset = ((isset($params->offset)) ? $params->offset : 0);
        $query = $this->createQueryBuilder('p')
            ->orderBy("p.date", "ASC");
        if (!$params->actualUser->hasRole("ROLE_SUPERVISOR") || $params->me) {
            $userCriteria = new Criteria();
            $userCriteria->where(Criteria::expr()->eq('p.createdBy', $params->actualUser->getId()));
            $userCriteria->orWhere(Criteria::expr()->eq('p.assigned', $params->actualUser->getId()));
            $query->addCriteria($userCriteria);
        }
        if ($params->search != '') {
            $query->leftJoin('p.assigned', "a");
            $searchCriteria = new Criteria();
            $searchCriteria->where(Criteria::expr()->contains('p.title', $params->search));
            $searchCriteria->orWhere(Criteria::expr()->contains('a.name', $params->search));
            $query->addCriteria($searchCriteria);
        }
        if (!$params->finished) {
            $finishedCriteria = new Criteria();
            $finishedCriteria->where(Criteria::expr()->eq('p.done', $params->finished));
            $query->addCriteria($finishedCriteria);
        }
        if($params->category != 0) {
            $categoryCriteria = new Criteria();
            $categoryCriteria->where(Criteria::expr()->eq('p.category', $params->category));
            $query->addCriteria($categoryCriteria);
        }
        switch ($type) {
            case 'month':
                $start = new DateTime("first day of this month {$offset} month midnight", new DateTimeZone("America/Mexico_city"));
                $finish = new DateTime("first day of next month {$offset} month midnight -1 second", new DateTimeZone("America/Mexico_city"));
                $dateCriteria = new Criteria();
                $dateCriteria->where(Criteria::expr()->gte("p.date", $start));
                $dateCriteria->andWhere(Criteria::expr()->lte("p.date", $finish));
                $query->addCriteria($dateCriteria);
                break;
            case 'week':
                $start = new DateTime("last sunday midnight {$offset} week", new DateTimeZone("America/Mexico_city"));
                $finish = new DateTime("next sunday midnight {$offset} week -1 second", new DateTimeZone("America/Mexico_city"));
                $dateCriteria = new Criteria();
                $dateCriteria->where(Criteria::expr()->gte("p.date", $start));
                $dateCriteria->andWhere(Criteria::expr()->lte("p.date", $finish));
                $query->addCriteria($dateCriteria);
                break;
            case 'day':
                $last = $offset + 1;
                $start = new DateTime("today {$offset} day", new DateTimeZone("America/Mexico_city"));
                $finish = new DateTime("today {$last} day -1 second", new DateTimeZone("America/Mexico_city"));
                $dateCriteria = new Criteria();
                $dateCriteria->where(Criteria::expr()->gte("p.date", $start));
                $dateCriteria->andWhere(Criteria::expr()->lte("p.date", $finish));
                $query->addCriteria($dateCriteria);
                break;
            default:
                throw new Exception("Ocurrió un error con el calendario");
                break;
        }
        return $query->getQuery()->getResult();
    }

    /**
     * Agregar entidad
     *
     * @param Schedule $entity
     * @return void
     * @throws ORMException
     * @throws OptimisticLockException
     */
    public function add(Schedule $entity)
    {
        $this->getEntityManager()->persist($entity);
        $this->getEntityManager()->flush();
    }

    /**
     * Actualizar entidad
     *
     * @return void
     * @throws ORMException
     * @throws OptimisticLockException
     */
    public function update()
    {
        $this->getEntityManager()->flush();
    }

    /**
     * Eliminar entidad
     *
     * @param Schedule $entity
     * @return void
     * @throws ORMException
     * @throws OptimisticLockException
     */
    public function delete(Schedule $entity)
    {
        $this->getEntityManager()->remove($entity);
        $this->getEntityManager()->flush();
    }

    // /**
    //  * @return Schedule[] Returns an array of Schedule objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('s')
            ->andWhere('s.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('s.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?Schedule
    {
        return $this->createQueryBuilder('s')
            ->andWhere('s.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
