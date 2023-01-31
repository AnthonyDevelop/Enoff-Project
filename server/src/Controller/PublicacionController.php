<?php

namespace App\Controller;

use App\Entity\Localidad;
use App\Entity\Provincia;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;
use App\Entity\Publicacion;
use App\Entity\UserPublicacionUrgente;
use App\Repository\CategoriaPublicacionRepository;
use App\Repository\EstadoPublicacionRepository;
use App\Repository\LocalidadRepository;
use App\Repository\ProvinciaRepository;
use App\Repository\PublicacionRepository;
use App\Repository\UserPublicacionUrgenteRepository;
use App\Repository\VedorPublicacionCompradoRepository;
use App\Repository\VedorPublicacionDescartadoRepository;
use App\Repository\VedorPublicacionDestacadoRepository;
use App\Repository\VedorPublicacionGuardadoRepository;
use Doctrine\Persistence\ManagerRegistry;

class PublicacionController extends AbstractController
{
    /**
     * @Route("/api/addPost", name="app_post", methods={"POST"})
     */
    public function addPost(Request $request,LocalidadRepository $repolocal, ProvinciaRepository $repoprov, CategoriaPublicacionRepository $repoCateg,ManagerRegistry $doctrine, EstadoPublicacionRepository $repoEstadosPubli): JsonResponse
    {
        date_default_timezone_set('America/Argentina/Buenos_Aires');
        $zonahoraria = date_default_timezone_get();
    
        $params = json_decode($request->getContent());

        $user = $this->getUser();

        $categoria = $repoCateg->find($params->idCategoria);

        $date_fecha = new \DateTime(date("Y-m-d H:i:s"), new \DateTimeZone('America/Argentina/Buenos_Aires'));
        
        $newPost = new Publicacion;

        $newPost->setTitulo($params->titulo);
        $newPost->setDescripcion($params->descripcion);
        $newPost->setCategoria($categoria);
        $newPost->setPrecio($params->precio);
        $newPost->setUser($user);
        $newPost->setPath($params->path);
        $newPost->setFechaPublicacion($date_fecha);
        $entityManager = $doctrine->getManager();
        $this->processUbicaciones($newPost,$params->nombreProvincia,$params->nombreLocalidad,$repoprov,$repolocal,$entityManager);

        if($params->urgente == true){
            $newPost->addEstadoPublicacion($repoEstadosPubli->find(7));
            $newEstadoUrgente = new UserPublicacionUrgente();
            $newEstadoUrgente->setIdCreador($user->getId());
            $newEstadoUrgente->setIdPublicacion($newPost->getId());
            $newEstadoUrgente->setDateCreate($date_fecha); 
            $entityManager->persist($newEstadoUrgente);
            $entityManager->flush();
        }
        
        return $this->json([
            'message' => "Post publicado"
        ]);
    }

    private function processUbicaciones($post,$nombreProvincia,$nombreLocalidad,$repoprov,$repolocal,$entityManager)
    {
        
        if(!empty($nombreLocalidad)){
            $searchLocalidad = $repolocal->findOneBy(array('nombre' => $nombreLocalidad));
            if(empty($searchLocalidad)){
                $newLocalidad = new Localidad();
                $newLocalidad->setNombre($nombreLocalidad);
                $entityManager->persist($newLocalidad);
                $post->setLocalidad($newLocalidad);
            }else{
                $post->setLocalidad($searchLocalidad);
            }
        }
        if(!empty($nombreProvincia)){
            $searchProvincia = $repoprov->findOneBy(array('nombre' => $nombreProvincia));
            if(empty($searchProvincia)){
                $newProvincia = new Provincia();
                $newProvincia->setNombre($nombreProvincia);
                $entityManager->persist($newProvincia);
                $post->setProvincia($newProvincia); 
            }else{
                $post->setProvincia($searchProvincia);            
            }
        }
        $entityManager->persist($post);
        $entityManager->flush();
    }
    
