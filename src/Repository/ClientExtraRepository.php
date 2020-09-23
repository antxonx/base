<?php
/**
 * ClientExtra repository
 */
namespace App\Repository;

use App\Entity\ClientExtra;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method ClientExtra|null find($id, $lockMode = null, $lockVersion = null)
 * @method ClientExtra|null findOneBy(array $criteria, array $orderBy = null)
 * @method ClientExtra[]    findAll()
 * @method ClientExtra[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ClientExtraRepository extends ServiceEntityRepository
{
    /**
     * Constructor
     *
     * @param ManagerRegistry $registry
     */
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, ClientExtra::class);
    }

    /**
     * Agregar entidad
     *
     * @param ClientExtra $entity
     * @return void
     */
    public function add(ClientExtra $entity)
    {
        $this->getEntityManager()->persist($entity);
        $this->getEntityManager()->flush();
    }

    /**
     * Actualizar entidad
     *
     * @return void
     */
    public function update()
    {
        $this->getEntityManager()->flush();
    }

    /**
     * Eliminar entidad
     *
     * @param ClientExtra $entity
     * @return void
     */
    public function delete(ClientExtra $entity)
    {
        $this->getEntityManager()->remove($entity);
        $this->getEntityManager()->flush();
    }

    // /**
    //  * @return ClientExtra[] Returns an array of ClientExtra objects
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
    public function findOneBySomeField($value): ?ClientExtra
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
