<?php

namespace App\Repository;

use App\Entity\ClientObs;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method ClientObs|null find($id, $lockMode = null, $lockVersion = null)
 * @method ClientObs|null findOneBy(array $criteria, array $orderBy = null)
 * @method ClientObs[]    findAll()
 * @method ClientObs[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ClientObsRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, ClientObs::class);
    }

    // /**
    //  * @return ClientObs[] Returns an array of ClientObs objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('c')
            ->andWhere('c.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('c.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?ClientObs
    {
        return $this->createQueryBuilder('c')
            ->andWhere('c.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
