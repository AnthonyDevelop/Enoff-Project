<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use App\Entity\MercadoPago;
use App\Entity\Notificacion;
use App\Repository\EstadoNotificacionRepository;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Contracts\HttpClient\HttpClientInterface;
use Symfony\Component\HttpFoundation\Request;

class MercadoPagoCredencialesController extends AbstractController
{
    /**
     * @Route("/api/mercadoPago/credencials/add", name="app_mercado_libre_credencials_add",  methods={"POST"})
     */
    public function add(Request $request, HttpClientInterface $client, ManagerRegistry $doctrine, EstadoNotificacionRepository $repoEstados): JsonResponse
    {
        date_default_timezone_set('America/Argentina/Buenos_Aires');
        $zonahoraria = date_default_timezone_get();

        $date_fecha = new \DateTime(date("Y-m-d H:i:s"), new \DateTimeZone('America/Argentina/Buenos_Aires'));

        $params = json_decode($request->getContent());
        $codigo = $params->code;
        $user = $this->getUser();

        $response = $client->request(
            'POST',
            'https://api.mercadopago.com/oauth/token',
            [
                'json' => [
                    'grant_type' => 'authorization_code',
                    'client_id' => '3552619241756436',
                    'client_secret' => 'x06NPi9HEy5cbmqLgDH9hlQ3RB1qyRAD',
                    'code' => $codigo,
                    'redirect_uri' => 'https://enoff.com.ar/User/MercadoPago-validacion'
                ],
            ]
        );

        $statusCode = $response->getStatusCode();
        $content =  json_decode($response->getContent());

        $newMercadoPago = new MercadoPago();
        $newMercadoPago->setAccessToken($content->access_token);
        $newMercadoPago->setRefreshToken($content->refresh_token);
        $newMercadoPago->setExpiresIn($date_fecha);
        $newMercadoPago->setPublicKey($content->public_key);
        $user->addMercadoPago($newMercadoPago);

        $entityManager = $doctrine->getManager();
        $entityManager->persist($newMercadoPago);
        $entityManager->persist($user);

        $message = 'Su cuenta de Mercado Pago se ha vinculado correctamente';

        $response = $client->request(
            'POST',
            $_SERVER['DOMAIN_SOCKET_IO'].'/client/notificaciones',
            [
                'json' => [
                    'contenido' => $message,
                    'estado' => 1,
                    'user_id' => $user->getId()
                ],
            ]
        );

        $notificacion = new Notificacion;
        $notificacion->setEstado($repoEstados->find(1));
        $notificacion->setContenido($message);
        $notificacion->setIdUser($user);
        $notificacion->setDateCreate($date_fecha);

        $entityManager->persist($notificacion);
        $entityManager->flush();

        return $this->json([
            'statusCode' => $statusCode,
            'message' => "Credencials add successfull",
        ]);
    }

    /**
     * @Route("/api/mercadoPago/credencials/delete", name="app_mercado_pago_credencials_del",  methods={"GET"})
     */
    public function delete(ManagerRegistry $doctrine,HttpClientInterface $client, EstadoNotificacionRepository $repoEstados): JsonResponse
    {
        date_default_timezone_set('America/Argentina/Buenos_Aires');
        $zonahoraria = date_default_timezone_get();
        $entityManager = $doctrine->getManager();
        $user = $this->getUser();
        $credenciales = $user->getMercadoPago()[0];
        $user->removeMercadoPago($credenciales);
        $entityManager->persist($user);
        $entityManager->remove($credenciales);
        $date_fecha = new \DateTime(date("Y-m-d H:i:s"), new \DateTimeZone('America/Argentina/Buenos_Aires'));

        $message = "Su cuenta de Mercado Pago se ha desvinculado correctamente ";

        $response = $client->request(
            'POST',
            $_SERVER['DOMAIN_SOCKET_IO'].'/client/notificaciones',
            [
                'json' => [
                    'contenido' => $message,
                    'estado' => 1,
                    'user_id' => $user->getId()
                ],
            ]
        );
        
        $notificacion = new Notificacion;
        $notificacion->setEstado($repoEstados->find(1));
        $notificacion->setContenido($message);
        $notificacion->setIdUser($user);
        $notificacion->setDateCreate($date_fecha);
        $entityManager->persist($notificacion);

        $entityManager->flush();

        return $this->json([
            'message' => 'Credencials delete succesfull',
        ]);
    }

    /**
     * @Route("/api/mercadopago/client/information", name="app_mercado_pago_client_information",  methods={"GET"})
     */
    public function clientInformation(HttpClientInterface $client, ManagerRegistry $doctrine): JsonResponse
    {
        if ($this->getUser()->getRoles()[0] == 'ROLE_USER' && !empty($this->getUser()->getMercadoPago()[0])) {
            $accessToken = $this->getUser()->getMercadoPago()[0]->getAccessToken();
            $response = $client->request(
                'GET',
                'https://api.mercadopago.com/users/me',
                [
                    'headers' => [
                        'Authorization' => 'Bearer ' . $accessToken,
                        'content-type' => 'application/x-www-form-urlencoded',
                        'accept' => 'application/json'
                    ]
                ]
            );

            $content =  json_decode($response->getContent());

            $array = array(
                'nombre_usuario_mp' => $content->nickname,
                'nombre_completo_mp' => $content->first_name . ' ' . $content->last_name,
                'email_mp' => $content->email,
                'phone_mp' => $content->phone->area_code . $content->phone->number,
                'type_document_mp' => $content->identification->type,
                'number_document_mp' => $content->identification->number
            );
            return $this->json([
                'message' => "Informacion de cuenta de Mercado Pago",
                'data' => $array
            ]);
        }
        return $this->json([
            'message' => "Este usuario no tiene acceso o no tiene credenciales",
        ]);
    }
}
