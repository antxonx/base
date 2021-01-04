<?php

namespace App\Entity;

use App\Repository\ClientObsRepository;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass=ClientObsRepository::class)
 */
class ClientObs extends Obs
{

    /**
     * @ORM\ManyToOne(targetEntity=Client::class, inversedBy="clientObs")
     * @ORM\JoinColumn(nullable=false)
     */
    private $entity;

    public function getEntity(): ?Client
    {
        return $this->entity;
    }

    public function setEntity(?Client $entity): self
    {
        $this->entity = $entity;

        return $this;
    }
}
