<?php

namespace App\Repository;

use App\Entity\VedorPublicacionVisto;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<VedorPublicacionVisto>
 *
 * @method VedorPublicacionVisto|null find($id, $lockMode = null, $lockVersion = null)
 * @method VedorPublicacionVisto|null findOneBy(array $criteria, array $orderBy = null)
 * @method VedorPublicacionVisto[]    findAll()
 * @method VedorPublicacionVisto[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class VedorPublicacionVistoRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, VedorPublicacionVisto::class);
    }

    public function save(VedorPublicacionVisto $entity, bool $flush = false): void
    {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(VedorPublicacionVisto $entity, bool $flush = false): void
    {
        $this->getEntityManager()->remove($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

//    /**
//     * @return VedorPublicacionVisto[] Returns an array of VedorPublicacionVisto objects
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

//    public function findOneBySomeField($value): ?VedorPublicacionVisto
//    {
//        return $this->createQueryBuilder('v')
//            ->andWhere('v.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
}
