<?php

namespace App\Entity;

use App\Repository\VedorPeriodistaRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: VedorPeriodistaRepository::class)]
class VedorPeriodista
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column]
    private ?int $idPeriodista = null;

    #[ORM\Column]
    private ?int $idVedor = null;

    #[ORM\Column]
    private ?int $idCategoria = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getIdPeriodista(): ?int
    {
        return $this->idPeriodista;
    }

    public function setIdPeriodista(int $idPeriodista): self
    {
        $this->idPeriodista = $idPeriodista;

        return $this;
    }

    public function getIdVedor(): ?int
    {
        return $this->idVedor;
    }

    public function setIdVedor(int $idVedor): self
    {
        $this->idVedor = $idVedor;

        return $this;
    }

    public function getIdCategoria(): ?int
    {
        return $this->idCategoria;
    }

    public function setIdCategoria(int $idCategoria): self
    {
        $this->idCategoria = $idCategoria;

        return $this;
    }
}
