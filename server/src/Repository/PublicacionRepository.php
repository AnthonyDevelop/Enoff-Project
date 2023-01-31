<?php

namespace App\Repository;

use App\Entity\CategoriaPublicacion;
use App\Entity\Publicacion;
use App\Entity\User;
use App\Entity\UserPublicacionUrgente;
use App\Entity\VedorPublicacionComprado;
use App\Entity\VedorPublicacionDescartado;
use App\Entity\VedorPublicacionDestacado;
use App\Entity\VedorPublicacionGuardado;
use App\Entity\VedorPublicacionVisto;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ORM\Query\Expr\Join;
use Doctrine\Persistence\ManagerRegistry;
use Doctrine\ORM\Tools\Pagination\Paginator;


/**
 * @extends ServiceEntityRepository<Publicacion>
 *
 * @method Publicacion|null find($id, $lockMode = null, $lockVersion = null)
 * @method Publicacion|null findOneBy(array $criteria, array $orderBy = null)
 * @method Publicacion[]    findAll()
 * @method Publicacion[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class PublicacionRepository extends ServiceEntityRepository
{
  public function __construct(ManagerRegistry $registry)
  {
    parent::__construct($registry, Publicacion::class);
  }

  public function add(Publicacion $entity, bool $flush = false): void
  {
    $this->getEntityManager()->persist($entity);

    if ($flush) {
      $this->getEntityManager()->flush();
    }
  }

  public function remove(Publicacion $entity, bool $flush = false): void
  {
    $this->getEntityManager()->remove($entity);

    if ($flush) {
      $this->getEntityManager()->flush();
    }
  }

  /**
   * @return Publicacion[] 
   */

  public function getAllPublicacionUser($currentPage, $limit, $categoriaP, $fechaI, $fechaF, $calificacion, $idUser, $comprados, $urgente): array
  {

    $query = $this->createQueryBuilder('g')->orderBy('g.id ', 'DESC');

    if (!empty($comprados)) {
      $query->innerJoin(VedorPublicacionComprado::class, 'p', Join::WITH, 'p.idPublicacion = g.id');
    }
    if (!empty($categoriaP)) {
      $query
        ->andWhere('g.categoria = :estado1')
        ->setParameter('estado1', $categoriaP);
    }
    if (!empty($idUser)) {
      $query
        ->andWhere('g.user = :iduser')
        ->setParameter('iduser', $idUser);
    }
    if (!empty($calificacion)) {
      $query
        ->andWhere('g.calificacion = :calificacion')
        ->setParameter('calificacion', $calificacion);
    }

    if (!empty($fechaI) && !empty($fechaF)) {
      $date = new \DateTime("{$fechaI} 00:00:00");
      $dateEnd = new \DateTime("{$fechaF} 23:59:59");
      $query
        ->andWhere('g.fechaPublicacion BETWEEN :fecha AND :fecha2 ')
        ->setParameter('fecha', $date->format('Y-m-d H:i:s'))
        ->setParameter('fecha2', $dateEnd->format('Y-m-d H:i:s'));
    }

    if ($urgente) {
      $query->innerJoin(UserPublicacionUrgente::class, 'urg', Join::WITH, 'urg.idPublicacion = g.id');
    }

    $query = $query->getQuery();

    $paginator = $this->paginate($query, $currentPage, $limit);

    return array('paginator' => $paginator, 'query' => $query);
  }

  /**
   * @return Publicacion[] 
   */

  public function getPublicacionesVedor($categoriaP, $currentPage, $limit, $calificacion, $localidad, $provincia, $idVedor, $filtro, $fechaI, $fechaF, $titulo, $iduser, $urgente): array
  {

    if (!empty($idVedor) && !empty($filtro)) {
      if ($filtro == 1) {
        $query = $this->createQueryBuilder('g5')->orderBy('g5.id ', 'DESC')->innerJoin(VedorPublicacionComprado::class, 'p', Join::WITH, 'p.idPublicacion = g5.id')->andWhere('p.idVedor = :idvedor')->setParameter('idvedor', $idVedor);
      } elseif ($filtro == 5) {
        $query = $this->createQueryBuilder('g5')->orderBy('g5.id ', 'DESC')->innerJoin(VedorPublicacionGuardado::class, 'p', Join::WITH, 'p.idPublicacion = g5.id')->andWhere('p.idVedor = :idvedor')->setParameter('idvedor', $idVedor);
      } elseif ($filtro == 3) {
        $query = $this->createQueryBuilder('g5')->orderBy('g5.id ', 'DESC')->innerJoin(VedorPublicacionDescartado::class, 'p', Join::WITH, 'p.idPublicacion = g5.id')->andWhere('p.idVedor = :idvedor')->setParameter('idvedor', $idVedor);
      } elseif ($filtro == 6) {

        $query = $this->createQueryBuilder('g5')->orderBy('g5.id ', 'DESC')->innerJoin(VedorPublicacionDestacado::class, 'p', Join::WITH, 'p.idPublicacion = g5.id')
          ->andWhere('p.idVedor = :idvedor')->setParameter('idvedor', $idVedor)
          ->andWhere('g5.calificacion >= 3');
      }
    } else {

      $query = $this->createQueryBuilder('g5')->orderBy('g5.fechaPublicacion ', 'DESC');
      $sub1 = $this->createQueryBuilder('g1')->innerJoin(VedorPublicacionComprado::class, 'vc', Join::WITH, 'vc.idPublicacion = g5.id');
      $sub2 = $this->createQueryBuilder('g2')->innerJoin(VedorPublicacionGuardado::class, 'vg', Join::WITH, 'vg.idPublicacion = g5.id');
      $sub3 = $this->createQueryBuilder('g3')->innerJoin(VedorPublicacionDescartado::class, 'vd', Join::WITH, 'vd.idPublicacion = g5.id');
      $sub4 = $this->createQueryBuilder('g4')->innerJoin(VedorPublicacionDestacado::class, 'vs', Join::WITH, 'vs.idPublicacion = g5.id');
      $sub5 = $this->createQueryBuilder('g6')->innerJoin(VedorPublicacionVisto::class, 'vin', Join::WITH, 'vin.idPublicacion = g5.id')->andWhere('vin.idVedor <> :idVedor');


      $query->andWhere($query->expr()->not($query->expr()->exists($sub1->getDQL())));
      $query->andWhere($query->expr()->not($query->expr()->exists($sub2->getDQL())));
      $query->andWhere($query->expr()->not($query->expr()->exists($sub3->getDQL())));
      $query->andWhere($query->expr()->not($query->expr()->exists($sub4->getDQL())));
      $query->andWhere($query->expr()->not($query->expr()->exists($sub5->getDQL())))->setParameter('idVedor', $idVedor);
    }

    if (!empty($categoriaP)) {
      $query
        ->andWhere('g5.categoria = :categoria')
        ->setParameter('categoria', $categoriaP);
    }
    if (!empty($titulo)) {
      $query
        ->andWhere('g5.titulo LIKE :titulo')
        ->setParameter('titulo', '%' . $titulo . '%');
    }
    if (!empty($calificacion)) {
      $query
        ->andWhere('g5.calificacion = :calificacion')
        ->setParameter('calificacion', $calificacion);
    }
    if (!empty($iduser)) {
      $query
        ->andWhere('g5.user = :iduser')
        ->setParameter('iduser', $iduser);
    }
    if (!empty($localidad)) {
      $query
        ->andWhere('g5.localidad = :localidad')
        ->setParameter('localidad', $localidad);
    }
    if (!empty($provincia)) {
      $query
        ->andWhere('g5.provincia = :provincia')
        ->setParameter('provincia', $provincia);
    }

    if (!empty($fechaI) && !empty($fechaF)) {
      $date = new \DateTime("{$fechaI} 00:00:00");
      $dateEnd = new \DateTime("{$fechaF} 23:59:59");
      $query
        ->andWhere('g5.fechaPublicacion BETWEEN :fecha AND :fecha2 ')
        ->setParameter('fecha', $date->format('Y-m-d H:i:s'))
        ->setParameter('fecha2', $dateEnd->format('Y-m-d H:i:s'));
    }

    if ($urgente) {
      $query->innerJoin(UserPublicacionUrgente::class, 'urg', Join::WITH, 'urg.idPublicacion = g5.id');
    }

    $query1 = $query->getQuery();

    $paginator = $this->paginate($query1, $currentPage, $limit);

    return array('paginator' => $paginator, 'query' => $query1);
  }

  /**
   * @return Publicacion[] 
   */

  public function getDatosVedorPostEstado($estado, $idpublicacion): array
  {
    $query = $this->createQueryBuilder('g');

    if ($estado == 1) {
      $query->addSelect('u.nombreCompleto,u.id')
        ->innerJoin(VedorPublicacionComprado::class, 'p', Join::WITH, 'p.idPublicacion = g.id');
    } elseif ($estado == 5) {
      $query->addSelect('u.nombreCompleto,u.id')
        ->innerJoin(VedorPublicacionGuardado::class, 'p', Join::WITH, 'p.idPublicacion = g.id');
    } elseif ($estado == 3) {
      $query->addSelect('u.nombreCompleto,u.id')
        ->innerJoin(VedorPublicacionDescartado::class, 'p', Join::WITH, 'p.idPublicacion = g.id');
    } elseif ($estado == 6) {
      $query->addSelect('u.nombreCompleto,u.id')
        ->innerJoin(VedorPublicacionDestacado::class, 'p', Join::WITH, 'p.idPublicacion = g.id');
    }
    $query->andWhere('p.idPublicacion = :idpublicacion')
      ->setParameter('idpublicacion', $idpublicacion)
      ->innerJoin(User::class, 'u', Join::WITH, 'u.id = p.idVedor')->orderBy('g.id ', 'DESC');

    $query = $query->getQuery();

    return array('query' => $query);
  }

  /**
   * @return Publicacion[] 
   */

  public function getPublicacionesAdmin($categoriaP, $currentPage, $limit, $calificacion, $localidad, $provincia, $estado, $fechaI, $fechaF, $titulo, $nombreUser, $urgente): array
  {
    if (!empty($estado)) {
      if ($estado == 1) {
        $query = $this->createQueryBuilder('g')->innerJoin(VedorPublicacionComprado::class, 'p', Join::WITH, 'p.idPublicacion = g.id')->orderBy('g.id ', 'DESC');
      } elseif ($estado == 5) {
        $query = $this->createQueryBuilder('g')->innerJoin(VedorPublicacionGuardado::class, 'p', Join::WITH, 'p.idPublicacion = g.id')->orderBy('g.id ', 'DESC');
      } elseif ($estado == 3) {
        $query = $this->createQueryBuilder('g')->innerJoin(VedorPublicacionDescartado::class, 'p', Join::WITH, 'p.idPublicacion = g.id')->orderBy('g.id ', 'DESC');
      } elseif ($estado == 6) {

        $query = $this->createQueryBuilder('g')->innerJoin(VedorPublicacionDestacado::class, 'p', Join::WITH, 'p.idPublicacion = g.id')->orderBy('g.id ', 'DESC');
      } else {
        $query = $this->createQueryBuilder('g')->orderBy('g.id ', 'DESC');
      }
    } else {
      $query = $this->createQueryBuilder('g')->orderBy('g.id ', 'DESC');
    }

    if (!empty($categoriaP)) {
      $query
        ->andWhere('g.categoria = :categoria')
        ->setParameter('categoria', $categoriaP);
    }

    if (!empty($titulo)) {
      $query
        ->andWhere('g.titulo LIKE :titulo')
        ->setParameter('titulo', '%' . $titulo . '%');
    }

    if (!empty($nombreUser)) {
      $query->innerJoin(User::class, 'u', Join::WITH, 'u.id = g.user')->andWhere('u.nombreCompleto LIKE :nombreUser')->setParameter('nombreUser', '%' . $nombreUser . '%');
    }

    if (!empty($calificacion)) {
      $query
        ->andWhere('g.calificacion = :calificacion')
        ->setParameter('calificacion', $calificacion);
    }
    if (!empty($localidad)) {
      $query
        ->andWhere('g.localidad = :localidad')
        ->setParameter('localidad', $localidad);
    }
    if (!empty($provincia)) {
      $query
        ->andWhere('g.provincia = :provincia')
        ->setParameter('provincia', $provincia);
    }

    if (!empty($fechaI) && !empty($fechaF)) {
      $date = new \DateTime("{$fechaI} 00:00:00");
      $dateEnd = new \DateTime("{$fechaF} 23:59:59");
      $query
        ->andWhere('g.fechaPublicacion BETWEEN :fecha AND :fecha2 ')
        ->setParameter('fecha', $date->format('Y-m-d H:i:s'))
        ->setParameter('fecha2', $dateEnd->format('Y-m-d H:i:s'));
    }

    if ($urgente) {
      $query->innerJoin(UserPublicacionUrgente::class, 'urg', Join::WITH, 'urg.idPublicacion = g.id');
    }

    $query = $query->getQuery();

    $paginator = $this->paginate($query, $currentPage, $limit);

    return array('paginator' => $paginator, 'query' => $query);
  }


  /**
   * @return Publicacion[] 
   */

  public function getComprasTotalApp(): array
  {
    $query = $this->createQueryBuilder('g')->innerJoin(VedorPublicacionComprado::class, 'p', Join::WITH, 'p.idPublicacion = g.id')
      ->select("sum(g.precio) as montoTotal");
    $query = $query->getQuery();
    return array('query' => $query);
  }

  /**
   * @return Publicacion[] 
   */

  public function getCantPublisPorCategoria(): array
  {
    $query = $this->createQueryBuilder('g')->innerJoin(CategoriaPublicacion::class, 'c', Join::WITH, 'c.id = g.categoria')
      ->select('c.nombreCategoria, count(c.nombreCategoria) as cant')->groupBy('c.nombreCategoria')->orderBy('cant ', 'DESC');

    $query = $query->getQuery();
    return array('query' => $query);
  }

  /**
   * @return Publicacion[] Returns an array of Garantia objects
   */

  public function paginate($dql, $page = 1, $limit = 3): paginator
  {
    $paginator = new Paginator($dql);

    $paginator->getQuery()
      ->setFirstResult($limit * ($page - 1)) // Offset
      ->setMaxResults($limit); // Limit

    return $paginator;
  }
}
