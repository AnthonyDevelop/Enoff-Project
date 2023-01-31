<?php

namespace App\Repository;

use App\Entity\VedorPublicacionDescartado;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<VedorPublicacionDescartado>
 *
 * @method VedorPublicacionDescartado|null find($id, $lockMode = null, $lockVersion = null)
 * @method VedorPublicacionDescartado|null findOneBy(array $criteria, array $orderBy = null)
 * @method VedorPublicacionDescartado[]    findAll()
 * @method VedorPublicacionDescartado[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class VedorPublicacionDescartadoRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, VedorPublicacionDescartado::class);
    }

    public function add(VedorPublicacionDescartado $entity, bool $flush = false): void
    {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(VedorPublicacionDescartado $entity, bool $flush = false): void
    {
        $this->getEntityManager()->remove($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

}
