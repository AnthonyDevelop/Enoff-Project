<?php

namespace App\Entity;

use App\Repository\PublicacionRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: PublicacionRepository::class)]
class Publicacion
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private $id;

    #[ORM\Column(type: 'string', length: 130)]
    private $titulo;

    #[ORM\Column(type: 'string', length: 600)]
    private $descripcion;

    #[ORM\Column(type: 'string', length: 60)]
    private $path;

    #[ORM\Column(type: 'datetime')]
    private $fechaPublicacion;

    #[ORM\ManyToMany(targetEntity: EstadoPublicacion::class, inversedBy: 'publicacions')]
    private Collection $estadoPublicacion;

    #[ORM\OneToMany(mappedBy: 'publicacion', targetEntity: Comentario::class,cascade: ['persist', 'remove'])]
    private Collection $comentarios;

    #[ORM\Column(nullable: true)]
    private ?int $calificacion = 0;

    #[ORM\ManyToOne(inversedBy: 'publicaciones')]
    private ?Localidad $localidad = null;

    #[ORM\ManyToOne(inversedBy: 'publicacions')]
    private ?Provincia $provincia = null;

    #[ORM\ManyToOne(inversedBy: 'publicaciones')]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $user = null;

    #[ORM\Column(nullable: true)]
    private ?int $precio = 0;

    #[ORM\ManyToOne(inversedBy: 'publicacions')]
    #[ORM\JoinColumn(nullable: false)]
    private ?CategoriaPublicacion $categoria = null;

    public function __construct()
    {
        $this->estadoPublicacion = new ArrayCollection();
        $this->comentarios = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTitulo(): ?string
    {
        return $this->titulo;
    }

    public function setTitulo(string $titulo): self
    {
        $this->titulo = $titulo;

        return $this;
    }

    public function getDescripcion(): ?string
    {
        return $this->descripcion;
    }

    public function setDescripcion(string $descripcion): self
    {
        $this->descripcion = $descripcion;

        return $this;
    }

    public function getPath(): ?string
    {
        return $this->path;
    }

    public function setPath(string $path): self
    {
        $this->path = $path;

        return $this;
    }

    public function getFechaPublicacion(): ?\DateTimeInterface
    {
        return $this->fechaPublicacion;
    }

    public function setFechaPublicacion(\DateTimeInterface $fechaPublicacion): self
    {
        $this->fechaPublicacion = $fechaPublicacion;

        return $this;
    }

    /**
     * @return Collection<int, EstadoPublicacion>
     */
    public function getEstadoPublicacion(): Collection
    {
        return $this->estadoPublicacion;
    }

    public function addEstadoPublicacion(EstadoPublicacion $estadoPublicacion): self
    {
        if (!$this->estadoPublicacion->contains($estadoPublicacion)) {
            $this->estadoPublicacion->add($estadoPublicacion);
        }

        return $this;
    }

    public function removeEstadoPublicacion(EstadoPublicacion $estadoPublicacion): self
    {
        $this->estadoPublicacion->removeElement($estadoPublicacion);

        return $this;
    }

    /**
     * @return Collection<int, Comentario>
     */
    public function getComentarios(): Collection
    {
        return $this->comentarios;
    }

    public function addComentario(Comentario $comentario): self
    {
        if (!$this->comentarios->contains($comentario)) {
            $this->comentarios->add($comentario);
            $comentario->setPublicacion($this);
        }

        return $this;
    }

    public function removeComentario(Comentario $comentario): self
    {
        if ($this->comentarios->removeElement($comentario)) {
            // set the owning side to null (unless already changed)
            if ($comentario->getPublicacion() === $this) {
                $comentario->setPublicacion(null);
            }
        }

        return $this;
    }

    public function getCalificacion(): ?int
    {
        return $this->calificacion;
    }

    public function setCalificacion(?int $calificacion): self
    {
        $this->calificacion = $calificacion;

        return $this;
    }

    public function getLocalidad(): ?Localidad
    {
        return $this->localidad;
    }

    public function setLocalidad(?Localidad $localidad): self
    {
        $this->localidad = $localidad;

        return $this;
    }

    public function getProvincia(): ?Provincia
    {
        return $this->provincia;
    }

    public function setProvincia(?Provincia $provincia): self
    {
        $this->provincia = $provincia;

        return $this;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): self
    {
        $this->user = $user;

        return $this;
    }

    public function getPrecio(): ?int
    {
        return $this->precio;
    }

    public function setPrecio(?int $precio): self
    {
        $this->precio = $precio;

        return $this;
    }

    public function getCategoria(): ?CategoriaPublicacion
    {
        return $this->categoria;
    }

    public function setCategoria(?CategoriaPublicacion $categoria): self
    {
        $this->categoria = $categoria;

        return $this;
    }

}
