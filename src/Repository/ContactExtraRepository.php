<?php
/**
 * ContractExtra Repository
 */
namespace App\Repository;

use App\Entity\ContactExtra;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method ContactExtra|null find($id, $lockMode = null, $lockVersion = null)
 * @method ContactExtra|null findOneBy(array $criteria, array $orderBy = null)
 * @method ContactExtra[]    findAll()
 * @method ContactExtra[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ContactExtraRepository extends ServiceEntityRepository
{
    /**
     * Constructor
     *
     * @param ManagerRegistry $registry
     */
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, ContactExtra::class);
    }

    /**
     * Agregar entidad
     *
     * @param ContactExtra $entity
     * @return void
     */
    public function add(ContactExtra $entity)
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
     * @param ContactExtra $entity
     * @return void
     */
    public function delete(ContactExtra $entity)
    {
        $this->getEntityManager()->remove($entity);
        $this->getEntityManager()->flush();
    }

    // /**
    //  * @return ContactExtra[] Returns an array of ContactExtra objects
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
    public function findOneBySomeField($value): ?ContactExtra
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
