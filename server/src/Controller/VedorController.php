<?php

namespace App\Controller;

use Symfony\Contracts\HttpClient\HttpClientInterface;
use App\Entity\Comentario;
use App\Entity\User;
use App\Entity\Notificacion;
use App\Entity\Publicacion;
use App\Entity\VedorPeriodista;
use App\Entity\VedorPublicacionComprado;
use App\Entity\VedorPublicacionDescartado;
use App\Entity\VedorPublicacionDestacado;
use App\Entity\VedorPublicacionGuardado;
use App\Entity\VedorPublicacionVisto;
use App\Repository\EstadoNotificacionRepository;
use App\Repository\EstadoPublicacionRepository;
use App\Repository\CategoriaPublicacionRepository;
use App\Repository\VedorPublicacionVistoRepository;
use App\Repository\VedorPublicacionCompradoRepository;
use App\Repository\LocalidadRepository;
use App\Repository\ProvinciaRepository;
use App\Repository\UserRepository;
use App\Repository\PublicacionRepository;
use App\Repository\VedorPeriodistaRepository;
use App\Repository\VedorPublicacionDescartadoRepository;
use App\Repository\VedorPublicacionGuardadoRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;

class VedorController extends AbstractController
{
    private function calificarPost($client, $message, $publi, $comentario, $calificacion, $repoEstado, $repoNoti, $entityManager, $user, $date_fecha)
    {
        date_default_timezone_set('America/Argentina/Buenos_Aires');
        $zonahoraria = date_default_timezone_get();

        $newDestacadaVedor = new VedorPublicacionDestacado();
        $newDestacadaVedor->setIdVedor($user->getId());
        $newDestacadaVedor->setIdPublicacion($publi->getId());
        $newDestacadaVedor->setDateCreate($date_fecha);
        $entityManager->persist($newDestacadaVedor);

        $newComentario = new Comentario();
        $newComentario->setContenido($comentario);
        $newComentario->setIdVedor($user);
        $newComentario->setDateCreate($date_fecha);
        $publi->addComentario($newComentario);
        $entityManager->persist($newComentario);

        $publi->setCalificacion($calificacion);
        $publi->addEstadoPublicacion($repoEstado->find(6));

        $entityManager->persist($publi);

        $client->request(
            'POST',
            $_SERVER['DOMAIN_SOCKET_IO'] . '/client/notificaciones',
            [
                'json' => [
                    'contenido' => $message,
                    'estado' => 1,
                    'user_id' => $publi->getUser()->getId()
                ],
            ]
        );

        $notificacion = new Notificacion;
        $notificacion->setEstado($repoNoti->find(1));
        $notificacion->setContenido($message);
        $notificacion->setIdUser($publi->getUser());
        $notificacion->setDateCreate($date_fecha);

        $entityManager->persist($notificacion);

        $entityManager->flush();
    }

    private function validateCredenciales($client, $credenciales, $entityManager)
    {
        date_default_timezone_set('America/Argentina/Buenos_Aires');
        $zonahoraria = date_default_timezone_get();
        $expiresIn = $credenciales->getExpiresIn();
        $date_fecha = new \DateTime(date("Y-m-d H:i:s"), new \DateTimeZone('America/Argentina/Buenos_Aires'));
        $diff = $date_fecha->diff($expiresIn);
        if ($diff->days >= 179) {

            $response = $client->request(
                'POST',
                'https://www.googleapis.com/youtube/v3/videos?key=YOUR_API_KEY&part=snippet,contentDetails,statistics,status',
                [
                    'headers' => [
                        'content-type' => 'application/x-www-form-urlencoded',
                        'accept' => 'application/json'
                    ],
                    'json' => [
                        'grant_type' => 'refresh_token',
                        'client_id' => '3552619241756436',
                        'client_secret' => 'x06NPi9HEy5cbmqLgDH9hlQ3RB1qyRAD',
                        'refresh_token' => $credenciales->getRefreshToken()
                    ],
                ]
            );

            $content =  json_decode($response->getContent());

            $credenciales->setExpiresIn($date_fecha);
            $credenciales->setRefreshToken($content->refresh_token);
            $credenciales->setAccessToken($content->access_token);
            $credenciales->setPublicKey($content->public_key);
            $entityManager->persist($credenciales);
            $entityManager->flush();
        };
    }

