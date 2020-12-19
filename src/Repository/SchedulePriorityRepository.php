<?php

namespace App\Repository;

use Antxony\Util;
use App\Entity\SchedulePriority;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Common\Collections\Criteria;
use Doctrine\ORM\OptimisticLockException;
use Doctrine\ORM\ORMException;
use Doctrine\ORM\Query\QueryException;
use Doctrine\ORM\Tools\Pagination\Paginator;
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

    /**
     * @param $params
     * @return array
     * @throws QueryException
     */
    public function getBy($params): array
    {
        $page = ((isset($params->page)) ? $params->page : 1);
        // Create our query
        $query = $this->createQueryBuilder('p');
        $query->orderBy("p." . $params->ordercol, $params->orderorder);
        if (isset($params->search) && $params->search != "") {
            $searchCriteria = new Criteria();
            $searchCriteria->where(Criteria::expr()->contains("p.name", $params->search));
            $searchCriteria->orWhere(Criteria::expr()->contains("p.description", $params->search));
            $query->addCriteria($searchCriteria);
        }
        $query->getQuery();
        $paginator = new Paginator($query);
        $paginator->getQuery()
            ->setFirstResult(Util::PAGE_COUNT * ($page - 1)) // Offset
            ->setMaxResults(Util::PAGE_COUNT); // Limit

        return array('paginator' => $paginator, 'query' => $query);
    }

    /**
     * Agregar entidad
     *
     * @param SchedulePriority $entity
     * @return void
     * @throws ORMException
     * @throws OptimisticLockException
     */
    public function add(SchedulePriority $entity)
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
     * @param SchedulePriority $entity
     * @return void
     * @throws ORMException
     * @throws OptimisticLockException
     */
    public function delete(SchedulePriority $entity)
    {
        foreach($entity->getSchedules(true) as $sch) {
            $sch->setPriority(null);
        }
        $this->getEntityManager()->remove($entity);
        $this->getEntityManager()->flush();
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
