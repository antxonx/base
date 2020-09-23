<?php
/**
 * ClientAddress entity
 */
namespace App\Entity;

use App\Repository\ClientAddressRepository;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass=ClientAddressRepository::class)
 */
class ClientAddress
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\OneToOne(targetEntity=Client::class, inversedBy="clientAddress", cascade={"persist", "remove"})
     * @ORM\JoinColumn(nullable=false)
     */
    private $client;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $street;

    /**
     * @ORM\Column(type="string", length=20)
     */
    private $extNum;

    /**
     * @ORM\Column(type="string", length=20, nullable=true)
     */
    private $intNum;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $city;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $state;

    /**
     * @ORM\Column(type="string", length=25)
     */
    private $postal;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $country;

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
     * @return Client|null
     */
    public function getClient(): ?Client
    {
        return $this->client;
    }

    /**
     * Undocumented function
     *
     * @param Client $client
     * @return self
     */
    public function setClient(Client $client): self
    {
        $this->client = $client;

        return $this;
    }

    /**
     * Undocumented function
     *
     * @return string|null
     */
    public function getStreet(): ?string
    {
        return $this->street;
    }

    /**
     * Undocumented function
     *
     * @param string $street
     * @return self
     */
    public function setStreet(string $street): self
    {
        $this->street = $street;

        return $this;
    }

    /**
     * Undocumented function
     *
     * @return string|null
     */
    public function getExtNum(): ?string
    {
        return $this->extNum;
    }

    /**
     * Undocumented function
     *
     * @param string $extNum
     * @return self
     */
    public function setExtNum(string $extNum): self
    {
        $this->extNum = $extNum;

        return $this;
    }

    /**
     * Undocumented function
     *
     * @return string|null
     */
    public function getIntNum(): ?string
    {
        return $this->intNum;
    }

    /**
     * Undocumented function
     *
     * @param string|null $intNum
     * @return self
     */
    public function setIntNum(?string $intNum): self
    {
        $this->intNum = $intNum;

        return $this;
    }

    /**
     * Undocumented function
     *
     * @return string|null
     */
    public function getCity(): ?string
    {
        return $this->city;
    }

    /**
     * Undocumented function
     *
     * @param string $city
     * @return self
     */
    public function setCity(string $city): self
    {
        $this->city = $city;

        return $this;
    }

    /**
     * Undocumented function
     *
     * @return string|null
     */
    public function getState(): ?string
    {
        return $this->state;
    }

    /**
     * Undocumented function
     *
     * @param string $state
     * @return self
     */
    public function setState(string $state): self
    {
        $this->state = $state;

        return $this;
    }

    /**
     * Undocumented function
     *
     * @return string|null
     */
    public function getPostal(): ?string
    {
        return $this->postal;
    }

    /**
     * Undocumented function
     *
     * @param string $postal
     * @return self
     */
    public function setPostal(string $postal): self
    {
        $this->postal = $postal;

        return $this;
    }

    /**
     * Undocumented function
     *
     * @return string|null
     */
    public function getCountry(): ?string
    {
        return $this->country;
    }

    /**
     * Undocumented function
     *
     * @param string $country
     * @return self
     */
    public function setCountry(string $country): self
    {
        $this->country = $country;

        return $this;
    }
}
