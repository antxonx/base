<?php
/**
 *  ClientAddress Repository
 */

namespace App\Repository;

use App\Entity\ClientAddress;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ORM\OptimisticLockException;
use Doctrine\ORM\ORMException;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method ClientAddress|null find($id, $lockMode = null, $lockVersion = null)
 * @method ClientAddress|null findOneBy(array $criteria, array $orderBy = null)
 * @method ClientAddress[]    findAll()
 * @method ClientAddress[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ClientAddressRepository extends ServiceEntityRepository
{
    /**
     * Constructor
     *
     * @param ManagerRegistry $registry
     */
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, ClientAddress::class);
    }

    /**
     * Agregar entidad
     *
     * @param ClientAddress $entity
     * @return void
     * @throws ORMException
     * @throws OptimisticLockException
     */
    public function add(ClientAddress $entity)
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
     * @param ClientAddress $entity
     * @return void
     * @throws ORMException
     * @throws OptimisticLockException
     */
    public function delete(ClientAddress $entity)
    {
        $this->getEntityManager()->remove($entity);
        $this->getEntityManager()->flush();
    }

    // /**
    //  * @return ClientAddress[] Returns an array of ClientAddress objects
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
    public function findOneBySomeField($value): ?ClientAddress
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
