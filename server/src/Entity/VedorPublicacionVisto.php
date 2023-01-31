<?php

namespace App\Entity;

use App\Repository\VedorPublicacionVistoRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: VedorPublicacionVistoRepository::class)]
class VedorPublicacionVisto
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column]
    private ?int $idVedor = null;

    #[ORM\Column]
    private ?int $idPublicacion = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: true)]
    private ?\DateTimeInterface $dateCreate = null;

    public function getId(): ?int
    {
        return $this->id;
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

    public function getIdPublicacion(): ?int
    {
        return $this->idPublicacion;
    }

    public function setIdPublicacion(int $idPublicacion): self
    {
        $this->idPublicacion = $idPublicacion;

        return $this;
    }

    public function getDateCreate(): ?\DateTimeInterface
    {
        return $this->dateCreate;
    }

    public function setDateCreate(\DateTimeInterface $dateCreate): self
    {
        $this->dateCreate = $dateCreate;

        return $this;
    }
}
