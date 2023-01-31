<?php

namespace App\Entity;

use App\Repository\UserRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Serializer\Annotation\Ignore;

#[ORM\Entity(repositoryClass: UserRepository::class)]
class User implements UserInterface, PasswordAuthenticatedUserInterface
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private $id;

    #[ORM\Column(type: 'string', length: 180, unique: true)]
    private $username;

    #[ORM\Column(type: 'json')]
    private $roles = [];

    #[ORM\Column(type: 'string')]
    private $password;

    #[ORM\Column(type: 'string', length: 50)]
    private $nombreCompleto;

    #[ORM\Column(nullable: true)]
    private ?int $strikes = 0;

    #[ORM\Column(type: 'string', length: 20,nullable: true)]
    private ?int $telefono = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $descripcion = null;

    #[ORM\Column]
    private ?bool $banneado = false;

    #[ORM\OneToMany(mappedBy: 'idVedor', targetEntity: Comentario::class)]
    private Collection $comentarios;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $pathFotoPerfil = null;

    #[ORM\OneToMany(mappedBy: 'idUser', targetEntity: Notificacion::class, orphanRemoval: true)]
    private Collection $notificacions;

    #[ORM\Column(nullable: true)]
    private ?bool $codigo = null;

    #[ORM\OneToMany(mappedBy: 'user', targetEntity: MercadoPago::class)]
    private Collection $mercadoPago;

    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: true)]
    private ?\DateTimeInterface $dateCreate = null;

    #[ORM\OneToMany(mappedBy: 'user', targetEntity: Publicacion::class, orphanRemoval: true)]
    private Collection $publicaciones;

    #[ORM\Column(length: 50, nullable: true)]
    private ?string $localidad = null;

    #[ORM\Column(length: 50, nullable: true)]
    private ?string $provincia = null;

    public function __construct()
    {
        $this->comentarios = new ArrayCollection();
        $this->notificacions = new ArrayCollection();
        $this->mercadoPago = new ArrayCollection();
        $this->publicaciones = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getUserName(): ?string
    {
        return $this->username;
    }

    public function setUserName(string $username): self
    {
        $this->username = $username;

        return $this;
    }

    /**
     * A visual identifier that represents this user.
     *
     * @see UserInterface
     */
    public function getUserIdentifier(): string
    {
        return (string) $this->username;
    }

    /**
     * @see UserInterface
     */
    public function getRoles(): array
    {
        $roles = $this->roles;
        // guarantee every user at least has ROLE_USER
        $roles[] = 'ROLE_USER';

        return array_unique($roles);
    }

    public function setRoles(array $roles): self
    {
        $this->roles = $roles;

        return $this;
    }

    /**
     * @see PasswordAuthenticatedUserInterface
     */
    public function getPassword(): string
    {
        return $this->password;
    }

    public function setPassword(string $password): self
    {
        $this->password = $password;

        return $this;
    }

    /**
     * @see UserInterface
     */
    public function eraseCredentials()
    {
        // If you store any temporary, sensitive data on the user, clear it here
        // $this->plainPassword = null;
    }

    public function getNombreCompleto(): ?string
    {
        return $this->nombreCompleto;
    }

    public function setNombreCompleto(string $nombre): self
    {
        $this->nombreCompleto = $nombre;

        return $this;
    }

    public function getStrikes(): ?int
    {
        return $this->strikes;
    }

    public function setStrikes(?int $strikes): self
    {
        $this->strikes = $strikes;

        return $this;
    }

    public function getTelefono(): ?int
    {
        return $this->telefono;
    }

    public function setTelefono(?int $telefono): self
    {
        $this->telefono = $telefono;

        return $this;
    }

    public function getDescripcion(): ?string
    {
        return $this->descripcion;
    }

    public function setDescripcion(?string $descripcion): self
    {
        $this->descripcion = $descripcion;

        return $this;
    }

    public function isBanneado(): ?bool
    {
        return $this->banneado;
    }

    public function setBanneado(bool $banneado): self
    {
        $this->banneado = $banneado;

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
            $comentario->setIdVedor($this);
        }

        return $this;
    }

    public function removeComentario(Comentario $comentario): self
    {
        if ($this->comentarios->removeElement($comentario)) {
            // set the owning side to null (unless already changed)
            if ($comentario->getIdVedor() === $this) {
                $comentario->setIdVedor(null);
            }
        }

        return $this;
    }

    public function getPathFotoPerfil(): ?string
    {
        return $this->pathFotoPerfil;
    }

    public function setPathFotoPerfil(?string $pathFotoPerfil): self
    {
        $this->pathFotoPerfil = $pathFotoPerfil;

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
            $notificacion->setIdUser($this);
        }

        return $this;
    }

    public function removeNotificacion(Notificacion $notificacion): self
    {
        if ($this->notificacions->removeElement($notificacion)) {
            // set the owning side to null (unless already changed)
            if ($notificacion->getIdUser() === $this) {
                $notificacion->setIdUser(null);
            }
        }

        return $this;
    }

    public function isCodigo(): ?bool
    {
        return $this->codigo;
    }

    public function setCodigo(?bool $codigo): self
    {
        $this->codigo = $codigo;

        return $this;
    }

    /**
     * @return Collection<int, MercadoPago>
     */
    public function getMercadoPago(): Collection
    {
        return $this->mercadoPago;
    }

    public function addMercadoPago(MercadoPago $mercadoPago): self
    {
        if (!$this->mercadoPago->contains($mercadoPago)) {
            $this->mercadoPago->add($mercadoPago);
            $mercadoPago->setUser($this);
        }

        return $this;
    }

    public function removeMercadoPago(MercadoPago $mercadoPago): self
    {
        if ($this->mercadoPago->removeElement($mercadoPago)) {
            // set the owning side to null (unless already changed)
            if ($mercadoPago->getUser() === $this) {
                $mercadoPago->setUser(null);
            }
        }

        return $this;
    }

    public function getDateCreate(): ?\DateTimeInterface
    {
        return $this->dateCreate;
    }

    public function setDateCreate(?\DateTimeInterface $dateCreate): self
    {
        $this->dateCreate = $dateCreate;

        return $this;
    }

    /**
     * @return Collection<int, Publicacion>
     */
    public function getPublicaciones(): Collection
    {
        return $this->publicaciones;
    }

    public function addPublicacione(Publicacion $publicacione): self
    {
        if (!$this->publicaciones->contains($publicacione)) {
            $this->publicaciones->add($publicacione);
            $publicacione->setUser($this);
        }

        return $this;
    }

    public function removePublicacione(Publicacion $publicacione): self
    {
        if ($this->publicaciones->removeElement($publicacione)) {
            // set the owning side to null (unless already changed)
            if ($publicacione->getUser() === $this) {
                $publicacione->setUser(null);
            }
        }

        return $this;
    }

    public function getLocalidad(): ?string
    {
        return $this->localidad;
    }

    public function setLocalidad(?string $localidad): self
    {
        $this->localidad = $localidad;

        return $this;
    }

    public function getProvincia(): ?string
    {
        return $this->provincia;
    }

    public function setProvincia(string $provincia): self
    {
        $this->provincia = $provincia;

        return $this;
    }

}
