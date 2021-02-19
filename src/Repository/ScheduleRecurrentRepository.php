<?php

namespace App\Repository;

use App\Entity\ScheduleRecurrent;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use Doctrine\Common\Collections\Criteria;
use DateTime;
use DateTimeZone;
use Doctrine\ORM\Query\Expr\Join;
use Exception;

/**
 * @method ScheduleRecurrent|null find($id, $lockMode = null, $lockVersion = null)
 * @method ScheduleRecurrent|null findOneBy(array $criteria, array $orderBy = null)
 * @method ScheduleRecurrent[]    findAll()
 * @method ScheduleRecurrent[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ScheduleRecurrentRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, ScheduleRecurrent::class);
    }

    /**
     * Undocumented function
     * @return ScheduleRecurrent[]
     */
    public function getBy(string $type, $params, $dayString): array
    {
        $offset = ((isset($params->offset)) ? $params->offset : 0);
        $query = $this->createQueryBuilder('p')
            ->orderBy("p.id", "ASC");
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
        if($params->category != 0) {
            $categoryCriteria = new Criteria();
            $categoryCriteria->where(Criteria::expr()->eq('p.category', $params->category));
            $query->addCriteria($categoryCriteria);
        }
        switch ($type) {
            case 'year':
                $start = new DateTime($dayString . "+1 day", new DateTimeZone("America/Mexico_city"));
                $typeCriteria = new Criteria();
                $typeCriteria->where(Criteria::expr()->eq('p.type', 1));
                $typeCriteria->andWhere(Criteria::expr()->lte('p.createdAt', $start));
                $query->addCriteria($typeCriteria);
                break;
            case 'month':
                $start = new DateTime($dayString . "+1 day", new DateTimeZone("America/Mexico_city"));
                $typeCriteria = new Criteria();
                $typeCriteria->where(Criteria::expr()->eq('p.type', 2));
                $typeCriteria->andWhere(Criteria::expr()->lte('p.createdAt', $start));
                $query->addCriteria($typeCriteria);
                break;
            case 'week':
                $start = new DateTime($dayString . "+1 day", new DateTimeZone("America/Mexico_city"));
                $typeCriteria = new Criteria();
                $typeCriteria->where(Criteria::expr()->eq('p.type', 3));
                $typeCriteria->andWhere(Criteria::expr()->lte('p.createdAt', $start));
                $query->addCriteria($typeCriteria);
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
     * @param ScheduleRecurrent $entity
     * @return void
     * @throws ORMException
     * @throws OptimisticLockException
     */
    public function add(ScheduleRecurrent $entity)
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
     * @param ScheduleRecurrent $entity
     * @return void
     * @throws ORMException
     * @throws OptimisticLockException
     */
    public function delete(ScheduleRecurrent $entity)
    {
        $this->getEntityManager()->remove($entity);
        $this->getEntityManager()->flush();
    }


    // /**
    //  * @return ScheduleRecurrent[] Returns an array of ScheduleRecurrent objects
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
    public function findOneBySomeField($value): ?ScheduleRecurrent
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
