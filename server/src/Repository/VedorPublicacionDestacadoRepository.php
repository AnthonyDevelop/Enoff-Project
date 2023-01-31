<?php

namespace App\Repository;

use App\Entity\VedorPublicacionDestacado;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<VedorPublicacionDestacado>
 *
 * @method VedorPublicacionDestacado|null find($id, $lockMode = null, $lockVersion = null)
 * @method VedorPublicacionDestacado|null findOneBy(array $criteria, array $orderBy = null)
 * @method VedorPublicacionDestacado[]    findAll()
 * @method VedorPublicacionDestacado[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class VedorPublicacionDestacadoRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, VedorPublicacionDestacado::class);
    }

    public function add(VedorPublicacionDestacado $entity, bool $flush = false): void
    {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(VedorPublicacionDestacado $entity, bool $flush = false): void
    {
        $this->getEntityManager()->remove($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

//    /**
//     * @return VedorPublicacionDestacado[] Returns an array of VedorPublicacionDestacado objects
//     */
//    public function findByExampleField($value): array
//    {
//        return $this->createQueryBuilder('v')
//            ->andWhere('v.exampleField = :val')
//            ->setParameter('val', $value)
//            ->orderBy('v.id', 'ASC')
//            ->setMaxResults(10)
//            ->getQuery()
//            ->getResult()
//        ;
//    }

//    public function findOneBySomeField($value): ?VedorPublicacionDestacado
//    {
//        return $this->createQueryBuilder('v')
//            ->andWhere('v.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
}
