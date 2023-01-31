<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use App\Repository\CodigoUserRepository;
use Doctrine\Persistence\ManagerRegistry;
use App\Entity\User;
use Symfony\Component\Mime\Email;
use App\Entity\VedorPublicacionComprado;
use App\Repository\PublicacionRepository;
use App\Repository\UserRepository;
use App\Repository\VedorPublicacionCompradoRepository;
use App\Repository\VedorPublicacionDescartadoRepository;
use App\Repository\VedorPublicacionDestacadoRepository;
use App\Repository\VedorPublicacionGuardadoRepository;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Contracts\HttpClient\HttpClientInterface;


class UserController extends AbstractController
{
  private function validateCredenciales($client, $credenciales, $entityManager)
  {
    $expiresIn = $credenciales->getExpiresIn();
    $date_fecha = new \DateTime(date("Y-m-d H:i:s"), new \DateTimeZone('America/Argentina/Buenos_Aires'));
    $diff = $date_fecha->diff($expiresIn);
    if ($diff->days >= 179) {

      $response = $client->request(
        'POST',
        'https://api.mercadopago.com/oauth/token',
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
   * @Route("/api/perfilUsuario", name="perfilUsuario", methods={"GET"})
   */
  public function perfilUsuario(ManagerRegistry $doctrine, HttpClientInterface $client, PublicacionRepository $repoPubli, VedorPublicacionDestacadoRepository $repoDestacVedor, VedorPublicacionGuardadoRepository $repoGuardaVedor, VedorPublicacionCompradoRepository $repoCompraVedor, VedorPublicacionDescartadoRepository $repoDescartVedor): JsonResponse
  {
    $user = $this->getUser();
    $entityManager = $doctrine->getManager();

    if ($user->getRoles()[0] == 'ROLE_USER') {

      if (!empty($user->getMercadoPago()[0])) {
        $this->validateCredenciales($client, $user->getMercadoPago()[0], $entityManager);
      };

      $publicaciones = $user->getPublicaciones();

      $contadorVideosMonetizados = 0;
      $contadorVideosPublicos = 0;
      $contadorVideosEliminados = 0;
      $sumaMontoTotalPagado = 0;
      $sumaCalificacionPublicaciones = 0;
      foreach ($publicaciones as $publi) {
        $sumaCalificacionPublicaciones = $sumaCalificacionPublicaciones + $publi->getCalificacion();
        $collection = $publi->getEstadoPublicacion();
        $index = 0;
        while ($index < $collection->count()) {
          if ($collection[$index]->getId() == 1) {
            $contadorVideosMonetizados++;
            $sumaMontoTotalPagado = $sumaMontoTotalPagado + $publi->getPrecio();
          } elseif ($collection[$index]->getId() == 4) {
            $contadorVideosPublicos++;
          } elseif ($collection[$index]->getId() == 3) {
            $contadorVideosEliminados++;
          };
          $index++;
        }
      }
      $contadorVideosCargados = count($publicaciones) - $contadorVideosEliminados;

      $array = array(
        'roles' => $user->getRoles(),
        'idUser' =>  $user->getId(),
        'nombreCompleto' => $user->getNombreCompleto(),
        'pathFotoPerfil' => !empty($user->getPathFotoPerfil()) ? $user->getPathFotoPerfil() : "Sin Foto",
        'email' => $user->getUserName(),
        'telefono' => $user->getTelefono(),
        'localidad' => $user->getLocalidad(),
        'provincia' => $user->getProvincia(),
        'credenciales' => $user->getMercadoPago()[0] !== null ? 'Vinculado' : 'Desvinculado',
        'descripcion' => $user->getDescripcion(),
        'montoTotalPagado' => $sumaMontoTotalPagado,
        'calificacion' => $contadorVideosCargados > 0 ? $sumaCalificacionPublicaciones / $contadorVideosCargados : 0,
        'videosCargados' => $contadorVideosCargados,
        'videosMonetizados' =>  $contadorVideosMonetizados,
        'videosNoMonetizados' => count($publicaciones) - $contadorVideosMonetizados,
        'videosEliminados' => $contadorVideosEliminados,
        'strikes' => $user->getStrikes(),
        'banneado' => $user->isBanneado()
      );


      return new JsonResponse([
        'userData' => $array,
        'message' => 'Datos del usuario',
      ]);
    } elseif ($user->getRoles()[0] == 'ROLE_VEDOR') {

      $comprasVedor = $doctrine->getManager()->getRepository(VedorPublicacionComprado::class)->getComprasVedorMes($user->getId());

      $comprasDelMes = $comprasVedor['query']->getResult();
      $montoCompras = 0;

      foreach ($comprasDelMes as $compra) {
        $searchPubli = $repoPubli->find($compra->getIdPublicacion());
        $montoCompras = $montoCompras + $searchPubli->getPrecio();
      }

      $array = array(
        'roles' => $user->getRoles(),
        'idUser' =>  $user->getId(),
        'nombreCompleto' => $user->getNombreCompleto(),
        'pathFotoPerfil' => !empty($user->getPathFotoPerfil()) ? $user->getPathFotoPerfil() : "Sin Foto",
        'email' => $user->getUserName(),
        'localidad' => $user->getLocalidad(),
        'provincia' => $user->getProvincia(),
        'telefono' => $user->getTelefono(),
        'descripcion' => $user->getDescripcion(),
        'montoCompraMensual' => $montoCompras,
        'videosDestacados' => count($repoDestacVedor->findBy(array('idVedor' => $user->getId()))),
        'videosDescartados' => count($repoDescartVedor->findBy(array('idVedor' => $user->getId()))),
        'videosAdquiridos' => count($repoCompraVedor->findBy(array('idVedor' => $user->getId()))),
        'videosGuardados' => count($repoGuardaVedor->findBy(array('idVedor' => $user->getId()))),
      );

      return new JsonResponse([
        'userData' => $array,
        'message' => 'Datos del usuario vedor',
      ]);
    } else {

      $array = array(
        'roles' => $user->getRoles(),
        'idUser' =>  $user->getId(),
        'localidad' => $user->getLocalidad(),
        'provincia' => $user->getProvincia(),
        'nombreCompleto' => $user->getNombreCompleto(),
        'pathFotoPerfil' => !empty($user->getPathFotoPerfil()) ? $user->getPathFotoPerfil() : "Sin Foto",
        'email' => $user->getUserName(),
        'telefono' => $user->getTelefono(),
        'descripcion' => $user->getDescripcion(),
      );

      return new JsonResponse([
        'userData' => $array,
        'message' => 'Datos del Administrador',
      ]);
    }
  }
  /**
   * @Route("/api/listUsers", name="listUser", methods={"POST"})
   */
  public function listUsers(Request $request, ManagerRegistry $doctrine): JsonResponse
  {
    $post = $request->getContent();
    $params = json_decode($post);

    $calificacion = $params->calificacion;
    $nombre = $params->nombre;
    $currentPage = $params->page;
    $localidad = $params->localidad;
    $provincia = $params->provincia;

    $limit = 16;
    $oprtunidadQuery = $doctrine->getManager()->getRepository(User::class)->getAllUser($currentPage, $limit, $nombre, $calificacion, $localidad, $provincia);

    $maxPages = ceil($oprtunidadQuery['paginator']->count() / $limit);

    $tabla = $oprtunidadQuery['query']->getResult();

    $totalRegisters = count($oprtunidadQuery['paginator']);

    $array = array();
    $localidades = array();
    $provincias = array();

    for ($i = 0; $i < count($tabla); $i++) {
      $publicaciones = $tabla[$i][0]->getPublicaciones();

      $contadorVideosMonetizados = 0;
      $contadorVideosPublicos = 0;
      $contadorVideosEliminados = 0;
      $sumaMontoTotalPagado = 0;

      foreach ($publicaciones as $publi) {
        $collection = $publi->getEstadoPublicacion();
        $index = 0;
        while ($index < $collection->count()) {
          if ($collection[$index]->getId() == 1) {
            $contadorVideosMonetizados++;
            $sumaMontoTotalPagado = $sumaMontoTotalPagado + $publi->getPrecio();
          } elseif ($collection[$index]->getId() == 4) {
            $contadorVideosPublicos++;
          } elseif ($collection[$index]->getId() == 3) {
            $contadorVideosEliminados++;
          }
          $index++;
        }
      }

      if (count($localidades) > 0) {
        if (!in_array(array('nombre' => $tabla[$i][0]->getLocalidad()), $localidades)) {
          $localidad = array(
            'nombre' => $tabla[$i][0]->getLocalidad()
          );
          array_push($localidades, $localidad);
        }
      } else {
        $localidad = array(
          'nombre' => $tabla[$i][0]->getLocalidad()
        );
        array_push($localidades, $localidad);
      }

      if (count($provincias) > 0) {
        if (!in_array(array('nombre' => $tabla[$i][0]->getProvincia()), $provincias)) {
          $provincia = array(
            'nombre' => $tabla[$i][0]->getProvincia()
          );
          array_push($provincias, $provincia);
        }
      } else {
        $provincia = array(
          'nombre' => $tabla[$i][0]->getProvincia()
        );
        array_push($provincias, $provincia);
      }

      $contadorVideosCargados = count($publicaciones) - $contadorVideosEliminados;
      $d = array(
        'idUser' =>  $tabla[$i][0]->getId(),
        'roles' => $tabla[$i][0]->getRoles(),
        'montoTotalPagado' => $sumaMontoTotalPagado,
        'nombreCompleto' => $tabla[$i][0]->getNombreCompleto(),
        'email' => $tabla[$i][0]->getUserName(),
        'pathFotoPerfil' => !empty($tabla[$i][0]->getPathFotoPerfil()) ? $tabla[$i][0]->getPathFotoPerfil() : "Sin Foto",
        'telefono' => $tabla[$i][0]->getTelefono(),
        'localidad' => $tabla[$i][0]->getLocalidad(),
        'provincia' => $tabla[$i][0]->getProvincia(),
        'descripcion' => $tabla[$i][0]->getDescripcion(),
        'calificacion' => floatval($tabla[$i]['promedioCalificacion']),
        'fechaRegistro' => $tabla[$i][0]->getDateCreate(),
        'videosCargados' => $contadorVideosCargados,
        'videosMonetizados' =>  $contadorVideosMonetizados,
        'videosNoMonetizados' => count($publicaciones) - $contadorVideosMonetizados,
        'videosEliminados' => $contadorVideosEliminados,
        'strikes' => $tabla[$i][0]->getStrikes(),
        'banneado' => $tabla[$i][0]->isBanneado()
      );
      array_push($array, $d);
    }
    return new JsonResponse([
      'data' => count($array) > 0 ? $array : null,
      'localidades' => $localidades,
      'provincias' => $provincias,
      'maxPages' => $maxPages,
      'totalRegister' => $totalRegisters,
      'calificacion' => empty($calificacion) ? "" : $params->calificacion
    ]);
  }

  /**
   * @Route("/api/editarPerfil", name="editarPerfil", methods={"POST"})
   */
  public function editarPerfil(Request $request, ManagerRegistry $doctrine): JsonResponse
  {
    $user = $this->getUser();

    $params = json_decode($request->getContent());

    $nombre = $params->nombreCompleto;
    $telefono = $params->telefono;
    $descripcion = $params->descripcion;
    $pathFotoPerfil = $params->pathFotoPerfil;

    if (!empty($nombre)) {
      $user->setNombreCompleto($nombre);
    }
    if (!empty($telefono)) {
      $user->setTelefono($telefono);
    }
    if (!empty($descripcion)) {
      $user->setDescripcion($descripcion);
    }
    if (!empty($pathFotoPerfil)) {
      $user->setPathFotoPerfil($pathFotoPerfil);
    }
    $entityManager = $doctrine->getManager();
    $entityManager->persist($user);
    $entityManager->flush();

    return new JsonResponse([
      'message' => 'Usuario actualizado',
    ]);
  }

  /**
   * @Route("/api/listNombreUsers", name="listNombreUsers", methods={"GET"})
   */
  public function listNombreUsers(ManagerRegistry $doctrine): JsonResponse
  {
    $tabla = $doctrine->getManager()->getRepository(User::class)->getAllNombreUsers();
    $nombre = $tabla['query']->getResult();
    $array = array();
    foreach ($nombre as $n) {
      $tupla = array(
        "nombre" => $n['nombreCompleto'],
      );
      array_push($array, $tupla);
    }
    return $this->json([
      "data" => $array
    ]);
  }

  /**
   * @Route("/validarCodigoUser", name="validarCodigoUser", methods={"POST"})
   */
  public function validarCodigoUser(UserRepository $repoUser, Request $request, ManagerRegistry $doctrine, MailerInterface $mailer, CodigoUserRepository $userCodigoRepo): JsonResponse
  {
    $params = json_decode($request->getContent());
    $searchUser = $repoUser->findOneBy(array('username' => $params->email));
    $valor = $userCodigoRepo->findOneBy(array('idUSer' => $searchUser->getId()));

    if ($params->codigoMail == $valor->getNumero()) {
      $searchUser->setCodigo(true);
      $entityManager = $doctrine->getManager();
      $entityManager->remove($valor);
      $entityManager->persist($searchUser);
      $entityManager->flush();
    } else {
      return $this->json([
        'mensaje' => 'Codigo Incorrecto',
      ], JsonResponse::HTTP_CONFLICT);
    }

    $message = (new Email())
      ->from('info@enoff.com.ar')
      ->to($params->email)
      ->subject('ENOFF - Mensaje de bienvenida')
      ->html('
              <!DOCTYPE html>
        <html
          xmlns="http://www.w3.org/1999/xhtml"
          xmlns:v="urn:schemas-microsoft-com:vml"
          xmlns:o="urn:schemas-microsoft-com:office:office"
        >
          <head>
            <title>[[data:bienvenida-enoff:""]]</title>
            <!--[if !mso]><!-->
            <meta http-equiv="X-UA-Compatible" content="IE=edge" />
            <!--<![endif]-->
            <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
            <meta name="viewport" content="width=device-width,initial-scale=1" />
            <style type="text/css">
              #outlook a {
                padding: 0;
              }
              body {
                margin: 0;
                padding: 0;
                -webkit-text-size-adjust: 100%;
                -ms-text-size-adjust: 100%;
              }
              table,
              td {
                border-collapse: collapse;
                mso-table-lspace: 0pt;
                mso-table-rspace: 0pt;
              }
              img {
                border: 0;
                height: auto;
                line-height: 100%;
                outline: none;
                text-decoration: none;
                -ms-interpolation-mode: bicubic;
              }
              p {
                display: block;
                margin: 13px 0;
              }
            </style>
            <!--[if mso]>
              <noscript>
                <xml>
                  <o:OfficeDocumentSettings>
                    <o:AllowPNG />
                    <o:PixelsPerInch>96</o:PixelsPerInch>
                  </o:OfficeDocumentSettings>
                </xml>
              </noscript>
            <![endif]-->
            <!--[if lte mso 11]>
              <style type="text/css">
                .mj-outlook-group-fix {
                  width: 100% !important;
                }
              </style>
            <![endif]-->
            <!--[if !mso]><!-->
            <link
              href="https://fonts.googleapis.com/css?family=Ubuntu:300,400,500,700"
              rel="stylesheet"
              type="text/css"
            />
            <link
              href="https://fonts.googleapis.com/css?family=Source+Code+Pro"
              rel="stylesheet"
              type="text/css"
            />
            <link
              href="https://fonts.googleapis.com/css?family=Source+Code+Pro"
              rel="stylesheet"
              type="text/css"
            />
            <style type="text/css">
              @import url(https://fonts.googleapis.com/css?family=Ubuntu:300,400,500,700);
              @import url(https://fonts.googleapis.com/css?family=Source+Code+Pro);
              @import url(https://fonts.googleapis.com/css?family=Source+Code+Pro);
            </style>
            <!--<![endif]-->
            <style type="text/css">
              @media only screen and (min-width: 480px) {
                .mj-column-per-100 {
                  width: 100% !important;
                  max-width: 100%;
                }
              }
            </style>
            <style media="screen and (min-width:480px)">
              .moz-text-html .mj-column-per-100 {
                width: 100% !important;
                max-width: 100%;
              }
            </style>
            <style type="text/css">
              [owa] .mj-column-per-100 {
                width: 100% !important;
                max-width: 100%;
              }
            </style>
            <style type="text/css"></style>
          </head>
          <body style="word-spacing: normal; background-color: #f4f4f4">
            <div style="background-color: #f4f4f4">
              <table
                align="center"
                background="https://06psq.mjt.lu/tplimg/06psq/b/lz5zz/g6yt3.jpeg"
                border="0"
                cellpadding="0"
                cellspacing="0"
                role="presentation"
                style="
                  background: #ffffff
                    url("https://06psq.mjt.lu/tplimg/06psq/b/lz5zz/g6yt3.jpeg") center
                    top / auto no-repeat;
                  background-position: center top;
                  background-repeat: no-repeat;
                  background-size: contain;
                  width: 100%;
                "
              >
                <tbody>
                  <tr>
                    <td>
                      <!--[if mso | IE]><v:rect style="mso-width-percent:1000;" xmlns:v="urn:schemas-microsoft-com:vml" fill="true" stroke="false"><v:fill origin="0.5, 0" position="0.5, 0" src="https://06psq.mjt.lu/tplimg/06psq/b/lz5zz/g6yt3.jpeg" color="#ffffff" type="tile" /><v:textbox style="mso-fit-shape-to-text:true" inset="0,0,0,0"><table align="center" border="0" cellpadding="0" cellspacing="0" class="" role="presentation" style="width:600px;" width="600" bgcolor="#ffffff" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
                      <div style="margin: 0px auto; max-width: 600px">
                        <div style="line-height: 0; font-size: 0">
                          <table
                            align="center"
                            border="0"
                            cellpadding="0"
                            cellspacing="0"
                            role="presentation"
                            style="width: 100%"
                          >
                            <tbody>
                              <tr>
                                <td
                                  style="
                                    direction: ltr;
                                    font-size: 0px;
                                    padding: 20px 50px 20px 50px;
                                    padding-left: 50px;
                                    padding-right: 50px;
                                    text-align: center;
                                  "
                                >
                                  <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:500px;" ><![endif]-->
                                  <div
                                    class="mj-column-per-100 mj-outlook-group-fix"
                                    style="
                                      font-size: 0px;
                                      text-align: left;
                                      direction: ltr;
                                      display: inline-block;
                                      vertical-align: top;
                                      width: 100%;
                                    "
                                  >
                                    <table
                                      border="0"
                                      cellpadding="0"
                                      cellspacing="0"
                                      role="presentation"
                                      style="vertical-align: top"
                                      width="100%"
                                    >
                                      <tbody>
                                        <tr>
                                          <td
                                            style="
                                              font-size: 0px;
                                              word-break: break-word;
                                            "
                                          >
                                            <div
                                              style="height: 529px; line-height: 529px"
                                            >
                                              &#8202;
                                            </div>
                                          </td>
                                        </tr>
                                        <tr>
                                          <td
                                            style="
                                              font-size: 0px;
                                              word-break: break-word;
                                            "
                                          >
                                            <div
                                              style="height: 17px; line-height: 17px"
                                            >
                                              &#8202;
                                            </div>
                                          </td>
                                        </tr>
                                        <tr>
                                          <td
                                            align="left"
                                            style="
                                              font-size: 0px;
                                              padding: 0px 7px 0px 7px;
                                              padding-top: 0px;
                                              padding-right: 7px;
                                              padding-bottom: 0px;
                                              padding-left: 7px;
                                              word-break: break-word;
                                            "
                                          >
                                            <div
                                              style="
                                                font-family: Ubuntu, Helvetica, Arial,
                                                  sans-serif;
                                                font-size: 20px;
                                                letter-spacing: normal;
                                                line-height: 1;
                                                text-align: left;
                                                color: #000000;
                                              "
                                            >
                                              <p
                                                class="text-build-content"
                                                style="
                                                  text-align: center;
                                                  margin: 10px 0;
                                                  margin-top: 10px;
                                                "
                                                data-testid="KeNAxYg29"
                                              >
                                                <span
                                                  style="
                                                    color: #b1e5f7;
                                                    font-family: Source Code Pro, Arial,
                                                      Helvetica, sans-serif;
                                                    font-size: 20px;
                                                  "
                                                  >Bienvenidos al "mejor oficio del
                                                  mundo"!</span
                                                >
                                              </p>
                                              <p
                                                class="text-build-content"
                                                style="
                                                  text-align: center;
                                                  margin: 10px 0;
                                                "
                                                data-testid="KeNAxYg29"
                                              >
                                                &nbsp;
                                              </p>
                                              <p
                                                class="text-build-content"
                                                style="
                                                  text-align: center;
                                                  margin: 10px 0;
                                                  margin-bottom: 10px;
                                                "
                                                data-testid="KeNAxYg29"
                                              >
                                                &nbsp;
                                              </p>
                                            </div>
                                          </td>
                                        </tr>
                                        <tr>
                                          <td
                                            align="left"
                                            style="
                                              font-size: 0px;
                                              padding: 10px 25px;
                                              padding-top: 0px;
                                              padding-bottom: 0px;
                                              word-break: break-word;
                                            "
                                          >
                                            <div
                                              style="
                                                font-family: Ubuntu, Helvetica, Arial,
                                                  sans-serif;
                                                font-size: 20px;
                                                letter-spacing: normal;
                                                line-height: 1;
                                                text-align: left;
                                                color: #000000;
                                              "
                                            >
                                              <p
                                                class="text-build-content"
                                                style="
                                                  text-align: center;
                                                  margin: 10px 0;
                                                  margin-top: 10px;
                                                "
                                                data-testid="GWonMS6_I"
                                              >
                                                <span
                                                  style="
                                                    color: #b1e5f7;
                                                    font-family: Source Code Pro, Arial,
                                                      Helvetica, sans-serif;
                                                    font-size: 20px;
                                                  "
                                                  >¡Ya estás listo para comunicar,
                                                  hacelo con responsabilidad!</span
                                                ><span
                                                  style="
                                                    color: #56585d;
                                                    font-family: Arial, Helvetica,
                                                      sans-serif;
                                                    font-size: 13px;
                                                  "
                                                ></span>
                                              </p>
                                              <p
                                                class="text-build-content"
                                                data-testid="GWonMS6_I"
                                                style="margin: 10px 0"
                                              >
                                                <span
                                                  style="
                                                    color: #56585d;
                                                    font-family: Arial, Helvetica,
                                                      sans-serif;
                                                    font-size: 13px;
                                                  "
                                                ></span>
                                              </p>
                                              <p
                                                class="text-build-content"
                                                data-testid="GWonMS6_I"
                                                style="margin: 10px 0"
                                              >
                                                <span
                                                  style="
                                                    color: #56585d;
                                                    font-family: Arial, Helvetica,
                                                      sans-serif;
                                                    font-size: 13px;
                                                  "
                                                  > </span
                                                ><span
                                                  style="
                                                    color: #55575d;
                                                    font-family: Arial, Helvetica,
                                                      sans-serif;
                                                    font-size: 13px;
                                                  "
                                                ></span>
                                              </p>
                                              <p
                                                class="text-build-content"
                                                data-testid="GWonMS6_I"
                                                style="
                                                  margin: 10px 0;
                                                  margin-bottom: 10px;
                                                "
                                              >
                                                <span
                                                  style="
                                                    color: #55575d;
                                                    font-family: Arial, Helvetica,
                                                      sans-serif;
                                                    font-size: 13px;
                                                  "
                                                  > </span
                                                >
                                              </p>
                                            </div>
                                          </td>
                                        </tr>
                                        <tr>
                                          <td
                                            style="
                                              font-size: 0px;
                                              word-break: break-word;
                                            "
                                          >
                                            <div
                                              style="height: 70px; line-height: 70px"
                                            >
                                              &#8202;
                                            </div>
                                          </td>
                                        </tr>
                                        <tr>
                                          <td
                                            style="
                                              font-size: 0px;
                                              word-break: break-word;
                                            "
                                          >
                                            <div
                                              style="height: 35px; line-height: 35px"
                                            >
                                              &#8202;
                                            </div>
                                          </td>
                                        </tr>
                                        <tr>
                                          <td
                                            style="
                                              font-size: 0px;
                                              word-break: break-word;
                                            "
                                          >
                                            <div
                                              style="height: 277px; line-height: 277px"
                                            >
                                              &#8202;
                                            </div>
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </div>
                                  <!--[if mso | IE]></td></tr></table><![endif]-->
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                      <!--[if mso | IE]></td></tr></table></v:textbox></v:rect><![endif]-->
                    </td>
                  </tr>
                </tbody>
              </table>
              <!--[if mso | IE]><table align="center" border="0" cellpadding="0" cellspacing="0" class="" role="presentation" style="width:600px;" width="600" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
              <div style="margin: 0px auto; max-width: 600px">
                <table
                  align="center"
                  border="0"
                  cellpadding="0"
                  cellspacing="0"
                  role="presentation"
                  style="width: 100%"
                >
                  <tbody>
                    <tr>
                      <td
                        style="
                          direction: ltr;
                          font-size: 0px;
                          padding: 20px 0px 20px 0px;
                          text-align: center;
                        "
                      >
                        <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:600px;" ><![endif]-->
                        <div
                          class="mj-column-per-100 mj-outlook-group-fix"
                          style="
                            font-size: 0px;
                            text-align: left;
                            direction: ltr;
                            display: inline-block;
                            vertical-align: top;
                            width: 100%;
                          "
                        >
                          <table
                            border="0"
                            cellpadding="0"
                            cellspacing="0"
                            role="presentation"
                            width="100%"
                          >
                            <tbody>
                              <tr>
                                <td style="vertical-align: top; padding: 0">
                                  <table
                                    border="0"
                                    cellpadding="0"
                                    cellspacing="0"
                                    role="presentation"
                                    width="100%"
                                  >
                                    <tbody>
                                      <tr>
                                        <td
                                          align="center"
                                          style="
                                            font-size: 0px;
                                            padding: 10px 25px;
                                            word-break: break-word;
                                          "
                                        >
                                          <div
                                            style="
                                              font-family: Ubuntu, Helvetica, Arial,
                                                sans-serif;
                                              font-size: 11px;
                                              line-height: 22px;
                                              text-align: center;
                                              color: #000000;
                                            "
                                          >
                                            <p style="margin: 10px 0">
                                              This e-mail has been sent to [[EMAIL_TO]],
                                              <a
                                                href="[[UNSUB_LINK_EN]]"
                                                style="
                                                  color: inherit;
                                                  text-decoration: none;
                                                "
                                                target="_blank"
                                                >click here to unsubscribe</a
                                              >.
                                            </p>
                                          </div>
                                        </td>
                                      </tr>
                                      <tr>
                                        <td
                                          align="center"
                                          style="
                                            font-size: 0px;
                                            padding: 10px 25px;
                                            word-break: break-word;
                                          "
                                        >
                                          <div
                                            style="
                                              font-family: Ubuntu, Helvetica, Arial,
                                                sans-serif;
                                              font-size: 11px;
                                              line-height: 22px;
                                              text-align: center;
                                              color: #000000;
                                            "
                                          >
                                            <p style="margin: 10px 0">AR</p>
                                          </div>
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        <!--[if mso | IE]></td></tr></table><![endif]-->
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <!--[if mso | IE]></td></tr></table><![endif]-->
            </div>
          </body>
        </html>
      ');
    $mailer->send($message);

    return $this->json([
      'mensaje' => 'Codigo Correcto',
    ]);
  }
}
