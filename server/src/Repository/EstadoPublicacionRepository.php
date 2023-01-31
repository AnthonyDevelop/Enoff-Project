<?php

namespace App\Repository;

use App\Entity\EstadoPublicacion;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<EstadoPublicacion>
 *
 * @method EstadoPublicacion|null find($id, $lockMode = null, $lockVersion = null)
 * @method EstadoPublicacion|null findOneBy(array $criteria, array $orderBy = null)
 * @method EstadoPublicacion[]    findAll()
 * @method EstadoPublicacion[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class EstadoPublicacionRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, EstadoPublicacion::class);
    }

    public function add(EstadoPublicacion $entity, bool $flush = false): void
    {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(EstadoPublicacion $entity, bool $flush = false): void
    {
        $this->getEntityManager()->remove($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

}
