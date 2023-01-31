<?php

namespace App\Repository;

use App\Entity\Publicacion;
use App\Entity\User;
use App\Entity\VedorPeriodista;
use App\Entity\CategoriaPublicacion;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ORM\Query\Expr\Join;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\Security\Core\Exception\UnsupportedUserException;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\PasswordUpgraderInterface;
use Doctrine\ORM\Tools\Pagination\Paginator;

/**
 * @extends ServiceEntityRepository<User>
 *
 * @method User|null find($id, $lockMode = null, $lockVersion = null)
 * @method User|null findOneBy(array $criteria, array $orderBy = null)
 * @method User[]    findAll()
 * @method User[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class UserRepository extends ServiceEntityRepository implements PasswordUpgraderInterface
{
   
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, User::class);
    }

    public function add(User $entity, bool $flush = false): void
    {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(User $entity, bool $flush = false): void
    {
        $this->getEntityManager()->remove($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    /**
     * Used to upgrade (rehash) the user's password automatically over time.
     */
    public function upgradePassword(PasswordAuthenticatedUserInterface $user, string $newHashedPassword): void
    {
        if (!$user instanceof User) {
            throw new UnsupportedUserException(sprintf('Instances of "%s" are not supported.', \get_class($user)));
        }

        $user->setPassword($newHashedPassword);

        $this->add($user, true);
    }

    /**
    * @return User[] 
    */

    public function getPeriodistasDisponibles($idVedor): array
    {
        $query = $this->createQueryBuilder('u');
        $subquery = $this->createQueryBuilder('usu')->innerJoin(VedorPeriodista::class,'p',Join::WITH,'p.idPeriodista = u.id')->andWhere("p.idVedor = :idvedor");

        $query->andWhere($query->expr()->not($query->expr()->exists($subquery->getDQL())))->setParameter('idvedor',$idVedor)
        ->andWhere("json_contains(u.roles, '\"ROLE_ADMIN\"', '$') <> '1'")
        ->andWhere("json_contains(u.roles, '\"ROLE_VEDOR\"', '$') <> '1'");
        
        $query = $query->getQuery();                                                      
        
        return array('query' => $query);
    }

    /**
    * @return User[] 
    */

    public function getPeriodistasAsignados($idVedor,$idCategoria,$currentPage,$limit): array
    {
      $query = $this->createQueryBuilder('u')
      ->innerJoin(VedorPeriodista::class,'p',Join::WITH,'p.idPeriodista = u.id')
      ->innerJoin(CategoriaPublicacion::class,'c',Join::WITH,'c.id = p.idCategoria')
      ->select('u,c.nombreCategoria as nombreCategoria, c.id as idCategoria')
      ->andWhere("p.idVedor = :idvedor")
      ->setParameter('idvedor',$idVedor);

      if(!empty($idCategoria)){
        $query->andWhere("c.id = :idcategoria")
        ->setParameter('idcategoria',$idCategoria);
      }

      $query = $query->getQuery();                                                      
        
      $paginator = $this->paginate($query, $currentPage, $limit);

      return array('paginator' => $paginator, 'query' => $query);
    }
    
    /**
      * @return User[] 
      */
      public function getAllUser($currentPage , $limit, $busqueda, $calificacion, $localidad, $provincia): array
      {
          // Create our query
          $query = $this->createQueryBuilder('u')
          ->leftJoin(Publicacion::class,'p',Join::WITH,'u.id = p.user')
          ->select('u, avg(p.calificacion) as promedioCalificacion')
          ->groupBy('u')
          ->andWhere("json_contains(u.roles, '\"ROLE_ADMIN\"', '$') <> '1'")
          ->andWhere("json_contains(u.roles, '\"ROLE_VEDOR\"', '$') <> '1'");

          if(!empty($busqueda)){
              $query
              ->andWhere('u.nombreCompleto LIKE :busqueda')
              ->setParameter('busqueda','%'.$busqueda.'%')
              ->orderBy('u.id ','DESC');
          }
          if(!empty($localidad)){
            $query
            ->andWhere('u.localidad = :localidad')
            ->setParameter('localidad', $localidad)
            ->orderBy('u.id ','DESC');

          }
          if(!empty($provincia)){
            $query
            ->andWhere('u.provincia = :provincia')
            ->setParameter('provincia',$provincia)
            ->orderBy('u.id ','DESC');
          }
          if(!empty($calificacion)){
            $query->having('promedioCalificacion <= :calificacion')
            ->setParameter('calificacion',$calificacion)
            ->orderBy('promedioCalificacion ','DESC');
          }
         
        $query = $query->getQuery();                    

        $paginator = $this->paginate($query, $currentPage, $limit);

        return array('paginator' => $paginator, 'query' => $query);
      }

     /**
      * @return User[] 
      */
      public function getAllVedores($busqueda): array
      {
        $query = $this->createQueryBuilder('u')->andWhere("json_contains(u.roles, '\"ROLE_VEDOR\"', '$') = '1'");

        if(!empty($busqueda)){
          $query
          ->andWhere('u.nombreCompleto LIKE :nombre')
          ->setParameter('nombre','%'.$busqueda.'%');
        }
        $query = $query->getQuery();
        
        return array('query' => $query);
      }

      /**
      * @return User[] 
      */
      public function getAllNombreUsers(): array
      {
        $query = $this->createQueryBuilder('u')->select('u.nombreCompleto')->andWhere("json_contains(u.roles, '\"ROLE_VEDOR\"', '$') <> '1'")
        ->andWhere("json_contains(u.roles, '\"ROLE_ADMIN\"', '$') <> '1'");
        $query = $query->getQuery();
        
        return array('query' => $query);
      }

      /**
      * @return User[] 
      */
      public function getCantUsersLocalidad(): array
      {
        $query = $this->createQueryBuilder('u')->select("u.localidad, count(u.localidad) as cant")->groupBy('u.localidad')->orderBy('cant ','DESC');
        
        $query = $query->getQuery();

        return array('query' => $query);
      }

       /**
      * @return User[] 
      */
      public function getCantUsersProvincia(): array
      {
        $query = $this->createQueryBuilder('u')->select("u.provincia, count(u.provincia) as cant")->groupBy('u.provincia');
        
        $query = $query->getQuery();

        return array('query' => $query);
      }

      /**
      * @return User[] 
      */
      public function getCantUsers(): array
      {
        $query = $this->createQueryBuilder('u')->andWhere("json_contains(u.roles, '\"ROLE_ADMIN\"', '$') != '1'");

        $query = $query->getQuery();
        
        return array('query' => $query);
      }

       /**
      * @return User[] 
      */
      public function getCantUsersDateCreate(): array
      {
        $query = $this->createQueryBuilder('u')->select('u.dateCreate, count(u.dateCreate) as cant')->groupBy('u.dateCreate');
        
        $query = $query->getQuery();

        return array('query' => $query);
      }

      /**
      * @return User[] 
      */
      public function getAllLocalidades(): array
      {
        $query = $this->createQueryBuilder('u')->select('u.localidad')->distinct()
        ->andWhere("json_contains(u.roles, '\"ROLE_ADMIN\"', '$') <> '1'")
        ->andWhere("json_contains(u.roles, '\"ROLE_VEDOR\"', '$') <> '1'");

        $query = $query->getQuery();
        return array('query' => $query);
      }

       /**
      * @return User[] 
      */
      public function getAllProvincias(): array
      {
        $query = $this->createQueryBuilder('u')->select('u.provincia')->distinct()
        ->andWhere("json_contains(u.roles, '\"ROLE_ADMIN\"', '$') <> '1'")
        ->andWhere("json_contains(u.roles, '\"ROLE_VEDOR\"', '$') <> '1'");

        $query = $query->getQuery();
        return array('query' => $query);
      }

    /**
    * @return User[] Returns an array of Garantia objects
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