    /**
     * @Route("/api/vedor/addPeriodista", name="addPeriodista", methods={"POST"})
     */
    public function addPeriodista(Request $request, VedorPeriodistaRepository $repoVedorP, ManagerRegistry $doctrine): JsonResponse
    {
        if ($this->getUser()->getRoles()[0] == 'ROLE_VEDOR') {
            $idVedor = $this->getUser()->getId();
            $params = json_decode($request->getContent());
            $validate = $repoVedorP->findOneBy(array('idVedor' => $idVedor, 'idPeriodista' => $params->idPeriodista));
            if (empty($validate)) {
                $new = new VedorPeriodista();
                $new->setIdVedor($idVedor);
                $new->setIdPeriodista($params->idPeriodista);
                $new->setIdCategoria($params->idCategoria);
                $entityManager = $doctrine->getManager();
                $entityManager->persist($new);
                $entityManager->flush();
                return $this->json([
                    'message' => 'Periodista agregado',
                ]);
            }
            return $this->json([
                'message' => 'El periodista ya ha sido asignado',
            ]);
        }
        return $this->json([
            'message' => 'No tiene permisos para realizar esta accion',
        ]);
    }

    /**
     * @Route("/api/vedor/listPeriodistasDisponibles", name="listPeriodistasDisponibles", methods={"GET"})
     */
    public function listPeriodistasDisponibles(ManagerRegistry $doctrine): JsonResponse
    {
        if ($this->getUser()->getRoles()[0] == 'ROLE_VEDOR') {
            $idVedor = $this->getUser()->getId();
            $array = array();
            $periodistasDisponibles = $doctrine->getManager()->getRepository(User::class)->getPeriodistasDisponibles($idVedor);
            $periodistas = $periodistasDisponibles['query']->getResult();
            foreach ($periodistas as $u) {
                if (!$u->isBanneado()) {
                    $tupla = array(
                        "id" => $u->getId(),
                        "pathFotoPerfil" => $u->getPathFotoPerfil(),
                        "nombreCompleto" => $u->getNombreCompleto()
                    );
                    array_push($array, $tupla);
                }
            }
            return $this->json([
                'data' => count($array) > 0 ? $array : 'Periodistas asignados en estado banneado'
            ]);
            return $this->json([
                'message' => 'Sin periodistas disponibles',
            ]);
        }
        return $this->json([
            'message' => 'No tiene permisos para realizar esta accion',
        ]);
    }
    /**
     * @Route("/api/vedor/listPeriodistasAsignados", name="listPeriodistasAsignados", methods={"POST"})
     */
    public function listPeriodistasAsignados(Request $request, VedorPeriodistaRepository $repoVedorP, ManagerRegistry $doctrine, UserRepository $repoUser, CategoriaPublicacionRepository $repoCate): JsonResponse
    {
        if ($this->getUser()->getRoles()[0] == 'ROLE_VEDOR') {
            $params = json_decode($request->getContent());
            $idCategoria = $params->idCategoria;
            $page = $params->page;
            $idVedor = $this->getUser()->getId();

            $limit = 5;
            $periodistasAsignados = $doctrine->getManager()->getRepository(User::class)->getPeriodistasAsignados($idVedor, $idCategoria, $page, $limit);
            $periodistas = $periodistasAsignados['query']->getResult();

            $maxPages = ceil($periodistasAsignados['paginator']->count() / $limit);
            $totalRegisters = count($periodistasAsignados['paginator']);

            $categorias = array();
            $array = array();
            foreach ($periodistas as $p) {
                $tupla = array(
                    "pathFotoPerfil" => $p[0]->getPathFotoPerfil(),
                    "nombreCompleto" => $p[0]->getNombreCompleto(),
                    "idPeriodista" => $p[0]->getId(),
                    "email" => $p[0]->getUserName(),
                    "nombreCategoria" => $p['nombreCategoria']
                );
                array_push($array, $tupla);

                if (count($categorias) > 0) {
                    if (!in_array(array('id' => $p['idCategoria'], "nombre" => $p['nombreCategoria']), $categorias)) {
                        $categ = array(
                            "id" => $p['idCategoria'],
                            "nombre" => $p['nombreCategoria']
                        );
                        array_push($categorias, $categ);
                    }
                } else {
                    $categ = array(
                        "id" => $p['idCategoria'],
                        "nombre" => $p['nombreCategoria']
                    );
                    array_push($categorias, $categ);
                }
            }
            if (count($array) > 0) {
                return $this->json([
                    'data' => $array,
                    'maxPages' =>  $maxPages,
                    'totalRegisters' => $totalRegisters,
                    'message' => 'Listado de periodistas asignados',
                    'categorias' =>  $categorias
                ]);
            }
            return $this->json([
                'message' => 'Sin periodistas asignados',
            ]);
        }
        return $this->json([
            'message' => 'No tiene permisos para realizar esta accion',
        ]);
    }

