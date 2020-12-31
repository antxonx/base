<?php

namespace App\Entity;

// use Antxony\Entity\Obs;
use App\Repository\ScheduleObsRepository;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass=ScheduleObsRepository::class)
 */
class ScheduleObs extends Obs
{
    
    /**
     * @ORM\ManyToOne(targetEntity=Schedule::class, inversedBy="scheduleObs")
     * @ORM\JoinColumn(nullable=false)
     */
    private $entity;

    public function getEntity(): ?Schedule
    {
        return $this->entity;
    }

    public function setEntity(?Schedule $entity): self
    {
        $this->entity = $entity;

        return $this;
    }
}
