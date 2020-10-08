<?php
/**
 * Contact entity
 */

namespace App\Entity;

use App\Repository\ContactRepository;
use DateTime;
use DateTimeInterface;
use DateTimeZone;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\Common\Collections\Criteria;
use Doctrine\ORM\Mapping as ORM;
use Exception;

/**
 * @ORM\Entity(repositoryClass=ContactRepository::class)
 */
class Contact
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $name;

    /**
     * @ORM\ManyToOne(targetEntity=Client::class, inversedBy="contacts")
     * @ORM\JoinColumn(nullable=false)
     */
    private $client;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $role;

    /**
     * @ORM\Column(type="datetime")
     */
    private $createdAt;

    /**
     * @ORM\Column(type="datetime")
     */
    private $updatedAt;

    /**
     * @ORM\ManyToOne(targetEntity=User::class)
     * @ORM\JoinColumn(nullable=false)
     */
    private $createdBy;

    /**
     * @ORM\ManyToOne(targetEntity=User::class)
     * @ORM\JoinColumn(nullable=false)
     */
    private $updatedBy;

    /**
     * @ORM\Column(type="boolean")
     */
    private $suspended;

    /**
     * @ORM\OneToMany(targetEntity=ContactExtra::class, mappedBy="contact", orphanRemoval=true)
     */
    private $contactExtras;

    /**
     * Undocumented function
     */
    public function __construct()
    {
        $this->contactExtras = new ArrayCollection();
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
     * Undocumented function
     *
     * @return Client|null
     */
    public function getClient(): ?Client
    {
        return $this->client;
    }

    /**
     * Undocumented function
     *
     * @param Client|null $client
     * @return self
     */
    public function setClient(?Client $client): self
    {
        $this->client = $client;

        return $this;
    }

    /**
     * Undocumented function
     *
     * @return string|null
     */
    public function getRole(): ?string
    {
        return $this->role;
    }

    /**
     * Undocumented function
     *
     * @param string $role
     * @return self
     */
    public function setRole(string $role): self
    {
        $this->role = $role;

        return $this;
    }

    /**
     * Undocumented function
     *
     * @return DateTimeInterface|null
     */
    public function getCreatedAt(): ?DateTimeInterface
    {
        return $this->createdAt;
    }

    /**
     * Undocumented function
     *
     * @param DateTimeInterface $createdAt
     * @return self
     */
    public function setCreatedAt(DateTimeInterface $createdAt): self
    {
        $this->createdAt = $createdAt;

        return $this;
    }

    /**
     * Undocumented function
     *
     * @return DateTimeInterface|null
     */
    public function getUpdatedAt(): ?DateTimeInterface
    {
        return $this->updatedAt;
    }

    /**
     * Undocumented function
     *
     * @param DateTimeInterface $updatedAt
     * @return self
     */
    public function setUpdatedAt(DateTimeInterface $updatedAt): self
    {
        $this->updatedAt = $updatedAt;

        return $this;
    }

    /**
     * Undocumented function
     *
     * @return User|null
     */
    public function getCreatedBy(): ?User
    {
        return $this->createdBy;
    }

    /**
     * Undocumented function
     *
     * @param User|null $createdBy
     * @return self
     */
    public function setCreatedBy(?User $createdBy): self
    {
        $this->createdBy = $createdBy;

        return $this;
    }

    /**
     * Undocumented function
     *
     * @return User|null
     */
    public function getUpdatedBy(): ?User
    {
        return $this->updatedBy;
    }

    /**
     * Undocumented function
     *
     * @param User|null $updatedBy
     * @return self
     */
    public function setUpdatedBy(?User $updatedBy): self
    {
        $this->updatedBy = $updatedBy;

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
     * @param integer $type
     * @return Collection|ContactExtra[]
     */
    public function getContactExtras(int $type): Collection
    {
        $criteria = new Criteria();
        $criteria->where(Criteria::expr()->eq("type", $type));
        return $this->contactExtras->matching($criteria);
    }

    /**
     * Undocumented function
     *
     * @param ContactExtra $contactExtra
     * @return self
     */
    public function addContactExtra(ContactExtra $contactExtra): self
    {
        if (!$this->contactExtras->contains($contactExtra)) {
            $this->contactExtras[] = $contactExtra;
            $contactExtra->setContact($this);
        }

        return $this;
    }

    /**
     * Undocumented function
     *
     * @param ContactExtra $contactExtra
     * @return self
     */
    public function removeContactExtra(ContactExtra $contactExtra): self
    {
        if ($this->contactExtras->contains($contactExtra)) {
            $this->contactExtras->removeElement($contactExtra);
            // set the owning side to null (unless already changed)
            if ($contactExtra->getContact() === $this) {
                $contactExtra->setContact(null);
            }
        }

        return $this;
    }

    /**
     * Establecer usuario creador
     *
     * @param User $user
     * @return self
     * @throws Exception
     */
    public function created(User $user): self
    {
        $this->createdAt = new DateTime("now", new DateTimeZone("America/Mexico_city"));
        $this->createdBy = $user;
        $this->updatedAt = new DateTime("now", new DateTimeZone("America/Mexico_city"));
        $this->updatedBy = $user;
        return $this;
    }

    /**
     * Establecer al usuario que lo actualizó
     *
     * @param User $user
     * @return self
     * @throws Exception
     */
    public function updated(User $user): self
    {
        $this->updatedAt = new DateTime("now", new DateTimeZone("America/Mexico_city"));
        $this->updatedBy = $user;
        return $this;
    }
}