    /**
     * @Route("/api/vedor/deletePeriodista", name="deletePeriodista", methods={"POST"})
     */
    public function deletePeriodista(Request $request, VedorPeriodistaRepository $repoVedorP, ManagerRegistry $doctrine): JsonResponse
    {
        if ($this->getUser()->getRoles()[0] == 'ROLE_VEDOR') {
            $idVedor = $this->getUser()->getId();
            $params = json_decode($request->getContent());
            $result = $repoVedorP->findOneBy(array(
                'idVedor' => $idVedor,
                'idPeriodista' => $params->idPeriodista
            ));
            if (!empty($result)) {
                $entityManager = $doctrine->getManager();
                $entityManager->remove($result);
                $entityManager->flush();
                return $this->json([
                    'message' => 'Periodista borrado de la lista del vedor',
                ]);
            }
            return $this->json([
                'message' => 'Ocurrio un problema',
            ]);
        }
        return $this->json([
            'message' => 'No tiene permisos para realizar esta accion',
        ]);
    }

    /**
     * @Route("/api/vedor/listPostVedor", name="listPostVedor", methods={"POST"})
     */
    public function listPostVedor(Request $request, ManagerRegistry $doctrine, EstadoPublicacionRepository $repoEstadosPubli, LocalidadRepository $repolocal, ProvinciaRepository $repoprov): JsonResponse
    {
        if ($this->getUser()->getRoles()[0] == "ROLE_VEDOR") {

            $params = json_decode($request->getContent());

            $titulo = $params->titulo;
            $categoria = $params->idCategoria;
            $currentPage = $params->page;
            $fechaI = $params->fechaInicio;
            $fechaF = $params->fechaFin;
            $calificacion = $params->calificacion;
            $localidad = $params->localidad !== "" ? $repolocal->findOneBy(array('nombre' => $params->localidad))->getId() : "";
            $provincia = $params->provincia !== "" ? $repoprov->findOneBy(array('nombre' => $params->provincia))->getId() : "";
            $idVedor = $this->getUser()->getId();
            $estado = $params->idestado;
            $urgente = $params->urgente;
            $iduser = $params->iduser;

            $limit = 12;
            $result = $doctrine->getManager()->getRepository(Publicacion::class)->getPublicacionesVedor($categoria, $currentPage, $limit, $calificacion, $localidad, $provincia, $idVedor, $estado, $fechaI, $fechaF, $titulo, $iduser, $urgente);

            $tabla = $result['query']->getResult();

            $maxPages = ceil($result['paginator']->count() / $limit);
            $totalRegisters = count($result['paginator']);

            $localidades = array();
            $provincias = array();
            $categorias = array();
            $calificaciones = array();

            $array = array();
            for ($i = 0; $i < count($tabla); $i++) {

                $entityManager = $doctrine->getManager();
                $tabla[$i]->addEstadoPublicacion($repoEstadosPubli->find(4));
                $entityManager->persist($tabla[$i]);
                $entityManager->flush();

                $estados = array();
                foreach ($tabla[$i]->getEstadoPublicacion() as $estado) {
                    $arra = array(
                        'id' => $estado->getId(),
                        'nombre' => $estado->getNombre()
                    );
                    array_push($estados, $arra);
                }
                $comentarios = array();
                if (count($tabla[$i]->getComentarios()) > 0) {
                    foreach ($tabla[$i]->getComentarios() as $comentario) {
                        $arra2 = array(
                            'id' => $comentario->getId(),
                            'idVedor' => $comentario->getIdVedor()->getId(),
                            'nombreVedor' => $comentario->getIdVedor()->getNombreCompleto(),
                            'contenido' => $comentario->getContenido(),
                            'fecha' => $comentario->getDateCreate(),
                        );
                        array_push($comentarios, $arra2);
                    }
                } else {
                    $comentarios = 'Sin Comentarios';
                }

                if (count($categorias) > 0) {

                    if (!in_array(array('id' => $tabla[$i]->getCategoria()->getId(), 'nombre' => $tabla[$i]->getCategoria()->getNombreCategoria()), $categorias)) {
                        $tupla = array(
                            'id' => $tabla[$i]->getCategoria()->getId(),
                            'nombre' => $tabla[$i]->getCategoria()->getNombreCategoria()
                        );
                        array_push($categorias, $tupla);
                    }
                } else {
                    $tupla = array(
                        'id' => $tabla[$i]->getCategoria()->getId(),
                        'nombre' => $tabla[$i]->getCategoria()->getNombreCategoria()
                    );
                    array_push($categorias, $tupla);
                }

                if (count($localidades) > 0) {
                    if (!in_array(array('localidad' => $tabla[$i]->getLocalidad()->getNombre()), $localidades)) {
                        $localidad = array(
                            'localidad' => $tabla[$i]->getLocalidad()->getNombre()
                        );
                        array_push($localidades, $localidad);
                    }
                } else {
                    $localidad = array(
                        'localidad' => $tabla[$i]->getLocalidad()->getNombre()
                    );
                    array_push($localidades, $localidad);
                }

                if (count($provincias) > 0) {
                    if (!in_array(array('provincia' => $tabla[$i]->getProvincia()->getNombre()), $provincias)) {
                        $provincia = array(
                            'provincia' => $tabla[$i]->getProvincia()->getNombre()
                        );
                        array_push($provincias, $provincia);
                    }
                } else {
                    $provincia = array(
                        'provincia' => $tabla[$i]->getProvincia()->getNombre()
                    );
                    array_push($provincias, $provincia);
                }

                if (count($calificaciones) > 0) {
                    if (!in_array(array('calificacion' => $tabla[$i]->getCalificacion()), $calificaciones)) {
                        $calificacion = array(
                            'calificacion' => $tabla[$i]->getCalificacion()
                        );
                        array_push($calificaciones, $calificacion);
                    }
                } else {
                    $calificacion = array(
                        'calificacion' => $tabla[$i]->getCalificacion()
                    );
                    array_push($calificaciones, $calificacion);
                }

                $d = array(
                    'idPublicacion' => $tabla[$i]->getId(),
                    'titulo' => $tabla[$i]->getTitulo(),
                    'descripcion' => $tabla[$i]->getDescripcion(),
                    'localidad' => $tabla[$i]->getLocalidad()->getNombre(),
                    'provincia' => $tabla[$i]->getProvincia()->getNombre(),
                    'idCategoria' => $tabla[$i]->getCategoria()->getId(),
                    'categoria' => $tabla[$i]->getCategoria()->getNombreCategoria(),
                    'calificacion' => $tabla[$i]->getCalificacion(),
                    'precio' => $tabla[$i]->getPrecio(),
                    'path' => $tabla[$i]->getPath(),
                    'idUserCreador' => $tabla[$i]->getUser()->getId(),
                    'nombreUserCreador' => $tabla[$i]->getUser()->getNombreCompleto(),
                    'pathUserCreador' => !empty($tabla[$i]->getUser()->getPathFotoPerfil()) ? $tabla[$i]->getUser()->getPathFotoPerfil() : "Sin Foto",
                    'public_key' => $tabla[$i]->getUser()->getMercadoPago()[0] != null ? $tabla[$i]->getUser()->getMercadoPago()[0]->getPublicKey() : 'Desvinculado',
                    'fecha' => $tabla[$i]->getFechaPublicacion(),
                    'estados' => $estados,
                    'comentarios' => $comentarios
                );
                array_push($array, $d);
            }

            return new JsonResponse([
                'message' => 'Lista de publicaciones de un vedor',
                'data' => count($array) > 0 ? $array : null,
                'categorias' => $categorias,
                'localidades' => $localidades,
                'provincias' => $provincias,
                'calificaciones' => $calificaciones,
                'maxPages' => $maxPages,
                'totalRegister' => $totalRegisters,
                'titulo' => empty($titulo) ? "" : $params->titulo,
            ]);
        }
        return $this->json([
            'message' => 'No tiene permisos para realizar esta accion',
        ]);
    }

