<?php

namespace Model;

class AdminCita extends ActiveRecord{
    protected static $tabla = 'citasservicios';
    protected static $columnasDB = ['id', 'hora', 'cliente', 'email', 'telefono', 'servicio', 'precio'];

    public $id;
    public $hora;
    public $cliente;
    public $email;
    public $telefono;
    public $servicio;
    public $precio;

    public function __construct()
    {
        $this->id= $args['id'] ?? null;
        $this->id= $args['hora'] ?? null;
        $this->id= $args['cliente'] ?? null;
        $this->id= $args['email'] ?? null;
        $this->id= $args['telefono'] ?? null;
        $this->id= $args['servicio'] ?? null;
        $this->id= $args['precio'] ?? null;
    }



}