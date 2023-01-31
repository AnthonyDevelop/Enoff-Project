<?php

namespace App\Entity;

use App\Repository\UserPublicacionUrgenteRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: UserPublicacionUrgenteRepository::class)]
class UserPublicacionUrgente
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column]
    private ?int $idCreador = null;

    #[ORM\Column]
    private ?int $idPublicacion = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: true)]
    private ?\DateTimeInterface $dateCreate = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getIdCreador(): ?int
    {
        return $this->idCreador;
    }

    public function setIdCreador(int $idCreador): self
    {
        $this->idCreador = $idCreador;

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
