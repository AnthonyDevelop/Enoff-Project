<?php

namespace App\Controller;

use App\Entity\Comentario;
use App\Repository\PublicacionRepository;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;
class ComentarioController extends AbstractController
{
    /**
    * @Route("/api/addComentario", name="addComentario",  methods={"POST"})
    */
    public function addComentario(Request $request, PublicacionRepository $repoPubli, ManagerRegistry $doctrine): JsonResponse
    {
        if($this->getUser()->getRoles()[0] == 'ROLE_VEDOR'){
            date_default_timezone_set('America/Argentina/Buenos_Aires');
            $zonahoraria = date_default_timezone_get();
            
            $date_fecha = new \DateTime(date("Y-m-d H:i:s"), new \DateTimeZone('America/Argentina/Buenos_Aires'));
            
            $params = json_decode($request->getContent());
            $new = new Comentario();
            $new->setPublicacion($repoPubli->find($params->idPublicacion));
            $new->setContenido($params->descripcion);
            $new->setDateCreate($date_fecha);
            $new->setIdVedor($this->getUser());
            $entityManager = $doctrine->getManager();
            $entityManager->persist($new);
            $entityManager->flush();
            return new JsonResponse([            
                'message' => 'Comentario agregado correctamente'
            ]);
        }
        return new JsonResponse([            
            'message' => 'No esta autorizado a realizar esta accion'
        ]);
    }

}
