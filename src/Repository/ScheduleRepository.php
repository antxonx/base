<?php

namespace App\Repository;

use App\Entity\Schedule;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ORM\OptimisticLockException;
use Doctrine\ORM\ORMException;
use Doctrine\ORM\Query\QueryException;
use Doctrine\Persistence\ManagerRegistry;
use Doctrine\Common\Collections\Criteria;
use DateTime;
use DateTimeZone;

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

    public function getBy(string $type, $params) : array
    {
        $offset = ((isset($params->offset)) ? $params->offset : 0);
        $query = $this->createQueryBuilder('p')
            ->orderBy("p.date", "ASC");
            if(!$params->actualUser->hasRole("ROLE_SUPERVISOR")) {
                $userCriteria = new Criteria();
                $userCriteria->where(Criteria::expr()->eq('p.createdBy', $params->actualUser->getId()));
                $userCriteria->orWhere(Criteria::expr()->eq('p.assigned', $params->actualUser->getId()));
                $query->addCriteria($userCriteria);
            }
        switch ($type) {
            case 'month':
                $start = new DateTime("first day of {$offset} month", new DateTimeZone("America/Mexico_city"));
                $finish = new DateTime("last day of {$offset} month", new DateTimeZone("America/Mexico_city"));
                $dateCriteria = new Criteria();
                $dateCriteria->where(Criteria::expr()->gt("p.date", $start));
                $dateCriteria->andWhere(Criteria::expr()->lt("p.date", $finish));
                $query->addCriteria($dateCriteria);
                break;
            case 'week':
                $start = new DateTime("first day of {$offset} week", new DateTimeZone("America/Mexico_city"));
                $finish = new DateTime("last day of {$offset} week", new DateTimeZone("America/Mexico_city"));
                $dateCriteria = new Criteria();
                $dateCriteria->where(Criteria::expr()->gt("p.date", $start));
                $dateCriteria->andWhere(Criteria::expr()->lt("p.date", $finish));
                $query->addCriteria($dateCriteria);
                break;
            case 'day':
                $last = $offset + 1;
                $start = new DateTime("today {$offset} day", new DateTimeZone("America/Mexico_city"));
                $finish = new DateTime("today {$last} day -1 second", new DateTimeZone("America/Mexico_city"));
                $dateCriteria = new Criteria();
                $dateCriteria->where(Criteria::expr()->gt("p.date", $start));
                $dateCriteria->andWhere(Criteria::expr()->lt("p.date", $finish));
                $query->addCriteria($dateCriteria);
                break;
            default:
                // code...
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
