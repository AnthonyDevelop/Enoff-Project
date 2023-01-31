<?php

namespace App\Entity;

use App\Repository\EstadoNotificacionRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: EstadoNotificacionRepository::class)]
class EstadoNotificacion
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 20)]
    private ?string $nombre = null;

    #[ORM\OneToMany(mappedBy: 'estado', targetEntity: Notificacion::class)]
    private Collection $notificacions;

    public function __construct()
    {
        $this->notificacions = new ArrayCollection();
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
     * @return Collection<int, Notificacion>
     */
    public function getNotificacions(): Collection
    {
        return $this->notificacions;
    }

    public function addNotificacion(Notificacion $notificacion): self
    {
        if (!$this->notificacions->contains($notificacion)) {
            $this->notificacions->add($notificacion);
            $notificacion->setEstado($this);
        }

        return $this;
    }

    public function removeNotificacion(Notificacion $notificacion): self
    {
        if ($this->notificacions->removeElement($notificacion)) {
            // set the owning side to null (unless already changed)
            if ($notificacion->getEstado() === $this) {
                $notificacion->setEstado(null);
            }
        }

        return $this;
    }
}
