<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Lexik\Bundle\JWTAuthenticationBundle\Event\JWTDecodedEvent;
use Lexik\Bundle\JWTAuthenticationBundle\Event\JWTInvalidEvent;
use Lexik\Bundle\JWTAuthenticationBundle\Response\JWTAuthenticationFailureResponse;
use App\Repository\UserRepository;

class LoginController extends AbstractController
{
    
    /**
     * @var UserRepository
     */
    private $userRepository;

    /**
     * @param UserRepository $userRepository
     */
    public function __construct(UserRepository $userRepository)
    {
        $this->userRepository = $userRepository;
    }

    /**
     * @param JWTDecodedEvent $event
     *
     * @return void
     */

    public function onJWTDecoded(JWTDecodedEvent $event)
    {
        $payload = $event->getPayload();
        $user = $this->userRepository->findOneByUsername($payload['username']);

        if($user->isBanneado() || !$user->isCodigo()){
            $event->markAsInvalid();
        };
        $event->setPayload($payload);
    }
    /**
    * @param JWTInvalidEvent $event
    */

    public function onJWTInvalid(JWTInvalidEvent $event)
    {
        $response = new JWTAuthenticationFailureResponse('Access Denied', 403);

        $event->setResponse($response);
    }
}
