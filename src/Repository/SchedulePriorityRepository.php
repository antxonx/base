<?php

namespace App\Repository;

use App\Entity\SchedulePriority;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method SchedulePriority|null find($id, $lockMode = null, $lockVersion = null)
 * @method SchedulePriority|null findOneBy(array $criteria, array $orderBy = null)
 * @method SchedulePriority[]    findAll()
 * @method SchedulePriority[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class SchedulePriorityRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, SchedulePriority::class);
    }

    // /**
    //  * @return SchedulePriority[] Returns an array of SchedulePriority objects
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
    public function findOneBySomeField($value): ?SchedulePriority
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
