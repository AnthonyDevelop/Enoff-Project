<?php

namespace App\Repository;

use App\Entity\VedorPublicacionComprado;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use Doctrine\ORM\Tools\Pagination\Paginator;

/**
 * @extends ServiceEntityRepository<VedorPublicacionComprado>
 *
 * @method VedorPublicacionComprado|null find($id, $lockMode = null, $lockVersion = null)
 * @method VedorPublicacionComprado|null findOneBy(array $criteria, array $orderBy = null)
 * @method VedorPublicacionComprado[]    findAll()
 * @method VedorPublicacionComprado[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class VedorPublicacionCompradoRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, VedorPublicacionComprado::class);
    }

    public function add(VedorPublicacionComprado $entity, bool $flush = false): void
    {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(VedorPublicacionComprado $entity, bool $flush = false): void
    {
        $this->getEntityManager()->remove($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

      /**
      * @return VedorPublicacionComprado[] 
      */

      public function getComprasVedorMes($idVedor): array
      {
        date_default_timezone_set('America/Argentina/Buenos_Aires');
        $zonahoraria = date_default_timezone_get();

        $anioActual = date("Y");
        $mesActual = date("m");
        $cantidadDiasDelMes = date("d",mktime(0,0,0,$mesActual+1,0,$anioActual));
        
        $query = $this->createQueryBuilder('g')->orderBy('g.id ','DESC');
        
        $query
            ->andWhere('g.idVedor = :idVedor')
            ->setParameter('idVedor',$idVedor);
        
        $fecha1 = $anioActual."-".$mesActual."-01";
        $fecha2 = $anioActual."-".$mesActual."-".$cantidadDiasDelMes;
        $date = new \DateTime("{$fecha1} 00:00:00");
        $dateEnd = new \DateTime("{$fecha2} 23:59:59");
        
        $query
        ->andWhere('g.dateCreate BETWEEN :fecha1 AND :fecha2 ')
        ->setParameter('fecha1', $date->format('Y-m-d H:i:s'))
        ->setParameter('fecha2', $dateEnd->format('Y-m-d H:i:s'));
        
        $query = $query->getQuery();                                                      
        
        return array('query' => $query);
      }
    
       /**
      * @return VedorPublicacionComprado[] 
      */

      public function getComprasVedorTotal($idVedor): array
      {
        $query = $this->createQueryBuilder('g')->andWhere('g.idVedor = :idVedor')->setParameter('idVedor', $idVedor)->orderBy('g.id ','DESC');

        $query = $query->getQuery();                                                      
        
        return array('query' => $query);
      }

    /**
    * @return VedorPublicacionComprado[] Returns an array of Garantia objects
    */

    public function paginate($dql, $page = 1, $limit = 3):paginator
    {
        $paginator = new Paginator($dql);

        $paginator->getQuery()
            ->setFirstResult($limit * ($page - 1)) // Offset
            ->setMaxResults($limit); // Limit

        return $paginator;
    }
}
