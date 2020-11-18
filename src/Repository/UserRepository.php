<?php
/**
 * User repository
 */

namespace App\Repository;

use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ORM\OptimisticLockException;
use Doctrine\ORM\ORMException;
use Doctrine\ORM\Query\QueryException;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\Security\Core\Exception\UnsupportedUserException;
use Symfony\Component\Security\Core\User\PasswordUpgraderInterface;
use Symfony\Component\Security\Core\User\UserInterface;
use Doctrine\ORM\Tools\Pagination\Paginator;
use Antxony\Util;
use Doctrine\Common\Collections\Criteria;
use function get_class;

/**
 * UserRepository class
 *
 * @method User|null find($id, $lockMode = null, $lockVersion = null)
 * @method User|null findOneBy(array $criteria, array $orderBy = null)
 * @method User[]    findAll()
 * @method User[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class UserRepository extends ServiceEntityRepository implements PasswordUpgraderInterface
{
    /**
     * constructor
     *
     * @param ManagerRegistry $registry
     */
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, User::class);
    }

    /**
     * Used to upgrade (rehash) the user's password automatically over time.
     *
     * @param UserInterface $user
     * @param string $newEncodedPassword
     * @return void
     * @throws ORMException
     * @throws OptimisticLockException
     */
    public function upgradePassword(UserInterface $user, string $newEncodedPassword): void
    {
        if (!$user instanceof User) {
            throw new UnsupportedUserException(sprintf('Instances of "%s" are not supported.', get_class($user)));
        }

        $user->setPassword($newEncodedPassword);
        $this->_em->persist($user);
        $this->_em->flush();
    }

    /**
     * conseguir por filtrado
     *
     * @param mixed $params
     * @return array
     * @throws QueryException
     */
    public function getBy($params)
    {
        $page = ((isset($params->page)) ? $params->page : 1);
        $suspended = ((isset($params->suspended)) ? $params->suspended : 0);
        // Create our query
        $query = $this->createQueryBuilder('p')
            ->orderBy("p." . $params->ordercol, $params->orderorder)
            ->addCriteria(new Criteria(Criteria::expr()->eq("p.suspended", $suspended . '')));
        if (isset($params->search) && $params->search != "") {
            $searchCriteria = new Criteria();
            $searchCriteria->where(Criteria::expr()->contains("p.username", $params->search));
            $searchCriteria->orWhere(Criteria::expr()->contains("p.mail", $params->search));
            $searchCriteria->orWhere(Criteria::expr()->contains("p.name", $params->search));
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
     * @param User $entity
     * @return void
     * @throws ORMException
     * @throws OptimisticLockException
     */
    public function add(User $entity)
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
     * @param User $entity
     * @return void
     * @throws ORMException
     * @throws OptimisticLockException
     */
    public function delete(User $entity)
    {
        $this->getEntityManager()->remove($entity);
        $this->getEntityManager()->flush();
    }

    // /**
    //  * @return User[] Returns an array of User objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('u')
            ->andWhere('u.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('u.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?User
    {
        return $this->createQueryBuilder('u')
            ->andWhere('u.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