    /**
    * @Route("/api/updatePost", name="updatePost", methods={"POST"})
    */
    public function updatePost( Request $request, PublicacionRepository $repoPublicacion,LocalidadRepository $repolocal,ProvinciaRepository $repoprov,ManagerRegistry $doctrine, CategoriaPublicacionRepository $cataRepo,EstadoPublicacionRepository $repoEstado): JsonResponse
    {
        $params= json_decode($request->getContent());

        $updatePost = $repoPublicacion->find($params->idPost);
        $entityManager = $doctrine->getManager();

        if(!$updatePost->getEstadoPublicacion()->contains($repoEstado->find(1)) || !$updatePost->getEstadoPublicacion()->contains($repoEstado->find(3))){

            if(!empty($params->titulo)){
                $updatePost->setTitulo($params->titulo);
            }
            if(!empty($params->descripcion)){
                $updatePost->setDescripcion($params->descripcion);
            }
            if(!empty($params->nombreLocalidad) || !empty($params->nombreProvincia)){
                $this->processUbicaciones($updatePost,$params->nombreProvincia,$params->nombreLocalidad,$repoprov,$repolocal,$entityManager);
            }
            if(!empty($params->idCategoria)){
                $updatePost->setCategoria($cataRepo->find($params->idCategoria));
            }
            $entityManager->persist($updatePost);
            $entityManager->flush();

            return new JsonResponse([
                'message' => 'Post actualizado!',
            ]);
        }
        return new JsonResponse([
            'message' => 'Error - No se puede actualizar un post eliminado o comprado',
        ]);
        
    }

     /**
     * @Route("/api/listPosts", name="postsUser",  methods={"POST"})
     */
    public function listPostsUser( Request $request , ManagerRegistry $doctrine, VedorPublicacionCompradoRepository $repoCompraVedor): JsonResponse
    {
        $params= json_decode($request->getContent());

        $categoria = $params->idCategoria;
        $currentPage = $params->page;
        $fechaInicio = $params->fechaInicio;
        $fechaFin = $params->fechaFin;
        $estado = $params->estado;
        $calificacion = $params->calificacion;
        $idUser = $params->userId;
        $urgente = $params->urgente;
        
        $limit=12;
        $oprtunidadQuery = $doctrine->getManager()->getRepository(Publicacion::class)->getAllPublicacionUser($currentPage,$limit,$categoria,$fechaInicio,$fechaFin,$calificacion,$idUser,$estado,$urgente);

        $tabla = $oprtunidadQuery['query']->getResult();

        $totalRegisters = count($oprtunidadQuery['paginator']);
        $maxPages = ceil($oprtunidadQuery['paginator']->count() / $limit);
        
        $categorias = array();
        $array = array();
        for( $i=0 ; $i < count($tabla) ; $i++ ){
              
                $estados = array();
                foreach($tabla[$i]->getEstadoPublicacion() as $estado){
                    $arra = array(
                        'id' => $estado->getId(), 
                        'nombre' => $estado->getNombre()
                    );
                    array_push($estados,$arra); 
                }
                $comentarios = array();
                if(count($tabla[$i]->getComentarios())>0){
                    foreach($tabla[$i]->getComentarios() as $comentario){
                        $arra2 = array(
                            'id' => $comentario->getId(),
                            'idVedor'=> $comentario->getIdVedor()->getId(),
                            'nombreVedor' => $comentario->getIdVedor()->getNombreCompleto(), 
                            'contenido' => $comentario->getContenido(),
                            'fecha' => $comentario->getDateCreate(),
                        );
                        array_push($comentarios,$arra2); 
                    }
                }else{
                    $comentarios = 'Sin Comentarios';
                }
                if(!empty($repoCompraVedor->findBy(array('idPublicacion' => $tabla[$i]->getId())))){
                    $compra = $repoCompraVedor->findBy(array('idPublicacion' => $tabla[$i]->getId()));
                    $idComprador = $compra[0]->getIdVedor();
                }else{
                    $idComprador = 'Sin Comprador';
                }

                if(count($categorias) > 0){
                    
                    if(!in_array(array('id' => $tabla[$i]->getCategoria()->getId(),'nombre' => $tabla[$i]->getCategoria()->getNombreCategoria()),$categorias)){
                        $tupla = array(
                            'id' => $tabla[$i]->getCategoria()->getId(),
                            'nombre' => $tabla[$i]->getCategoria()->getNombreCategoria()
                        );
                        array_push($categorias,$tupla);
                    }
                }else{
                    $tupla = array(
                        'id' => $tabla[$i]->getCategoria()->getId(),
                        'nombre' => $tabla[$i]->getCategoria()->getNombreCategoria()
                    );
                    array_push($categorias,$tupla);
                }
              
                $d = array( 
                    'idPublicacion' => $tabla[$i]->getId(),
                    'titulo' => $tabla[$i]->getTitulo(),
                    'descripcion' => $tabla[$i]->getDescripcion(),
                    'idlocalidad' => $tabla[$i]->getLocalidad()->getId(),
                    'localidad' => $tabla[$i]->getLocalidad()->getNombre(),
                    'idprovincia' => $tabla[$i]->getProvincia()->getId(),
                    'provincia' => $tabla[$i]->getProvincia()->getNombre(),
                    'idCategoria' => $tabla[$i]->getCategoria()->getId(),
                    'categoria' => $tabla[$i]->getCategoria()->getNombreCategoria(),
                    'calificacion' => $tabla[$i]->getCalificacion(),
                    'path' => $tabla[$i]->getPath(),
                    'precio'=> $tabla[$i]->getPrecio(),
                    'idComprador' => $idComprador,
                    'idUserCreador' => $tabla[$i]->getUser()->getId(),
                    'nombreUserCreador' => $tabla[$i]->getUser()->getNombreCompleto(),   
                    'fecha' => $tabla[$i]->getFechaPublicacion(),
                    'estados' => $estados,
                    'comentarios' => $comentarios                    
                );
                array_push($array,$d);
        }
        return new JsonResponse([
            'data' => count($array) >0 ? $array : null,
            'maxPages'=>$maxPages,
            'totalRegister' =>$totalRegisters,
            'categorias' => $categorias,
            'filter' => !empty($params->calificacion) || !empty($params->estado) || !empty($params->idCategoria) || !empty($params->fecha) || $params->urgente || !empty($params->fechaInicio) || !empty($params->fechaFin)? true : false      
        ]);
    }

