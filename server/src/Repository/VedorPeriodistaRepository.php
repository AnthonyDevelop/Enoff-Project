<?php

namespace App\Repository;

use App\Entity\VedorPeriodista;
use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use Doctrine\ORM\Query\Expr\Join;


/**
 * @extends ServiceEntityRepository<VedorPeriodista>
 *
 * @method VedorPeriodista|null find($id, $lockMode = null, $lockVersion = null)
 * @method VedorPeriodista|null findOneBy(array $criteria, array $orderBy = null)
 * @method VedorPeriodista[]    findAll()
 * @method VedorPeriodista[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class VedorPeriodistaRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, VedorPeriodista::class);
    }

    public function add(VedorPeriodista $entity, bool $flush = false): void
    {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(VedorPeriodista $entity, bool $flush = false): void
    {
        $this->getEntityManager()->remove($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }
}
