<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\HttpFoundation\Request;
use App\Repository\EstadoNotificacionRepository;
use App\Entity\Notificacion;


class NotificacionesController extends AbstractController
{
    /**
    * @Route("/api/switchNotificacion", name="switchNotificacion",  methods={"GET"})
    */
    public function switchNotificacion( ManagerRegistry $doctrine,EstadoNotificacionRepository $repoNoti): JsonResponse
    {
        $notis = $this->getUser()->getNotificacions();
        foreach($notis as $n){
            $n->setEstado($repoNoti->find(2));   
            $entityManager = $doctrine->getManager();
            $entityManager->persist($n);
            $entityManager->flush();
        }
        return $this->json([
            'message' => 'Estado de las notificaciones cambiadas a visto'
        ]);
    }

    /**
    * @Route("/api/listNotificacion", name="listNotificacion",  methods={"POST"})
    */
    public function listNotification( Request $request,ManagerRegistry $doctrine): JsonResponse
    {
        if($this->getUser()->getRoles()[0] == 'ROLE_USER' || $this->getUser()->getRoles()[0] == 'ROLE_VEDOR' || $this->getUser()->getRoles()[0] == 'ROLE_ADMIN'){
            $params = json_decode($request->getContent());
            
            $limit = 5;
            $result = $doctrine->getManager()->getRepository(Notificacion::class)->getAllNotificaciones($params->page, $params->iduser,$limit);

            $notificaciones = $result['query']->getResult();
            $totalRegisters = count($result['paginator']);
            $maxPages = ceil($result['paginator']->count() / $limit);  
            
            $array = array();
            foreach($notificaciones as $n){
                $tupla = array(
                    'id' => $n->getId(),
                    'contenido' => $n->getContenido(),
                    'fecha' => $n->getDateCreate(),
                    'estado' => $n->getEstado()->getNombre()
                );
                array_push($array,$tupla);
            }
            return $this->json([
                'data' => $array,
                'maxPages' => $maxPages,
                'totalRegisters' => $totalRegisters
            ]);
        }
        return $this->json([
            'message' => 'No tiene permisos para realizar esta accion',
        ]);
    }
}
