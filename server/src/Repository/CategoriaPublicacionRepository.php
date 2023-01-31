<?php

namespace App\Repository;

use App\Entity\CategoriaPublicacion;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<CategoriaPublicacion>
 *
 * @method CategoriaPublicacion|null find($id, $lockMode = null, $lockVersion = null)
 * @method CategoriaPublicacion|null findOneBy(array $criteria, array $orderBy = null)
 * @method CategoriaPublicacion[]    findAll()
 * @method CategoriaPublicacion[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class CategoriaPublicacionRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, CategoriaPublicacion::class);
    }

    public function add(CategoriaPublicacion $entity, bool $flush = false): void
    {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(CategoriaPublicacion $entity, bool $flush = false): void
    {
        $this->getEntityManager()->remove($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

}
