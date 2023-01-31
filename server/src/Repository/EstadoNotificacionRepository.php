<?php

namespace App\Repository;

use App\Entity\EstadoNotificacion;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<EstadoNotificacion>
 *
 * @method EstadoNotificacion|null find($id, $lockMode = null, $lockVersion = null)
 * @method EstadoNotificacion|null findOneBy(array $criteria, array $orderBy = null)
 * @method EstadoNotificacion[]    findAll()
 * @method EstadoNotificacion[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class EstadoNotificacionRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, EstadoNotificacion::class);
    }

    public function add(EstadoNotificacion $entity, bool $flush = false): void
    {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(EstadoNotificacion $entity, bool $flush = false): void
    {
        $this->getEntityManager()->remove($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

}
