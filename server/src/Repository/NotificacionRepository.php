<?php

namespace App\Repository;

use App\Entity\Notificacion;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use Doctrine\ORM\Tools\Pagination\Paginator;


/**
 * @extends ServiceEntityRepository<Notificacion>
 *
 * @method Notificacion|null find($id, $lockMode = null, $lockVersion = null)
 * @method Notificacion|null findOneBy(array $criteria, array $orderBy = null)
 * @method Notificacion[]    findAll()
 * @method Notificacion[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class NotificacionRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Notificacion::class);
    }

    public function add(Notificacion $entity, bool $flush = false): void
    {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(Notificacion $entity, bool $flush = false): void
    {
        $this->getEntityManager()->remove($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    /**
    * @return Notificacion[] 
    */

    public function getAllNotificaciones($currentPage,$iduser,$limit): array
    {
        $query = $this->createQueryBuilder('n')->andWhere('n.idUser = :iduser')->setParameter('iduser',$iduser)->orderBy('n.dateCreate','DESC');

        $query = $query->getQuery();                    

        $paginator = $this->paginate($query, $currentPage, $limit);

        return array('paginator' => $paginator, 'query' => $query);
    }

    /**
    * @return Notificacion[] Returns an array of Garantia objects
    */

    public function paginate($dql, $page = 1, $limit = 3):paginator
    {
        $paginator = new Paginator($dql);

        $paginator->getQuery()
            ->setFirstResult($limit * ($page - 1)) // Offset
            ->setMaxResults($limit); // Limit

        return $paginator;
    }
}
