<?php

namespace App\Controller;

use App\Entity\Notificacion;
use App\Repository\EstadoPublicacionRepository;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use App\Entity\Publicacion;
use App\Entity\VedorPublicacionComprado;
use App\Entity\User;
use App\Repository\EstadoNotificacionRepository;
use App\Repository\PublicacionRepository;
use App\Repository\LocalidadRepository;
use App\Repository\ProvinciaRepository;
use App\Repository\UserRepository;
use App\Repository\VedorPublicacionCompradoRepository;
use App\Repository\VedorPublicacionDescartadoRepository;
use App\Repository\VedorPublicacionDestacadoRepository;
use App\Repository\VedorPublicacionGuardadoRepository;
use App\Repository\VedorPublicacionVistoRepository;
use Symfony\Contracts\HttpClient\HttpClientInterface;

class AdminController extends AbstractController
{
    /**
    * @Route("/api/admin/listPostAdmin", name="listPostAdmin", methods={"POST"})
    */
    public function listPostAdmin(Request $request, ManagerRegistry $doctrine,LocalidadRepository $repolocal,ProvinciaRepository $repoprov, EstadoPublicacionRepository $repoEstado): JsonResponse
    {
        if($this->getUser()->getRoles()[0] == "ROLE_ADMIN"){
            
            $params= json_decode($request->getContent());

            $nombreUser = $params->nombreUser;
            $titulo = $params->titulo;
            $categoria = $params->idCategoria;
            $currentPage = $params->page;
            $fechaI = $params->fechaInicio;
            $fechaF = $params->fechaFin;
            $calificacion = $params->calificacion;
            $localidad = $repolocal->findOneBy(array('nombre' => $params->localidad)) != null ? $repolocal->findOneBy(array('nombre' => $params->localidad))->getId() : "";
            $provincia = $repoprov->findOneBy(array('nombre' => $params->provincia)) != null ? $repoprov->findOneBy(array('nombre' => $params->provincia))->getId() : "";
            $idestado = $params->idestado;
            $urgente = $params->urgente;

            $limit=12;
            $result = $doctrine->getManager()->getRepository(Publicacion::class)
            ->getPublicacionesAdmin($categoria,$currentPage,$limit,$calificacion,$localidad,$provincia,$idestado,$fechaI,$fechaF,$titulo,$nombreUser,$urgente);
            
            $maxPages = ceil($result['paginator']->count() / $limit);

            $tabla = $result['query']->getResult();
            
            $totalRegisters = count($result['paginator']);
            
            $array = array();
            $usuarios = array();
            $categorias = array();
            $localidades = array();
            $provincias = array();
            $calificaciones = array();

            for( $i=0 ; $i < count($tabla) ; $i++){
                $estados = array();
                foreach($tabla[$i]->getEstadoPublicacion() as $estado){
                    if($estado->getId() !== 1){
                        $arra = array(
                            'id' => $estado->getId(), 
                            'nombre' => $estado->getNombre(),
                        );
                    array_push($estados,$arra);
                    }
                }

                if(!empty($idestado)){
                    $estadoPostVedor =  $repoEstado->find($idestado);
                    $query = $doctrine->getManager()->getRepository(Publicacion::class)->getDatosVedorPostEstado($idestado,$tabla[$i]->getId());
                    $resultado = $query['query']->getResult();
                    $nombreVedor = $resultado[0]['nombreCompleto'];
                    $idVedor = $resultado[0]['id'];
                    $arra = array(
                        'id' => $estadoPostVedor->getId(), 
                        'nombre' => $estadoPostVedor->getNombre(),
                        'idVedor' => $idVedor,
                        'nombreVedor' => $nombreVedor
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
                if(count($usuarios) > 0){
                    if(!in_array(array('nombreUserCreador' => $tabla[$i]->getUser()->getNombreCompleto()),$usuarios)){
                        $tupla = array(
                            'nombreUserCreador' => $tabla[$i]->getUser()->getNombreCompleto(),   
                        );
                        array_push($usuarios,$tupla);
                    }
                }else{
                    $tupla = array(
                        'nombreUserCreador' => $tabla[$i]->getUser()->getNombreCompleto(),   
                    );
                    array_push($usuarios,$tupla);   
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

                if(count($localidades) > 0){
                    if(!in_array(array('localidad' => $tabla[$i]->getLocalidad()->getNombre()),$localidades)){
                        $localidad = array(
                            'localidad' => $tabla[$i]->getLocalidad()->getNombre()
                        );
                        array_push($localidades,$localidad);
                    }
                }else{
                    $localidad = array(
                        'localidad' => $tabla[$i]->getLocalidad()->getNombre()
                    );
                    array_push($localidades,$localidad);
                }

                if(count($provincias) > 0){
                    if(!in_array(array('provincia' => $tabla[$i]->getProvincia()->getNombre()),$provincias)){
                        $provincia = array(
                            'provincia' => $tabla[$i]->getProvincia()->getNombre()
                        );
                        array_push($provincias,$provincia);
                    }
                }else{
                    $provincia = array(
                        'provincia' => $tabla[$i]->getProvincia()->getNombre()
                    );
                    array_push($provincias,$provincia);
                }

                if(count($calificaciones) > 0){
                    if(!in_array(array('calificacion' => $tabla[$i]->getCalificacion()),$calificaciones)){
                        $calificacion = array(
                            'calificacion' => $tabla[$i]->getCalificacion()
                        );
                        array_push($calificaciones,$calificacion);
                    }
                }else{
                    $calificacion = array(
                        'calificacion' => $tabla[$i]->getCalificacion()
                    );
                    array_push($calificaciones,$calificacion);
                }

                $d = array( 
                    'idPublicacion' => $tabla[$i]->getId(),
                    'titulo' => $tabla[$i]->getTitulo(),
                    'descripcion' => $tabla[$i]->getDescripcion(),
                    'idCategoria' => $tabla[$i]->getCategoria()->getId(),
                    'calificacion' => $tabla[$i]->getCalificacion(),
                    'provincia' => $tabla[$i]->getProvincia()->getNombre(),
                    'categoria' => $tabla[$i]->getCategoria()->getNombreCategoria(),
                    'localidad' => $tabla[$i]->getLocalidad()->getNombre(),
                    'path' => $tabla[$i]->getPath(),
                    'idUserCreador' => $tabla[$i]->getUser()->getId(),
                    'pathUserCreador' => !empty($tabla[$i]->getUser()->getPathFotoPerfil()) ? $tabla[$i]->getUser()->getPathFotoPerfil() : "Sin Foto" ,
                    'nombreUserCreador' => $tabla[$i]->getUser()->getNombreCompleto(),   
                    'fecha' => $tabla[$i]->getFechaPublicacion(),
                    'estados' => $estados,
                    'comentarios' => $comentarios,
                    'precio' => $tabla[$i]->getPrecio()     
                );
                array_push($array,$d);
            }

            return new JsonResponse([
                'message' => 'Lista de publicaciones del Administrador',
                'data' => count($array) > 0 ? $array : null,
                'usuarios' => $usuarios,
                'categorias' => $categorias,
                'localidades' => $localidades,
                'provincias' => $provincias,
                'calificaciones' => $calificaciones,
                'titulo' => empty($titulo) ? "": $params->titulo, 
                'maxPages'=> $maxPages,
                'totalRegister' => $totalRegisters
            ]);
        }
        return $this->json([
            'message' => 'No tiene permisos para realizar esta accion',
        ]);
    }

    /**
    * @Route("/api/admin/restablecerPost/{id}", name="restablecerPost", methods={"GET"})
    */
    public function restablecerPost($id, ManagerRegistry $doctrine, HttpClientInterface $client,VedorPublicacionDescartadoRepository $repoDescart,EstadoPublicacionRepository $repoEstadoPubli, EstadoNotificacionRepository $repoEstadoNoti, PublicacionRepository $repoPubli): JsonResponse
    {
        if($this->getUser()->getRoles()[0] == "ROLE_ADMIN"){
            $publi = $repoPubli->find($id);
            $publi->removeEstadoPublicacion($repoEstadoPubli->find(3));

            date_default_timezone_set('America/Argentina/Buenos_Aires');
            $zonahoraria = date_default_timezone_get();

            $date_fecha = new \DateTime(date("Y-m-d H:i:s"), new \DateTimeZone('America/Argentina/Buenos_Aires'));
            

            $entityManager = $doctrine->getManager();
            $entityManager->persist($publi);

            $repoDescart = $repoDescart->findOneBy(array("idPublicacion"=> $id));
            $entityManager->remove($repoDescart);

            $message = "Su publicacion: ".$publi->getTitulo()." fue restaurada";

            $response = $client->request(
                'POST',
                $_SERVER['DOMAIN_SOCKET_IO'].'/client/notificaciones',
                [   
                    'json' => [
                        'contenido' => $message,
                        'estado' => 1,
                        'user_id' => $publi->getUser()->getId()
                    ],
                ]
            );
    
            $notificacion = new Notificacion;
            $notificacion->setEstado($repoEstadoNoti->find(1));
            $notificacion->setContenido($message);
            $notificacion->setIdUser($publi->getUser());
            $notificacion->setDateCreate($date_fecha);
            $entityManager->persist($notificacion);
            $entityManager->flush();
            
            return $this->json([
                'message' => 'Publicacion restaurada',
            ]);
        }
        return $this->json([
            'message' => 'No tiene permisos para realizar esta accion',
        ]);
    }

    /**
    * @Route("/api/admin/listVedores", name="listVedores", methods={"POST"})
    */
    public function listVedores(Request $request, ManagerRegistry $doctrine,VedorPublicacionCompradoRepository $repoVCompras, PublicacionRepository $repoPubli,VedorPublicacionDescartadoRepository $repoDescartVedor, VedorPublicacionCompradoRepository $repoCompraVedor, VedorPublicacionGuardadoRepository $repoGuardaVedor, VedorPublicacionDestacadoRepository $repoDestacVedor): JsonResponse
    {
        if($this->getUser()->getRoles()[0] == "ROLE_ADMIN"){
            $request = json_decode($request->getContent());
            $nombreVedor = $request->nombre;
            
            $oprtunidadQuery = $doctrine->getManager()->getRepository(User::class)->getAllVedores($nombreVedor);

            $tabla = $oprtunidadQuery['query']->getResult();
            $vedores = array();

            foreach ($tabla as $user){
                $todasLasCompras = $repoVCompras->findBy(array("idVedor" => $user->getId()));
                $montoTotalCompras = 0;
                foreach($todasLasCompras as $compra){
                    $publiComprada = $repoPubli->find($compra->getIdPublicacion());
                    $montoTotalCompras = $montoTotalCompras + $publiComprada->getPrecio();
                }

                $comprasVedor = $doctrine->getManager()->getRepository(VedorPublicacionComprado::class)->getComprasVedorMes($user->getId());

                $comprasDelMes = $comprasVedor['query']->getResult();
                $montoComprasMes = 0;
                foreach($comprasDelMes as $compra){
                        $searchPubli = $repoPubli->find($compra->getIdPublicacion());
                        $montoComprasMes = $montoComprasMes + $searchPubli->getPrecio();
                }

                $array = array(
                    'idUser' =>  $user->getId(),
                    'nombreCompleto' => $user->getNombreCompleto(),
                    'pathFotoPerfil' => $user->getPathFotoPerfil(),
                    'email' => $user->getUserName(),
                    'telefono' => $user->getTelefono(),
                    'descripcion' => $user->getDescripcion(),
                    'fechaUser' => $user->getDateCreate(),
                    'montoCompraMensual' => $montoComprasMes,
                    'montoCompraTotal' => $montoTotalCompras,
                    'videosDestacados' => count($repoDestacVedor->findBy(array('idVedor' => $user->getId()))),
                    'videosDescartados' => count($repoDescartVedor->findBy(array('idVedor' => $user->getId()))),
                    'videosAdquiridos' => count($repoCompraVedor->findBy(array('idVedor' => $user->getId()))),
                    'videosGuardados' => count($repoGuardaVedor->findBy(array('idVedor' => $user->getId()))),
                );
                array_push($vedores,$array);
            }
            return $this->json([
                'message' => 'Lista de veedores',
                'data' => $vedores
            ]);
        }
        return $this->json([
            'message' => 'No tiene permisos para realizar esta accion',
        ]);
    }

    /**
    * @Route("/api/admin/listEstadisticas", name="listEstadisticas", methods={"GET"})
    */
    public function listEstadisticasAdmin(ManagerRegistry $doctrine,VedorPublicacionVistoRepository $repoVisto, PublicacionRepository $repoPubli, VedorPublicacionGuardadoRepository $repoGuardados ,VedorPublicacionCompradoRepository $repoAdquiridos, VedorPublicacionDescartadoRepository $repoDescart): JsonResponse
    {
        if($this->getUser()->getRoles()[0] == "ROLE_ADMIN"){

            $entityManager = $doctrine->getManager();

            $oprtunidadQuery = $entityManager->getRepository(User::class)->getCantUsers();
            $cantUsers = count($oprtunidadQuery['query']->getResult());
            
            $montoTotalApp = $entityManager->getRepository(Publicacion::class)->getComprasTotalApp();
            $montoTotalResult = $montoTotalApp['query']->getResult();
            
            $cantidadesPorLocalidad = $entityManager->getRepository(User::class)->getCantUsersLocalidad();
            $resultlocalidades = $cantidadesPorLocalidad['query']->getResult();
            $cantUsersPorLocalidad = array();
            foreach($resultlocalidades as $localidad){
                $l = array(
                    'localidad' => $localidad['localidad'],
                    'cantidad' => $localidad['cant']
                );
                array_push($cantUsersPorLocalidad,$l);
            }

            $cantidadesPorProvincia = $entityManager->getRepository(User::class)->getCantUsersProvincia();
            $resultprovincias = $cantidadesPorProvincia['query']->getResult();
            $cantUsersPorProvincia = array();
            
            foreach($resultprovincias as $provincia){
                $l = array(
                    'localidad' => $provincia['provincia'],
                    'cantidad' => $provincia['cant']
                );
                array_push($cantUsersPorProvincia,$l);
            }

            $cantidadesPorFecha = $entityManager->getRepository(User::class)->getCantUsersDateCreate();
            $resultdatecreate = $cantidadesPorFecha['query']->getResult();

            $cantUsersPorFecha = array();

            foreach($resultdatecreate as $userfecha){
                $d = array(
                    'fecha' => $userfecha['dateCreate'],
                    'cantidad' => $userfecha['cant']
                );
                array_push($cantUsersPorFecha,$d);
            }

            $cantidadesPorCategoria = $entityManager->getRepository(Publicacion::class)->getCantPublisPorCategoria();
            $resultpostcategoria = $cantidadesPorCategoria['query']->getResult();

            $cantPublisPorCategoria = array();
            $cantTotalVideos = count($repoPubli->findAll());
            foreach($resultpostcategoria as $postcateg){
                $c = array(
                    'categoria' => $postcateg['nombreCategoria'],
                    'porcentaje' => $postcateg['cant']*100/$cantTotalVideos
                );
                array_push($cantPublisPorCategoria, $c);
            }

            $cantPublisDescartadas = count($repoDescart->findAll());
            $cantPublisAdquiridas = count($repoAdquiridos->findAll());
            $cantPublisGuardadas = count($repoGuardados->findAll());
            $cantPublisPorVer = $cantTotalVideos - count($repoVisto->findAll());
            
            $sumaPublisConEstado = $cantPublisDescartadas+$cantPublisAdquiridas+$cantPublisPorVer;

            $promedioPorEstadoPublis = array(
                "promedioAdquiridas" => $sumaPublisConEstado > 0 ? $cantPublisAdquiridas*100/$sumaPublisConEstado : 0,
                "promedioDescartadas" => $sumaPublisConEstado > 0 ? $cantPublisDescartadas*100/$sumaPublisConEstado : 0,
                "promedioGuardadas" => $sumaPublisConEstado > 0 ? $cantPublisGuardadas*100/$sumaPublisConEstado: 0         
            );
            $array = array(
                "cantUsersApp" => $cantUsers,
                "cantTotalPublicacionesApp" => $cantTotalVideos,
                "dineroTotalGastadoApp" => intval($montoTotalResult[0]['montoTotal']),
                "cantUsersPorLocalidad" => $cantUsersPorLocalidad,
                "cantUsersPorProvincia" => $cantUsersPorProvincia,
                "cantUsersPorFecha" => $cantUsersPorFecha,
                "cantPublisPorCategoria" => $cantPublisPorCategoria,
                "cantPublisDescartadas" => $cantPublisDescartadas,
                "cantPublisAdquiridas" => $cantPublisAdquiridas,
                "cantPublisGuardadas" => $cantPublisGuardadas,
                "cantPublisPorVer" => $cantPublisPorVer,
                "promedioPublisPorVer" => $cantTotalVideos > 0 ? $cantPublisPorVer*100/$cantTotalVideos : 0,
                "promedioPorEstadoPublis" => $promedioPorEstadoPublis
            );
            return $this->json([
                'message' => 'Lista de estadisticas de admin',
                'data' => $array
            ]);
        }
        return $this->json([
            'message' => 'No tiene permisos para realizar esta accion',
        ]);
    }

     /**
    * @Route("/api/vedor/handlerStrikes/{id}", name="handlestrike", methods={"GET"})
    */
    public function handlerStrikes( HttpClientInterface $client,EstadoNotificacionRepository $repoNoti, $id, UserRepository $repoUser,ManagerRegistry $doctrine): JsonResponse
    {
        date_default_timezone_set('America/Argentina/Buenos_Aires');
        $zonahoraria = date_default_timezone_get();
        
        if($this->getUser()->getRoles()[0] == 'ROLE_ADMIN' ){
            $userStrike = $repoUser->find($id);
            $entityManager = $doctrine->getManager();
            $date_fecha = new \DateTime(date("Y-m-d H:i:s"), new \DateTimeZone('America/Argentina/Buenos_Aires'));
       
            if($userStrike->getStrikes() < 2){
                $userStrike->setBanneado(false);
                $userStrike->setStrikes($userStrike->getStrikes()+1);
                $entityManager->persist($userStrike);

                $message = 'Has aplicado un strike al usuario '.$userStrike->getNombreCompleto();

                $response = $client->request(
                    'POST',
                    $_SERVER['DOMAIN_SOCKET_IO'].'/client/notificaciones',
                    [   
                        'json' => [
                            'contenido' => $message,
                            'estado' => 1,
                            'user_id' => $this->getUser()->getId()
                        ],
                    ]
                );
        
                $notificacion = new Notificacion;
                $notificacion->setEstado($repoNoti->find(1));
                $notificacion->setContenido($message);
                $notificacion->setIdUser($this->getUser());
                $notificacion->setDateCreate($date_fecha);
                $entityManager->persist($notificacion);

                $entityManager->flush();
                return $this->json([
                    'message' => 'Strike Add',
                ]);
            }
            $userStrike->setBanneado(true);
            $userStrike->setStrikes(0);
            $entityManager->persist($userStrike);

            $message = 'Tu cuenta en Enoff ha sido inhabilitada por infrigar las normas y políticas. Para más información comunicarse a sistemasdelsud@gmail.com';

            $response = $client->request(
                'POST',
                $_SERVER['DOMAIN_SOCKET_IO'].'/client/notificaciones',
                [   
                    'json' => [
                        'contenido' => $message,
                        'estado' => 1,
                        'user_id' => $userStrike->getId()
                    ],
                ]
            );
    
            $notificacion = new Notificacion;
            $notificacion->setEstado($repoNoti->find(1));
            $notificacion->setContenido($message);
            $notificacion->setIdUser($this->getUser());
            $notificacion->setDateCreate($date_fecha);
            $entityManager->persist($notificacion);

            $entityManager->flush(); 
            return $this->json([
                'message' => 'Banneado',
            ]);
        }
        return $this->json([
            'message' => 'No esta autorizado a realizar esta accion',
        ]);
    }

     /**
    * @Route("/api/admin/bannearUsuario/{id}", name="bannearUsuario", methods={"GET"})
    */
    public function bannearUsuario($id,UserRepository $repoUser,ManagerRegistry $doctrine): JsonResponse
    {
        if($this->getUser()->getRoles()[0] == 'ROLE_ADMIN'){
            $searchUsuario = $repoUser->find($id);
            $searchUsuario->setBanneado(true);
            $entityManager = $doctrine->getManager();
            $entityManager->persist($searchUsuario);
            $entityManager->flush();
            return $this->json([
                "data" => "usuario ".$searchUsuario->getNombreCompleto()." banneado de la aplicacion"
            ]);      
        }   
        return $this->json([
            "data" => "No tiene permisos para realizar esta accion"
        ]);
    }

}