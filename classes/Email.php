<?php

namespace Classes;
use PHPMailer\PHPMailer\PHPMailer;

class Email {

    public $email;
    public $nombre;
    public $token;

    public function __construct($email, $nombre, $token) {
        $this->email= $email;
        $this->nombre= $nombre;
        $this->token= $token;
    }

    public function enviarConfirmacion(){

        //crear el objeto de email
        $mail = new PHPMailer();
        $mail-> isSMTP();
        $mail->Host = $_ENV['EMAIL_HOST'];
        $mail->SMTPAuth = true;
        $mail->Port = $_ENV['EMAIL_PORT'];
        $mail->Username = $_ENV['EMAIL_USER'];
        $mail->Password = $_ENV['EMAIL_PASS'];
        $mail->SMTPSecure='tls';

        $mail->setFrom('cuentas@appsalon.com');
        $mail->addAddress('cuentas@appsalon.com','AppSalon.com');
        $mail->Subject = 'Confirma tu cuenta';

        $mail->isHTML(TRUE);
        $mail->CharSet = 'UTF-8';

        $contenido = "<html>";
        $contenido .= "<p><strong>Hola ". $this->nombre . "</strong> Has creado tu cuenta en AppSalon, solo debes confirmarla presionando el siguiente enlace </p>";
        $contenido .= "<p>Presiona aqui: <a href='" .  $_ENV['APP_URL']  . "/confirmar-cuenta?token=". $this->token ."'> Confirmar Cuenta </a> </p>";
        $contenido .= "<p> Si tu no solicitaste esta cuenta, puedes ignorar este mensaje</p>";
        $contenido .= "</html>";

        $mail->Body = $contenido;
        $mail->send();
    }

    public function enviarInstrucciones(){
                //crear el objeto de email
                $mail = new PHPMailer();
                $mail-> isSMTP();
                $mail->Host = 'sandbox.smtp.mailtrap.io';
                $mail->SMTPAuth = true;
                $mail->Port = 2525;
                $mail->Username = '50cf55ec84f889';
                $mail->Password = '6e893e23cf00c3';
                $mail->SMTPSecure='tls';
        
                $mail->setFrom('cuentas@appsalon.com');
                $mail->addAddress('cuentas@appsalon.com','AppSalon.com');
                $mail->Subject = 'Reestablece tu password';
        
                $mail->isHTML(TRUE);
                $mail->CharSet = 'UTF-8';
        
                $contenido = "<html>";
                $contenido .= "<p><strong>Hola ". $this->nombre . "</strong> Has solicitado reestablecer tu password, sigue el siguiente enlace para hacerlo. </p>";
                $contenido .= "<p>Presiona aqui: <a href='" .  $_ENV['APP_URL']  . "/recuperar?token=". $this->token ."'> Reestablecer Password </a> </p>";
                $contenido .= "<p> Si tu no solicitaste esta cuenta, puedes ignorar este mensaje</p>";
                $contenido .= "</html>";
        
                $mail->Body = $contenido;
                $mail->send();
    }
}