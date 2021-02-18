<?php

namespace App\Repository;

use App\Entity\ScheduleRecurrentObs;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method ScheduleRecurrentObs|null find($id, $lockMode = null, $lockVersion = null)
 * @method ScheduleRecurrentObs|null findOneBy(array $criteria, array $orderBy = null)
 * @method ScheduleRecurrentObs[]    findAll()
 * @method ScheduleRecurrentObs[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ScheduleRecurrentObsRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, ScheduleRecurrentObs::class);
    }

    // /**
    //  * @return ScheduleRecurrentObs[] Returns an array of ScheduleRecurrentObs objects
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
    public function findOneBySomeField($value): ?ScheduleRecurrentObs
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
