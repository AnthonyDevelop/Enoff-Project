<?php

namespace App\Repository;

use App\Entity\Comentario;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Comentario>
 *
 * @method Comentario|null find($id, $lockMode = null, $lockVersion = null)
 * @method Comentario|null findOneBy(array $criteria, array $orderBy = null)
 * @method Comentario[]    findAll()
 * @method Comentario[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ComentarioRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Comentario::class);
    }

    public function add(Comentario $entity, bool $flush = false): void
    {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(Comentario $entity, bool $flush = false): void
    {
        $this->getEntityManager()->remove($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

}
