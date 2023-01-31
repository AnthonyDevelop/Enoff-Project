<?php

namespace App\Controller;

use App\Entity\Notificacion;
use App\Entity\ResetContrasenia;
use App\Repository\EstadoNotificacionRepository;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;
use Symfony\Contracts\HttpClient\HttpClientInterface;

class CorreosUserController extends AbstractController
{
    /**
     * @Route("/api/correoConsultasDeUsuario", name="enviarCorreoAyuda", methods={"POST"})
     */
    public function envioDeCorreoAyuda(Request $request, MailerInterface $mailer)
    {
        $params = json_decode($request->getContent());

        $message = (new Email())
            ->from('info@enoff.com.ar')
            ->to("sistemasdelsud@gmail.com")
            ->subject($params->tipoDeConsulta . ' del usuario periodista: ' . $this->getUser()->getNombreCompleto())
            ->html(
                '<p>Correo del usuario:' . $this->getUser()->getUserName() . '</p>' .
                    '<p>Mensaje:' . $params->mensaje . '</p>'
            );
        $mailer->send($message);

        return $this->json([
            'message' => 'Correo de ayuda enviado'
        ]);
    }

    /**
     * @Route("/correoResetContrasena", name="correoRecuperarContrasena", methods={"POST"})
     */
    public function correoRecuperarContrasena(Request $request, HttpClientInterface $client, EstadoNotificacionRepository $repoEstadoNoti, EntityManagerInterface $entityManager, UserRepository $userRepo, MailerInterface $mailer): JsonResponse
    {
        date_default_timezone_set('America/Argentina/Buenos_Aires');
        $zonahoraria = date_default_timezone_get();

        $params = json_decode($request->getContent());
        $email = $params->mail;
        $user = $userRepo->findOneBy(array('username' => $email));

        if (empty($user)) {
            return new JsonResponse([
                'message' => 'El email no pertenece a un usuario registrado',
            ], JsonResponse::HTTP_CONFLICT);
        }
        
        if(!$user->isCodigo()){
            return new JsonResponse([
                'message' => 'El usuario aun no se ha verificado',
            ], JsonResponse::HTTP_CONFLICT);
        }

        $date_fecha = new \DateTime(date("Y-m-d H:i:s"), new \DateTimeZone('America/Argentina/Buenos_Aires'));
        $date_fecha->modify('+10 minute');
        $hash = rand(11111111, 99999999);

        $newReset = new ResetContrasenia();
        $newReset->setEmail($user->getUserName());
        $newReset->setExpiracion($date_fecha);
        $newReset->setHash($hash);
        $newReset->setStatus('Pendient');
        $entityManager->persist($newReset);
        $entityManager->flush();

        $message = (new Email())
            ->from('info@enoff.com.ar')
            ->to($user->getUserName())
            ->subject('Enoff - Recuperar contraseña')
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
                    <![endif]--><!--[if !mso]><!--><link href="https://fonts.googleapis.com/css?family=Ubuntu:300,400,500,700" rel="stylesheet" type="text/css"><link href="https://fonts.googleapis.com/css?family=Source+Code+Pro" rel="stylesheet" type="text/css"><link href="https://fonts.googleapis.com/css?family=Source+Code+Pro" rel="stylesheet" type="text/css"><link href="https://fonts.googleapis.com/css?family=Bungee+Shade" rel="stylesheet" type="text/css"><link href="https://fonts.googleapis.com/css?family=Bungee+Shade" rel="stylesheet" type="text/css"><style type="text/css">@import url(https://fonts.googleapis.com/css?family=Ubuntu:300,400,500,700);
                    @import url(https://fonts.googleapis.com/css?family=Source+Code+Pro);
                    @import url(https://fonts.googleapis.com/css?family=Source+Code+Pro);
                    @import url(https://fonts.googleapis.com/css?family=Bungee+Shade);
                    @import url(https://fonts.googleapis.com/css?family=Bungee+Shade);</style><!--<![endif]--><style type="text/css">@media only screen and (min-width:480px) {
                            .mj-column-per-100 { width:100% !important; max-width: 100%; }
                    }</style><style media="screen and (min-width:480px)">.moz-text-html .mj-column-per-100 { width:100% !important; max-width: 100%; }</style><style type="text/css">[owa] .mj-column-per-100 { width:100% !important; max-width: 100%; }</style><style type="text/css"></style></head><body style="word-spacing:normal;background-color:#F4F4F4;"><div style="background-color:#F4F4F4;"><!--[if mso | IE]><table align="center" border="0" cellpadding="0" cellspacing="0" class="" role="presentation" style="width:600px;" width="600" bgcolor="transparent" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><v:rect style="width:600px;" xmlns:v="urn:schemas-microsoft-com:vml" fill="true" stroke="false"><v:fill origin="0.5, 0" position="0.5, 0" src="https://06psq.mjt.lu/tplimg/06psq/b/lzo3u/ghwq0.jpeg" color="transparent" type="tile" /><v:textbox style="mso-fit-shape-to-text:true" inset="0,0,0,0"><![endif]--><div style="background:transparent url("https://06psq.mjt.lu/tplimg/06psq/b/lzo3u/ghwq0.jpeg") center top / auto no-repeat;background-position:center top;background-repeat:no-repeat;background-size:auto;margin:0px auto;max-width:600px;"><div style="line-height:0;font-size:0;"><table align="center" background="https://06psq.mjt.lu/tplimg/06psq/b/lzo3u/ghwq0.jpeg" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:transparent url("https://06psq.mjt.lu/tplimg/06psq/b/lzo3u/ghwq0.jpeg") center top / auto no-repeat;background-position:center top;background-repeat:no-repeat;background-size:auto;width:100%;"><tbody><tr><td style="direction:ltr;font-size:0px;padding:20px 50px 20px 50px;padding-left:50px;padding-right:50px;text-align:center;"><!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:500px;" ><![endif]--><div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;"><table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%"><tbody><tr><td style="font-size:0px;word-break:break-word;"><div style="height:361px;line-height:361px;">&#8202;</div></td></tr><tr><td align="left" style="font-size:0px;padding:10px 25px;padding-top:0px;padding-bottom:0px;word-break:break-word;"><div style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:30px;letter-spacing:normal;line-height:1;text-align:left;color:#000000;"><h1 class="text-build-content" style="text-align:center;; margin-top: 10px; margin-bottom: 10px; font-weight: normal;" data-testid="gdr7j8Sio"><span style="color:#B1E5F7;font-family:Arial, sans-serif;font-size:30px;"><b>¡Hola, ' . $user->getNombreCompleto() . '!</b></span></h1></div></td></tr><tr><td style="font-size:0px;word-break:break-word;"><div style="height:150px;line-height:150px;">&#8202;</div></td></tr><tr><td style="font-size:0px;word-break:break-word;"><div style="height:17px;line-height:17px;">&#8202;</div></td></tr><tr><td align="left" style="font-size:0px;padding:10px 25px;padding-top:0px;padding-bottom:0px;word-break:break-word;"><div style="font-family:Arial, sans-serif;font-size:25px;letter-spacing:normal;line-height:1;text-align:left;color:#000000;"><h2 class="text-build-content" style="text-align:center;; margin-top: 10px; margin-bottom: 10px; font-weight: normal;" data-testid="86uWQ7XV9"><span style="color:#B1E5F7;font-family:Arial, Helvetica, sans-serif;font-size:25px;"></span></h2></div></td></tr><tr><td style="font-size:0px;word-break:break-word;"><div style="height:44px;line-height:44px;">&#8202;</div></td></tr><tr><td align="left" style="font-size:0px;padding:10px 25px;padding-top:0px;padding-bottom:0px;word-break:break-word;"><div style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:70px;letter-spacing:normal;line-height:1;text-align:left;color:#000000;"><h1 class="text-build-content" style="text-align:center;; margin-top: 10px; margin-bottom: 10px; font-weight: normal;" data-testid="18bbjEvxC"><span style="color:#B1E5F7;font-family:Bungee Shade, Arial, Helvetica, sans-serif;font-size:70px;"><b></b></span></h1></div></td></tr><tr><td style="font-size:0px;word-break:break-word;"><div style="height:35px;line-height:35px;">&#8202;</div></td></tr><tr><td align="center" vertical-align="middle" style="font-size:0px;padding:10px 25px 10px 25px;padding-right:25px;padding-left:25px;word-break:break-word;"><table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:separate;line-height:100%;"><tbody><tr><td align="center" bgcolor="#da643a" role="presentation" style="border:none;border-radius:3px;cursor:auto;mso-padding-alt:10px 25px 10px 25px;background:#da643a;" valign="middle"><a href="http://localhost:3000/NuevaContrasena?hs=' . $hash . '" style="display:inline-block;background:#da643a;color:#ffffff;font-family:Arial, sans-serif;font-size:13px;font-weight:normal;line-height:120%;margin:0;text-decoration:none;text-transform:none;padding:10px 25px 10px 25px;mso-padding-alt:0px;border-radius:3px;" target="_blank"><span style="color:#B1E5F7;font-size:14px;">HACÉ CLIC ACÁ PARA RESTABLECER TU CONTRASEÑA</span></a></td></tr></tbody></table></td></tr><tr><td style="font-size:0px;word-break:break-word;"><div style="height:123px;line-height:123px;">&#8202;</div></td></tr><tr><td align="left" style="font-size:0px;padding:10px 25px;padding-top:0px;padding-bottom:0px;word-break:break-word;"><div style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:13px;letter-spacing:normal;line-height:1;text-align:left;color:#000000;"><p class="text-build-content" style="text-align: center; margin: 10px 0; margin-top: 10px;" data-testid="-YklkhX__"><span style="color:#B1E5F7;font-family:Source Code Pro, Arial, Helvetica, sans-serif;font-size:13px;"><b>Este link de recuperación es personal. &nbsp;No lo compartas con nadie, es exclusivo para vos.</b></span></p><p class="text-build-content" style="text-align: center; margin: 10px 0; margin-bottom: 10px;" data-testid="-YklkhX__"><span style="color:#B1E5F7;font-family:Source Code Pro, Arial, Helvetica, sans-serif;font-size:13px;"><b>Muchas gracias en nombre de todo el equipo de #EnOFF</b></span><span style="color:#55575d;font-family:Arial, Helvetica, sans-serif;font-size:13px;"></span></p></div></td></tr></tbody></table></div><!--[if mso | IE]></td></tr></table><![endif]--></td></tr></tbody></table></div></div><!--[if mso | IE]></v:textbox></v:rect></td></tr></table><table align="center" border="0" cellpadding="0" cellspacing="0" class="" role="presentation" style="width:600px;" width="600" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]--><div style="margin:0px auto;max-width:600px;"><table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;"><tbody><tr><td style="direction:ltr;font-size:0px;padding:20px 0px 20px 0px;text-align:center;"><!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:600px;" ><![endif]--><div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;"><table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%"><tbody><tr><td style="vertical-align:top;padding:0;"><table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%"><tbody><tr><td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;"><div style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:11px;line-height:22px;text-align:center;color:#000000;"><p style="margin: 10px 0;"><a href="[[UNSUB_LINK_EN]]" style="color:inherit;text-decoration:none;" target="_blank"></a>.</p></div></td></tr><tr><td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;"><div style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:11px;line-height:22px;text-align:center;color:#000000;"><p style="margin: 10px 0;"></p></div></td></tr></tbody></table></td></tr></tbody></table></div><!--[if mso | IE]></td></tr></table><![endif]--></td></tr></tbody></table></div><!--[if mso | IE]></td></tr></table><![endif]--></div></body></html>');
        $mailer->send($message);

        return $this->json([
            'message' => 'Link de recuperacion enviado',
        ]);
    }
}
