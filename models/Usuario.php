<?php
    namespace Model;

    class Usuario extends ActiveRecord{
        //Base de datos
        protected static $tabla= 'usuarios';
        protected static $columnasDB = ['id', 'nombre', 'apellido', 'email', 'password', 'telefono', 'admin', 'confirmado', 'token'];

        public $id;
        public $nombre;
        public $apellido;
        public $email;
        public $password;
        public $telefono;
        public $admin;
        public $confirmado;
        public $token;

        public function __construct($arg= []){
           $this->id = $arg['id'] ?? null;
           $this->nombre = $arg['nombre'] ??'';
           $this->apellido = $arg['apellido'] ?? '';
           $this->email = $arg['email'] ?? '';
           $this-> password = $arg['password'] ?? '';
           $this->telefono =  $arg['telefono'] ?? '';
           $this-> admin = $arg['admin'] ?? '0';
           $this-> confirmado = $arg['confirmado'] ?? '0';
           $this-> token =$arg['token'] ?? '';

         }

         //mensaje de validación para la creación de una cuenta
         public function validarNuevaCuenta(){
            if(!$this->nombre){
                self::$alertas ['error'][] ='El Nombre del cliente es obligatorio';
            }

            if(!$this->apellido){
                self::$alertas ['error'][] ='El Apellido del cliente es obligatorio';
            }

            if(!$this->email){
                self::$alertas ['error'][] ='El Email del cliente es obligatorio';
            }

            if(!$this->password){
                self::$alertas ['error'][] ='El Password del cliente es obligatorio';
            }

            if (strlen($this->password) < 6){
                self::$alertas['error'][]='El Password debe contener al menos 6 caracteres';
            }

            return self::$alertas;
         }

         public function validarLogin(){
            if(!$this->email){
                self::$alertas['error'][]= 'El email es obligatorio';
            }

            if(!$this->password){
                self::$alertas['error'][]= 'El password es obligatorio';
            }
            return self::$alertas;

         }

         public function validarEmail(){
            if(!$this->email){
                self::$alertas['error'][]= 'El email es obligatorio';
            } 
            return self::$alertas;
         }

         public function validarPassword(){
            if(!$this->password){
                self::$alertas['error'][]='El Password es obligatorio';
            }

            if (strlen($this->password) < 6){
                self::$alertas['error'][] = 'El password debe tener al menos 6 caracteres';
            }
            return self::$alertas;

         }

         public function exiteUsuario(){
           
            $query= " SELECT * FROM " . self::$tabla . " WHERE email = '" . $this->email . "' LIMIT 1";
           
            $resultado= self::$db->query($query);
            
            if ($resultado->num_rows){
                self::$alertas['error'] []='El usuario ya esta registrado';
            }

            return $resultado;

         }

         public function hashPassword() {
            $this->password = password_hash($this->password, PASSWORD_BCRYPT);

         }

         public function crearToken() { 
            $this->token= uniqid();
         }

         public function comprobarPasswordAndVerificado($password){
            $resultado = password_verify($password, $this->password);
            
            if (!$resultado || !$this->confirmado) {
                self::$alertas['error'][]= 'Password Incorrecto o tu cuenta no ha sido confirmada';
            }else {
                return true;
            }
         }

    }   