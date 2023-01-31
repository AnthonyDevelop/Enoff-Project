<?php

namespace App\Controller;

use App\Repository\ResetContraseniaRepository;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Annotation\Route;

class ReestablecerContraseniaController extends AbstractController
{
    /**
     * @Route("/recuperarContrasena", name="recuperarContrasena", methods={"POST"})
     */
    public function recuperarContrasena(Request $request, ResetContraseniaRepository $repoResetContrasena, UserRepository $userRepo, UserPasswordHasherInterface $userPasswordHasher, EntityManagerInterface $entityManager): JsonResponse
    {
        date_default_timezone_set('America/Argentina/Buenos_Aires');
        $params = json_decode($request->getContent());
        $date_fecha = new \DateTime(date("Y-m-d H:i:s"), new \DateTimeZone('America/Argentina/Buenos_Aires'));
        
        $searchProcessRecovery = $repoResetContrasena->findOneBy(array('hash' => $params->hash));

        if ($date_fecha <= $searchProcessRecovery->getExpiracion()) {
            $user = $userRepo->findOneBy(array('username' => $searchProcessRecovery->getEmail()));
            $hashedPassword = $userPasswordHasher->hashPassword($user, $params->password);

            $user->setPassword($hashedPassword);
            $searchProcessRecovery->setStatus('Approved');
            $entityManager->persist($searchProcessRecovery);
            $entityManager->persist($user);
            $entityManager->flush();
        } else {
            return new JsonResponse([
                'mensaje' => 'El tiempo de cambio de contraseña ha caducado, por favor, reintente el proceso de recuperación',
            ], JsonResponse::HTTP_CONFLICT);
        }

        return new JsonResponse([
            'mensaje' => 'Recuperación de contraseña realizada correctamente',
        ], JsonResponse::HTTP_OK);
    }

}
