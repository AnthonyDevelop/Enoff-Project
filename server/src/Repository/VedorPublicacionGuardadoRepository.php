<?php

namespace App\Repository;

use App\Entity\VedorPublicacionGuardado;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<VedorPublicacionGuardado>
 *
 * @method VedorPublicacionGuardado|null find($id, $lockMode = null, $lockVersion = null)
 * @method VedorPublicacionGuardado|null findOneBy(array $criteria, array $orderBy = null)
 * @method VedorPublicacionGuardado[]    findAll()
 * @method VedorPublicacionGuardado[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class VedorPublicacionGuardadoRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, VedorPublicacionGuardado::class);
    }

    public function add(VedorPublicacionGuardado $entity, bool $flush = false): void
    {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(VedorPublicacionGuardado $entity, bool $flush = false): void
    {
        $this->getEntityManager()->remove($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }


}
