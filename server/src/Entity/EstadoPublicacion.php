<?php

namespace App\Entity;

use App\Repository\EstadoPublicacionRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: EstadoPublicacionRepository::class)]
class EstadoPublicacion
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 20)]
    private ?string $nombre = null;

    #[ORM\ManyToMany(targetEntity: Publicacion::class, mappedBy: 'estadoPublicacion')]
    private Collection $publicacions;

    public function __construct()
    {
        $this->publicacions = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getNombre(): ?string
    {
        return $this->nombre;
    }

    public function setNombre(string $nombre): self
    {
        $this->nombre = $nombre;

        return $this;
    }

    /**
     * @return Collection<int, Publicacion>
     */
    public function getPublicacions(): Collection
    {
        return $this->publicacions;
    }

    public function addPublicacion(Publicacion $publicacion): self
    {
        if (!$this->publicacions->contains($publicacion)) {
            $this->publicacions->add($publicacion);
            $publicacion->addEstadoPublicacion($this);
        }

        return $this;
    }

    public function removePublicacion(Publicacion $publicacion): self
    {
        if ($this->publicacions->removeElement($publicacion)) {
            $publicacion->removeEstadoPublicacion($this);
        }

        return $this;
    }

}