    /**
     * @Route("/api/descartarPostVedor", name="deletePostVedor", methods={"POST"})
     */
    public function descartarPostVedor(Request $request, HttpClientInterface $client, EstadoNotificacionRepository $repoNoti, PublicacionRepository $repoPubli, EstadoPublicacionRepository $repoEstado, ManagerRegistry $doctrine): JsonResponse
    {
        if ($this->getUser()->getRoles()[0] == "ROLE_VEDOR") {
            date_default_timezone_set('America/Argentina/Buenos_Aires');
            $zonahoraria = date_default_timezone_get();
            $params = json_decode($request->getContent());
            $publi = $repoPubli->find($params->idPublicacion);

            if (!$publi->getEstadoPublicacion()->contains($repoEstado->find(3))) {

                date_default_timezone_set('America/Argentina/Buenos_Aires');
                $zonahoraria = date_default_timezone_get();

                $date_fecha = new \DateTime(date("Y-m-d H:i:s"), new \DateTimeZone('America/Argentina/Buenos_Aires'));

                $entityManager = $doctrine->getManager();

                $publi->addEstadoPublicacion($repoEstado->find(3));

                $entityManager->persist($publi);

                $newDescartVedor = new VedorPublicacionDescartado();
                $newDescartVedor->setIdVedor($this->getUser()->getId());
                $newDescartVedor->setIdPublicacion($publi->getId());
                $newDescartVedor->setDateCreate($date_fecha);
                $entityManager->persist($newDescartVedor);

                $message = 'Descartaste un video del usuario ' . $publi->getUser()->getNombreCompleto();

                $response = $client->request(
                    'POST',
                    $_SERVER['DOMAIN_SOCKET_IO'] . '/client/notificaciones',
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

                $message = 'Debido al contenido de la publicacion ' . $publi->getTitulo() . ' El video ha sido eliminado por no cumplir con las normas de la plataforma';

                $this->calificarPost($client, $message, $publi, $params->comentario, $params->calificacion, $repoEstado, $repoNoti, $entityManager, $this->getUser(), $date_fecha);

                $entityManager->flush();

                return new JsonResponse([
                    'message' => 'Post descartado correctamente',
                ]);
            }
            return new JsonResponse([
                'message' => 'Este post ya fue descartado anteriormente',
            ]);
        }
        return new JsonResponse([
            'message' => 'No esta autorizado a realizar esta accion',
        ]);
    }

    /**
     * @Route("/api/guardarPostVedor/{id}", name="guardarPost", methods={"GET"})
     */
    public function guardarPostVedor($id, HttpClientInterface $client, VedorPublicacionGuardadoRepository $repoGuardaVedor, PublicacionRepository $repoPubli, EstadoPublicacionRepository $repoEstado, EstadoNotificacionRepository $repoNoti, ManagerRegistry $doctrine): JsonResponse
    {
        $user = $this->getUser();
        if ($this->getUser()->getRoles()[0] == "ROLE_VEDOR") {

            $searchPublicGuardada = $repoGuardaVedor->findBy(array("idPublicacion" => $id));

            if (empty($searchPublicGuardada)) {

                date_default_timezone_set('America/Argentina/Buenos_Aires');
                $zonahoraria = date_default_timezone_get();

                $date_fecha = new \DateTime(date("Y-m-d H:i:s"), new \DateTimeZone('America/Argentina/Buenos_Aires'));

                $newGuardaVedor = new VedorPublicacionGuardado();
                $newGuardaVedor->setIdVedor($user->getId());
                $newGuardaVedor->setIdPublicacion($id);
                $newGuardaVedor->setDateCreate($date_fecha);
                $entityManager = $doctrine->getManager();
                $entityManager->persist($newGuardaVedor);

                $publi = $repoPubli->find($id);

                $publi->addEstadoPublicacion($repoEstado->find(5));

                $message = 'Has guardado un video del usuario ' . $publi->getUser()->getNombreCompleto();

                $response = $client->request(
                    'POST',
                    $_SERVER['DOMAIN_SOCKET_IO'] . '/client/notificaciones',
                    [
                        'json' => [
                            'contenido' => $message,
                            'estado' => 1,
                            'user_id' => $this->getUser()->getId()
                        ],
                    ]
                );

                $entityManager = $doctrine->getManager();

                $notificacion = new Notificacion;
                $notificacion->setEstado($repoNoti->find(1));
                $notificacion->setContenido($message);
                $notificacion->setIdUser($this->getUser());
                $notificacion->setDateCreate($date_fecha);

                $entityManager->persist($notificacion);
                $entityManager->flush();

                return new JsonResponse([
                    'message' => 'Post guardado correctamente',
                ]);
            }
            return new JsonResponse([
                'message' => 'El post ya fue guardado anteriormente',
            ]);
        }
        return new JsonResponse([
            'message' => 'No tiene permisos para realizar esta accion',
        ]);
    }

    /**
     * @Route("/api/comprarPostVedor", name="comprarPostVedor", methods={"POST"})
     */
    public function comprarPostVedor(Request $request, HttpClientInterface $client, VedorPublicacionDescartadoRepository $repoDescartVedor, EstadoPublicacionRepository $repoEstado, EstadoNotificacionRepository $repoNoti, ManagerRegistry $doctrine, EstadoPublicacionRepository $repoEstadosPubli, PublicacionRepository $repoPubli): JsonResponse
    {
        $params = json_decode($request->getContent());

        date_default_timezone_set('America/Argentina/Buenos_Aires');
        $zonahoraria = date_default_timezone_get();

        if ($this->getUser()->getRoles()[0] == "ROLE_VEDOR") {
            $publi = $repoPubli->find($params->id);
            $entityManager = $doctrine->getManager();

            $comprasVedor = $doctrine->getManager()->getRepository(VedorPublicacionComprado::class)->getComprasVedorMes($this->getUser()->getId());
            $comprasDelMes = $comprasVedor['query']->getResult();
            $montoCompras = 0;
            foreach ($comprasDelMes as $compra) {
                $searchPubli = $repoPubli->find($compra->getIdPublicacion());
                $montoCompras = $montoCompras + $searchPubli->getPrecio();
            }

            if ($publi->getUser()->getMercadoPago() !== null) {
                if (!$publi->getEstadoPublicacion()->contains($repoEstadosPubli->find(1))) {
                    if ($montoCompras + $publi->getPrecio() <= 60000) {
                        if (empty($repoDescartVedor->findOneBy(array("idPublicacion" => $publi->getId())))) {
                            if (!$publi->getUser()->isBanneado()) {

                                $this->validateCredenciales($client, $publi->getUser()->getMercadoPago()[0], $entityManager);
                                \MercadoPago\SDK::setAccessToken($publi->getUser()->getMercadoPago()[0]->getAccessToken());

                                $payment = new \MercadoPago\Payment();
                                $payment->transaction_amount = $params->transaction_amount;
                                $payment->token = $params->token;
                                $payment->installments = $params->installments;
                                $payment->payment_method_id = $params->payment_method_id;
                                $payment->issuer_id = $params->issuer_id;

                                $payer = new \MercadoPago\Payer();
                                $payer->email = $params->payer->email;
                                $payer->identification = array(
                                    "type" => $params->payer->identification->type,
                                    "number" => $params->payer->identification->number
                                );
                                $payment->payer = $payer;

                                $payment->save();

                                if ($payment->status == "approved") {
                                    $publi->addEstadoPublicacion($repoEstadosPubli->find(1));

                                    $date_fecha = new \DateTime(date("Y-m-d H:i:s"), new \DateTimeZone('America/Argentina/Buenos_Aires'));


                                    $entityManager->persist($publi);

                                    $newCompraVedor = new VedorPublicacionComprado();
                                    $newCompraVedor->setIdVedor($this->getUser()->getId());
                                    $newCompraVedor->setIdPublicacion($publi->getId());
                                    $newCompraVedor->setDateCreate($date_fecha);

                                    $entityManager = $doctrine->getManager();
                                    $entityManager->persist($newCompraVedor);

                                    $message = '¡Muy bien! Has adquirido un video del usuario ' . $publi->getUser()->getNombreCompleto() . '. Ingresa a tus adquiridos para poder visualizarlo.';

                                    $response = $client->request(
                                        'POST',
                                        $_SERVER['DOMAIN_SOCKET_IO'] . '/client/notificaciones',
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

                                    $message = "Felicitaciones! el contenido de la publicacion: " . $publi->getTitulo() . " ha sido comprado";

                                    $this->calificarPost($client, $message, $publi, $params->comentario, $params->calificacion, $repoEstado, $repoNoti, $entityManager, $this->getUser(), $date_fecha);

                                    $entityManager->flush();

                                    return $this->json([
                                        'status' => $payment->status,
                                        'status_detail' => $payment->status_detail,
                                        'message' => 'Post comprado correctamente',
                                    ], JsonResponse::HTTP_OK);
                                }
                                return $this->json([
                                    'message' => 'Procesamiento de pago fallido, por favor, contacte a su proovedor de pagos',
                                ], JsonResponse::HTTP_CONFLICT);
                            }
                            return $this->json([
                                'message' => 'Error - usuario creador banneado',
                            ], JsonResponse::HTTP_CONFLICT);
                        }
                        return $this->json([
                            'message' => 'Error - El video no esta habilitado para la compra porque ha sido descartado por un Veedor',
                        ], JsonResponse::HTTP_CONFLICT);
                    }
                    return $this->json([
                        'message' => 'Error - Usted se excedio del limite de compra mensual',
                    ], JsonResponse::HTTP_CONFLICT);
                }
                return $this->json([
                    'message' => 'Error - El post ya fue comprado',
                ], JsonResponse::HTTP_CONFLICT);
            }
            return $this->json([
                'message' => 'Error, no se cuentan con credenciales del creador de contenido para procesar el pago',
            ], JsonResponse::HTTP_CONFLICT);
        }
        return $this->json([
            'message' => 'No esta autorizado a realizar esta accion'
        ], JsonResponse::HTTP_CONFLICT);
    }

    /**
     * @Route("/api/vistoPost/{id}", name="checkPost", methods={"GET"})
     */
    public function checkPost($id, VedorPublicacionVistoRepository $repoVistos, ManagerRegistry $doctrine): JsonResponse
    {
        if ($this->getUser()->getRoles()[0] == "ROLE_VEDOR") {
            if (empty($repoVistos->findOneBy(array("idPublicacion" => $id)))) {
                $date_fecha = new \DateTime(date("Y-m-d H:i:s"), new \DateTimeZone('America/Argentina/Buenos_Aires'));

                $newPubliVisto = new VedorPublicacionVisto();
                $newPubliVisto->setIdVedor($this->getUser()->getId());
                $newPubliVisto->setIdPublicacion($id);
                $newPubliVisto->setDateCreate($date_fecha);

                $entityManager = $doctrine->getManager();
                $entityManager->persist($newPubliVisto);
                $entityManager->flush();

                return new JsonResponse([
                    'message' => 'Publicacion registrada como vista',
                    'estado' => true
                ], JsonResponse::HTTP_OK);
            }
            return new JsonResponse([
                'message' => 'Publicacion registrada como vista',
                'estado' => false

            ], JsonResponse::HTTP_CONFLICT);
        }
        return new JsonResponse([
            'status' => 500,
            'message' => 'No esta autorizado a realizar esta accion'
        ]);
    }

    /**
     * @Route("/api/vedor/enviovideocomprado", name="envioVideoComprado", methods={"POST"})
     */
    public function envioVideoComprado(Request $request, VedorPublicacionCompradoRepository $repoCompras, PublicacionRepository $repoPubli, UserRepository $repoUser, ManagerRegistry $doctrine, MailerInterface $mailer): JsonResponse
    {
        if ($this->getUser()->getRoles()[0] == 'ROLE_VEDOR') {
            $params = json_decode($request->getContent());
            $validatingCompra = $repoCompras->findOneBy(array('idPublicacion' => $params->idpost));
            if (!empty($validatingCompra)) {
                $post = $repoPubli->findOneBy(array('id' => $params->idpost));
                foreach ($params->idPeriodistas as $id) {
                    $periodista = $repoUser->find($id);
                    $message = (new Email())
                        ->from('info@enoff.com.ar')
                        ->to($periodista->getUserName())
                        ->subject('Enoff - Link de descarga enviado por el Veedor ' . $this->getUser()->getNombreCompleto())
                        ->html('<!doctype html><html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office"><head><title>[[data:bienvenida-enoff:""]]</title><!--[if !mso]><!--><meta http-equiv="X-UA-Compatible" content="IE=edge"><!--<![endif]--><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style type="text/css">#outlook a { padding:0; }
                                    body { margin:0;padding:0;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%; }
                                    table, td { border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt; }
                                    img { border:0;height:auto;line-height:100%; outline:none;text-decoration:none;-ms-interpolation-mode:bicubic; }
                                    p { display:block;margin:13px 0; }</style><!--[if mso]>
                                    <noscript>
                                    <xml>
                                    <o:OfficeDocumentSettings>
                                    <o:AllowPNG/>
                                    <o:PixelsPerInch>96</o:PixelsPerInch>
                                    </o:OfficeDocumentSettings>
                                    </xml>
                                    </noscript>
                                    <![endif]--><!--[if lte mso 11]>
                                    <style type="text/css">
                                    .mj-outlook-group-fix { width:100% !important; }
                                    </style>
                                    <![endif]--><!--[if !mso]><!--><link href="https://fonts.googleapis.com/css?family=Ubuntu:300,400,500,700" rel="stylesheet" type="text/css"><link href="https://fonts.googleapis.com/css?family=Source+Code+Pro" rel="stylesheet" type="text/css"><link href="https://fonts.googleapis.com/css?family=Source+Code+Pro" rel="stylesheet" type="text/css"><style type="text/css">@import url(https://fonts.googleapis.com/css?family=Ubuntu:300,400,500,700);
                                    @import url(https://fonts.googleapis.com/css?family=Source+Code+Pro);
                                    @import url(https://fonts.googleapis.com/css?family=Source+Code+Pro);</style><!--<![endif]--><style type="text/css">@media only screen and (min-width:480px) {
                                            .mj-column-per-100 { width:100% !important; max-width: 100%; }
                                        }</style><style media="screen and (min-width:480px)">.moz-text-html .mj-column-per-100 { width:100% !important; max-width: 100%; }</style><style type="text/css">[owa] .mj-column-per-100 { width:100% !important; max-width: 100%; }</style><style type="text/css"></style></head><body style="word-spacing:normal;background-color:#F4F4F4;"><div style="background-color:#F4F4F4;"><!--[if mso | IE]><table align="center" border="0" cellpadding="0" cellspacing="0" class="" role="presentation" style="width:600px;" width="600" bgcolor="#ffffff" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><v:rect style="width:600px;" xmlns:v="urn:schemas-microsoft-com:vml" fill="true" stroke="false"><v:fill origin="0.5, 0" position="0.5, 0" src="https://06psq.mjt.lu/tplimg/06psq/b/lz5zz/g6yt3.jpeg" color="#ffffff" type="tile" /><v:textbox style="mso-fit-shape-to-text:true" inset="0,0,0,0"><![endif]--><div style="background:#ffffff url("https://06psq.mjt.lu/tplimg/06psq/b/lz5zz/g6yt3.jpeg") center top / auto no-repeat;background-position:center top;background-repeat:no-repeat;background-size:auto;margin:0px auto;max-width:600px;"><div style="line-height:0;font-size:0;"><table align="center" background="https://06psq.mjt.lu/tplimg/06psq/b/lz5zz/g6yt3.jpeg" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#ffffff url("https://06psq.mjt.lu/tplimg/06psq/b/lz5zz/g6yt3.jpeg") center top / auto no-repeat;background-position:center top;background-repeat:no-repeat;background-size:auto;width:100%;"><tbody><tr><td style="direction:ltr;font-size:0px;padding:20px 50px 20px 50px;padding-left:50px;padding-right:50px;text-align:center;"><!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:500px;" ><![endif]--><div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;"><table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%"><tbody><tr><td style="font-size:0px;word-break:break-word;"><div style="height:239px;line-height:239px;">&#8202;</div></td></tr><tr><td style="font-size:0px;word-break:break-word;"><div style="height:150px;line-height:150px;">&#8202;</div></td></tr><tr><td style="font-size:0px;word-break:break-word;"><div style="height:17px;line-height:17px;">&#8202;</div></td></tr><tr><td style="font-size:0px;word-break:break-word;"><div style="height:198px;line-height:198px;">&#8202;</div></td></tr><tr><td align="left" style="font-size:0px;padding:0px 7px 0px 7px;padding-top:0px;padding-right:7px;padding-bottom:0px;padding-left:7px;word-break:break-word;"><div style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:22px;letter-spacing:normal;line-height:1;text-align:left;color:#000000;"><p class="text-build-content" style="text-align: center; margin: 10px 0; margin-top: 10px;" data-testid="KeNAxYg29">&nbsp;</p><p class="text-build-content" style="text-align: center; margin: 10px 0;" data-testid="KeNAxYg29"><span style="color:#000000;font-family:Source Code Pro, Arial, Helvetica, sans-serif;font-size:22px;">¡</span><span style="color:#B1E5F7;font-family:Source Code Pro, Arial, Helvetica, sans-serif;font-size:22px;">Ya estás listo para descargar tu video adquirido, hace click!</span></p><p class="text-build-content" style="text-align: center; margin: 10px 0;" data-testid="KeNAxYg29">&nbsp;</p><p class="text-build-content" style="text-align: center; margin: 10px 0; margin-bottom: 10px;" data-testid="KeNAxYg29">&nbsp;</p></div></td></tr><tr><td align="center" vertical-align="middle" style="font-size:0px;padding:10px 25px 10px 25px;padding-right:25px;padding-left:25px;word-break:break-word;"><table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:separate;line-height:100%;"><tbody><tr><td align="center" bgcolor="#da643a" role="presentation" style="border:none;border-radius:3px;cursor:auto;mso-padding-alt:10px 25px 10px 25px;background:#da643a;" valign="middle"><p style="display:inline-block;background:#da643a;color:#ffffff;font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:22px;font-weight:normal;line-height:120%;margin:0;text-decoration:none;text-transform:none;padding:10px 25px 10px 25px;mso-padding-alt:0px;border-radius:3px;"><a href="' . $params->link . '" style="color:#ffffff;font-family:Arial Black, Helvetica, Arial, sans-serif;font-size:22px;">Descargar Video</a></p></td></tr></tbody></table></td></tr><tr><td style="font-size:0px;word-break:break-word;"><div style="height:35px;line-height:35px;">&#8202;</div></td></tr><tr><td style="font-size:0px;word-break:break-word;"><div style="height:236px;line-height:236px;">&#8202;</div></td></tr></tbody></table></div><!--[if mso | IE]></td></tr></table><![endif]--></td></tr></tbody></table></div></div><!--[if mso | IE]></v:textbox></v:rect></td></tr></table><table align="center" border="0" cellpadding="0" cellspacing="0" class="" role="presentation" style="width:600px;" width="600" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]--><div style="margin:0px auto;max-width:600px;"><table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;"><tbody><tr><td style="direction:ltr;font-size:0px;padding:20px 0px 20px 0px;text-align:center;"><!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:600px;" ><![endif]--><div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;"><table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%"><tbody><tr><td style="vertical-align:top;padding:0;"><table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%"><tbody><tr><td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;"><div style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:11px;line-height:22px;text-align:center;color:#000000;"><p style="margin: 10px 0;"><a href="[[UNSUB_LINK_EN]]" style="color:inherit;text-decoration:none;" target="_blank"></a>.</p></div></td></tr><tr><td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;"><div style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:11px;line-height:22px;text-align:center;color:#000000;"><p style="margin: 10px 0;"></p></div></td></tr></tbody></table></td></tr></tbody></table></div><!--[if mso | IE]></td></tr></table><![endif]--></td></tr></tbody></table></div><!--[if mso | IE]></td></tr></table><![endif]--></div></body></html>');
                    $mailer->send($message);
                }
                return $this->json([
                    'message' => 'Mails de compra enviados correctamente',
                ]);
            }
            return $this->json([
                'message' => 'Error - Aun no se registro la compra de este video',
            ]);
        }
        return $this->json([
            'message' => 'No esta autorizado a realizar esta accion',
        ]);
    }

    /**
     * @Route("/testwebsocket", name="testwebsocket", methods={"GET"})
     */
    public function test(HttpClientInterface $client): JsonResponse
    {   
        $response = $client->request(
            'POST',
            $_SERVER['DOMAIN_SOCKET_IO'] . '/client/notificaciones',
            [
                'json' => [
                    'contenido' => 'Mensaje de prueba',
                    'estado' => 1,
                    'user_id' => 6 
                ],
            ]
        );
        return new JsonResponse([
            'message' => 'Envio'
        ]);
    }
}
