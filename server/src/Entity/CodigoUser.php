<?php

namespace App\Entity;

use App\Repository\CodigoUserRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: CodigoUserRepository::class)]
class CodigoUser
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\OneToOne(cascade: ['persist', 'remove'])]
    private ?User $idUSer = null;

    #[ORM\Column(length: 6)]
    private ?string $numero = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getIdUSer(): ?User
    {
        return $this->idUSer;
    }

    public function setIdUSer(?User $idUSer): self
    {
        $this->idUSer = $idUSer;

        return $this;
    }

    public function getNumero(): ?string
    {
        return $this->numero;
    }

    public function setNumero(string $numero): self
    {
        $this->numero = $numero;

        return $this;
    }
}
