<?php

namespace App\Repository;

use App\Entity\UserPublicacionUrgente;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<UserPublicacionUrgente>
 *
 * @method UserPublicacionUrgente|null find($id, $lockMode = null, $lockVersion = null)
 * @method UserPublicacionUrgente|null findOneBy(array $criteria, array $orderBy = null)
 * @method UserPublicacionUrgente[]    findAll()
 * @method UserPublicacionUrgente[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class UserPublicacionUrgenteRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, UserPublicacionUrgente::class);
    }

    public function save(UserPublicacionUrgente $entity, bool $flush = false): void
    {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(UserPublicacionUrgente $entity, bool $flush = false): void
    {
        $this->getEntityManager()->remove($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

//    /**
//     * @return UserPublicacionUrgente[] Returns an array of UserPublicacionUrgente objects
//     */
//    public function findByExampleField($value): array
//    {
//        return $this->createQueryBuilder('u')
//            ->andWhere('u.exampleField = :val')
//            ->setParameter('val', $value)
//            ->orderBy('u.id', 'ASC')
//            ->setMaxResults(10)
//            ->getQuery()
//            ->getResult()
//        ;
//    }

//    public function findOneBySomeField($value): ?UserPublicacionUrgente
//    {
//        return $this->createQueryBuilder('u')
//            ->andWhere('u.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
}
