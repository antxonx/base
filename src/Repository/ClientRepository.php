<?php
/**
 * Client repository
 */
namespace App\Repository;

use App\Entity\Client;
use App\Entity\ClientExtra;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use Doctrine\ORM\Tools\Pagination\Paginator;
use Antxony\Util;
use Doctrine\Common\Collections\Criteria;
use Doctrine\ORM\Query\Expr\Join;

/**
 * @method Client|null find($id, $lockMode = null, $lockVersion = null)
 * @method Client|null findOneBy(array $criteria, array $orderBy = null)
 * @method Client[]    findAll()
 * @method Client[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ClientRepository extends ServiceEntityRepository
{
    /**
     * coonstruct
     *
     * @param ManagerRegistry $registry
     */
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Client::class);
    }

    /**
     * conseguir por filtrado
     *
     * @param mixed $params
     * @return void
     */
    public function getBy($params)
    {
        $page = ((isset($params->page))?$params->page:1);
        // Create our query
        $query = $this->createQueryBuilder('p');
        $query->orderBy("p." . $params->ordercol, $params->orderorder)
            /**
             * InnerJoin ya que la entidad Client no tiene una referencia direcita, sino al contrario, ClientExtra sí almacena el id del cliente
             * Incluimos la entidad de ClientExtra a Client con el alias ce.
             * Que cumpla con la condición p.id == ce.client (no client_id)
             */
            ->innerJoin(ClientExtra::class, "ce", Join::WITH, $query->expr()->eq('p.id', 'ce.client'));
        $query->addCriteria((new Criteria())->where(Criteria::expr()->eq("p.suspended", '0')));
        if (isset($params->search) && $params->search != "") {
            $searchCriteria = new Criteria();
            $searchCriteria->where(Criteria::expr()->contains("p.name", $params->search));
            $searchCriteria->orWhere(Criteria::expr()->contains("ce.value", $params->search));
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
     * @param Client $entity
     * @return void
     */
    public function add(Client $entity)
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
     * @param Client $entity
     * @return void
     */
    public function delete(Client $entity)
    {
        $this->getEntityManager()->remove($entity);
        $this->getEntityManager()->flush();
    }

    // /**
    //  * @return Client[] Returns an array of Client objects
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
    public function findOneBySomeField($value): ?Client
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
