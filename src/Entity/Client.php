<?php
/**
 * Client entity
 */

namespace App\Entity;

use App\Repository\ClientRepository;
use DateTime;
use DateTimeInterface;
use DateTimeZone;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\Common\Collections\Criteria;
use Doctrine\ORM\Mapping as ORM;
use Exception;

/**
 * @ORM\Entity(repositoryClass=ClientRepository::class)
 */
class Client
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
     * @ORM\OneToOne(targetEntity=ClientAddress::class, mappedBy="client", cascade={"persist", "remove"})
     */
    private $clientAddress;

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
     * @ORM\OneToMany(targetEntity=ClientExtra::class, mappedBy="client", orphanRemoval=true)
     */
    private $clientExtras;

    /**
     * @ORM\OneToMany(targetEntity=Contact::class, mappedBy="client", orphanRemoval=true)
     */
    private $contacts;

    /**
     * construct
     */
    public function __construct()
    {
        $this->clientExtras = new ArrayCollection();
        $this->contacts = new ArrayCollection();
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
     * @return ClientAddress|null
     */
    public function getClientAddress(): ?ClientAddress
    {
        return $this->clientAddress;
    }

    /**
     * Undocumented function
     *
     * @param ClientAddress $clientAddress
     * @return self
     */
    public function setClientAddress(ClientAddress $clientAddress): self
    {
        $this->clientAddress = $clientAddress;

        // set the owning side of the relation if necessary
        if ($clientAddress->getClient() !== $this) {
            $clientAddress->setClient($this);
        }

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
     * @param int $type
     * @return Collection|ClientExtra[]
     */
    public function getClientExtras(int $type): Collection
    {
        $criteria = new Criteria();
        $criteria->where(Criteria::expr()->eq("type", $type));
        return $this->clientExtras->matching($criteria);
    }

    /**
     * Undocumented function
     *
     * @param ClientExtra $clientExtra
     * @return self
     */
    public function addClientExtra(ClientExtra $clientExtra): self
    {
        if (!$this->clientExtras->contains($clientExtra)) {
            $this->clientExtras[] = $clientExtra;
            $clientExtra->setClient($this);
        }

        return $this;
    }

    /**
     * Undocumented function
     *
     * @param ClientExtra $clientExtra
     * @return self
     */
    public function removeClientExtra(ClientExtra $clientExtra): self
    {
        if ($this->clientExtras->contains($clientExtra)) {
            $this->clientExtras->removeElement($clientExtra);
            // set the owning side to null (unless already changed)
            if ($clientExtra->getClient() === $this) {
                $clientExtra->setClient(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection|Contact[]
     */
    public function getContacts(): Collection
    {
        $criteria = new Criteria();
        $criteria->where(Criteria::expr()->eq('suspended', '0'));
        return $this->contacts->matching($criteria);
    }

    /**
     * Undocumented function
     *
     * @param Contact $contact
     * @return self
     */
    public function addContact(Contact $contact): self
    {
        if (!$this->contacts->contains($contact)) {
            $this->contacts[] = $contact;
            $contact->setClient($this);
        }

        return $this;
    }

    /**
     * Undocumented function
     *
     * @param Contact $contact
     * @return self
     */
    public function removeContact(Contact $contact): self
    {
        if ($this->contacts->contains($contact)) {
            $this->contacts->removeElement($contact);
            // set the owning side to null (unless already changed)
            if ($contact->getClient() === $this) {
                $contact->setClient(null);
            }
        }

        return $this;
    }
}
