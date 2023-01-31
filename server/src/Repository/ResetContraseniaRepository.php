<?php

namespace App\Repository;

use App\Entity\ResetContrasenia;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<ResetContrasenia>
 *
 * @method ResetContrasenia|null find($id, $lockMode = null, $lockVersion = null)
 * @method ResetContrasenia|null findOneBy(array $criteria, array $orderBy = null)
 * @method ResetContrasenia[]    findAll()
 * @method ResetContrasenia[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ResetContraseniaRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, ResetContrasenia::class);
    }

    public function add(ResetContrasenia $entity, bool $flush = false): void
    {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(ResetContrasenia $entity, bool $flush = false): void
    {
        $this->getEntityManager()->remove($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

//    /**
//     * @return ResetContrasenia[] Returns an array of ResetContrasenia objects
//     */
//    public function findByExampleField($value): array
//    {
//        return $this->createQueryBuilder('r')
//            ->andWhere('r.exampleField = :val')
//            ->setParameter('val', $value)
//            ->orderBy('r.id', 'ASC')
//            ->setMaxResults(10)
//            ->getQuery()
//            ->getResult()
//        ;
//    }

//    public function findOneBySomeField($value): ?ResetContrasenia
//    {
//        return $this->createQueryBuilder('r')
//            ->andWhere('r.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
}
