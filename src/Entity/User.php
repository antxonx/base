<?php
/**
 * Enitdad Usuario
 */

namespace App\Entity;

use App\Repository\UserRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping\UniqueConstraint;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Security\Core\User\UserInterface;

/**
 * @ORM\Entity(repositoryClass=UserRepository::class)
 * @ORM\Table(name="user", uniqueConstraints={
 *      @UniqueConstraint(name="UQ_USERNAME", columns={"username"}),
 *      @UniqueConstraint(name="UQ_MAIL", columns={"mail"})
 * })
 */
class User implements UserInterface
{
    /**
     * @var string
     */
    const FK_USERNAME = "UQ_USERNAME";

    /**
     * @var string
     */
    const FK_MAIL = "UQ_MAIL";

    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=180)
     */
    private $username;

    /**
     * @ORM\Column(type="json")
     */
    private $roles = [];

    /**
     * @var string The hashed password
     * @ORM\Column(type="string")
     */
    private $password;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $mail;

    /**
     * @ORM\Column(type="boolean")
     */
    private $suspended;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $name;

    /**
     * @ORM\OneToMany(targetEntity=InfoLog::class, mappedBy="user")
     */
    private $infoLogs;

    /**
     * @ORM\OneToMany(targetEntity=ErrorLog::class, mappedBy="user")
     */
    private $errorLogs;

    public function __construct()
    {
        $this->infoLogs = new ArrayCollection();
        $this->errorLogs = new ArrayCollection();
    }

    /**
     * Undocumented function
     *
     * @return integer|null
     */
    public function getId(): ?int
    {
        return $this->id;
    }

    /**
     * A visual identifier that represents this user.
     *
     * @see UserInterface
     */
    public function getUsername(): string
    {
        return (string)$this->username;
    }

    /**
     * Undocumented function
     *
     * @param string $username
     * @return self
     */
    public function setUsername(string $username): self
    {
        $this->username = $username;

        return $this;
    }

    /**
     * @return array
     * @see UserInterface
     *
     */
    public function getRoles(): array
    {
        $roles = $this->roles;
        // guarantee every user at least has ROLE_USER
        $roles[] = 'ROLE_USER';

        return array_unique($roles);
    }

    /**
     * Undocumented function
     *
     * @param array $roles
     * @return self
     */
    public function setRoles(array $roles): self
    {
        $this->roles = $roles;

        return $this;
    }

    /**
     * @return string
     * @see UserInterface
     *
     */
    public function getPassword(): string
    {
        return (string)$this->password;
    }

    /**
     * Undocumented function
     *
     * @param string $password
     * @return self
     */
    public function setPassword(string $password): self
    {
        $this->password = $password;

        return $this;
    }

    /**
     * @return void
     * @see UserInterface
     *
     */
    public function getSalt()
    {
        // not needed when using the "bcrypt" algorithm in security.yaml
    }

    /**
     * @return void
     * @see UserInterface
     *
     */
    public function eraseCredentials()
    {
        // If you store any temporary, sensitive data on the user, clear it here
        // $this->plainPassword = null;
    }

    /**
     * Undocumented function
     *
     * @return string|null
     */
    public function getMail(): ?string
    {
        return $this->mail;
    }

    /**
     * Undocumented function
     *
     * @param string $mail
     * @return self
     */
    public function setMail(string $mail): self
    {
        $this->mail = $mail;

        return $this;
    }

    /**
     * Undocumented function
     *
     * @return boolean|null
     */
    public function getSuspended(): ?bool
    {
        return $this->suspended;
    }

    /**
     * Undocumented function
     *
     * @param boolean $suspended
     * @return self
     */
    public function setSuspended(bool $suspended): self
    {
        $this->suspended = $suspended;

        return $this;
    }

    /**
     * Undocumented function
     *
     * @return string|null
     */
    public function getName(): ?string
    {
        return $this->name;
    }

    /**
     * Undocumented function
     *
     * @param string $name
     * @return self
     */
    public function setName(string $name): self
    {
        $this->name = $name;

        return $this;
    }

    /**
     * Saber si este usuario tiene un rol especifico
     *
     * @param string $role
     * @return boolean
     */
    public function hasRole(string $role): bool
    {
        return in_array($role, $this->roles);
    }

    /**
     * @return Collection|InfoLog[]
     */
    public function getInfoLogs(): Collection
    {
        return $this->infoLogs;
    }

    public function addInfoLog(InfoLog $infoLog): self
    {
        if (!$this->infoLogs->contains($infoLog)) {
            $this->infoLogs[] = $infoLog;
            $infoLog->setUser($this);
        }

        return $this;
    }

    public function removeInfoLog(InfoLog $infoLog): self
    {
        if ($this->infoLogs->removeElement($infoLog)) {
            // set the owning side to null (unless already changed)
            if ($infoLog->getUser() === $this) {
                $infoLog->setUser(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection|ErrorLog[]
     */
    public function getErrorLogs(): Collection
    {
        return $this->errorLogs;
    }

    public function addErrorLog(ErrorLog $errorLog): self
    {
        if (!$this->errorLogs->contains($errorLog)) {
            $this->errorLogs[] = $errorLog;
            $errorLog->setUser($this);
        }

        return $this;
    }

    public function removeErrorLog(ErrorLog $errorLog): self
    {
        if ($this->errorLogs->removeElement($errorLog)) {
            // set the owning side to null (unless already changed)
            if ($errorLog->getUser() === $this) {
                $errorLog->setUser(null);
            }
        }

        return $this;
    }
}