    /**
    * @Route("/api/deletePostClient", name="deletePostClient", methods={"POST"})
    */
    public function deletePostClient(Request $request,UserPublicacionUrgenteRepository $repoUrgente,ProvinciaRepository $repoprov,VedorPublicacionDestacadoRepository $repoDestac,VedorPublicacionGuardadoRepository $repoG,VedorPublicacionDescartadoRepository $repoDescart,EstadoPublicacionRepository $repoEstado, PublicacionRepository $repoPubli, ManagerRegistry $doctrine): JsonResponse
    {
        if($this->getUser()->getRoles()[0] == "ROLE_USER"){
            $params = json_decode($request->getContent());
            foreach($params as $id){
                $publi = $repoPubli->find($id);
                if($publi->getEstadoPublicacion()->contains($repoEstado->find(1)) || $publi->getUser()->getId() !== $this->getUser()->getId()){
                    return $this->json([
                        'message' => 'No es posible realizar la eliminacion', 
                    ]);
                }
            }
            foreach($params as $id){
                $entityManager = $doctrine->getManager();
                $search = $repoG->findBy(array('idPublicacion' => $id));
                if(!empty($search)){
                    $entityManager->remove($search[0]);
                    $entityManager->flush();
                }
                $search =  $repoDescart->findBy(array('idPublicacion' => $id));
                if(!empty($search)){
                    $entityManager->remove($search[0]);
                    $entityManager->flush();
                }
                $search =  $repoDestac->findBy(array('idPublicacion' => $id));
                if(!empty($search)){
                    $entityManager->remove($search[0]);
                    $entityManager->flush();
                }
                $search = $repoUrgente->findBy(array('idPublicacion' => $id));
                if(!empty($search)){
                    $entityManager->remove($search[0]);
                    $entityManager->flush();
                }

                $publi = $repoPubli->find($id);
                $searchLocalidad = $publi->getLocalidad();
                $searchProvincia = $repoprov->find($publi->getProvincia()->getId());
                $entityManager->remove($publi);
                $entityManager->flush();

                if(count($searchLocalidad->getPublicaciones()) == 0 ){
                    $entityManager->remove($searchLocalidad);
                    $entityManager->flush();                    
                }

                if(count($searchProvincia->getPublicacions()) == 0){
                    $entityManager->remove($searchProvincia);
                    $entityManager->flush();
                }
            }
            return $this->json([
                'message' => 'Las publicaciones ha sido borradas permanentemente', 
            ]);
        }
        return $this->json([
            'message' => 'No esta autorizado a realizar esta accion', 
        ]);
    }
}
