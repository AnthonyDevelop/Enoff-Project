<?php

namespace App\Entity;

use App\Repository\CategoriaPublicacionRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: CategoriaPublicacionRepository::class)]
class CategoriaPublicacion
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private $id;

    #[ORM\Column(type: 'string', length: 20)]
    private $nombreCategoria;

    #[ORM\OneToMany(mappedBy: 'categoria', targetEntity: Publicacion::class)]
    private Collection $publicacions;

    public function __construct()
    {
        $this->publicaciones = new ArrayCollection();
        $this->users = new ArrayCollection();
        $this->publicacions = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getNombreCategoria(): ?string
    {
        return $this->nombreCategoria;
    }

    public function setNombreCategoria(string $nombreCategoria): self
    {
        $this->nombreCategoria = $nombreCategoria;

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
            $publicacion->setCategoria($this);
        }

        return $this;
    }

    public function removePublicacion(Publicacion $publicacion): self
    {
        if ($this->publicacions->removeElement($publicacion)) {
            // set the owning side to null (unless already changed)
            if ($publicacion->getCategoria() === $this) {
                $publicacion->setCategoria(null);
            }
        }

        return $this;
    }

}
