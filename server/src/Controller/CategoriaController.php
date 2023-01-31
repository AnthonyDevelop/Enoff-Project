<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use App\Repository\CategoriaPublicacionRepository;
use App\Entity\CategoriaPublicacion;
use App\Repository\VedorPeriodistaRepository;
use Symfony\Component\HttpFoundation\Request;
use Doctrine\Persistence\ManagerRegistry;

class CategoriaController extends AbstractController
{
    /**
     * @Route("/api/addCategoria", name="addCategoria",  methods={"POST"})
     */
    public function addCategoria( Request $request, ManagerRegistry $doctrine): JsonResponse
    {
        $params = json_decode($request->getContent());

        $newCategoria = new CategoriaPublicacion();
        $newCategoria->setNombrecategoria($params->categoria);
        
        $entityManager = $doctrine->getManager();
        $entityManager->persist($newCategoria);
        $entityManager->flush();
      
        return $this->json([
            'message' => 'Categoria Add',
        ]);
    }

    /**
     * @Route("/api/listCategoria", name="listCategoria",  methods={"GET"})
     */
    public function listCategorias(CategoriaPublicacionRepository $repoCate): JsonResponse
    {

        $array = array();
        foreach($repoCate->findAll() as $cate){
            $tupla = array(
                'id' => $cate->getId(),
                'nombre' => $cate->getNombreCategoria()
            );
            array_push($array,$tupla);
        }
        return $this->json([
            'data' => $array, 
            'message' => 'list categorias'
        ]);
    }

    /**
     * @Route("/api/deleteCategoria/{id}", name="deleteCategoria",  methods={"GET"})
     */
    public function deleteCategorias(CategoriaPublicacionRepository $repoCate, $id, ManagerRegistry $doctrine, VedorPeriodistaRepository $repoVedorPeriodista): JsonResponse
    {    
        if($this->getUser()->getRoles()[0] == 'ROLE_ADMIN'){
            if(empty($repoCate->find($id)->getPublicacions())){
                $entityManager = $doctrine->getManager();
                foreach($repoVedorPeriodista->findBy(array('idCategoria' => $id)) as $index){
                    $entityManager->remove($index);
                    $entityManager->flush();
                }
                $entityManager->remove($repoCate->find($id));
                $entityManager->flush();
                return $this->json([
                    'message' => 'Categoria borrada correctamente',
                ]);
            }
            return $this->json([
                'message' => 'Error - Existen publicaciones asignadas a esta categoria',
            ]);
        }
        return $this->json([
            'message' => 'No esta autorizado a realizar esta accion',
        ]);
    }

}
