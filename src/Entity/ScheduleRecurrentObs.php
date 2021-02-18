<?php

namespace App\Entity;

use App\Repository\ScheduleRecurrentObsRepository;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass=ScheduleRecurrentObsRepository::class)
 */
class ScheduleRecurrentObs extends Obs
{
    
    /**
     * @ORM\ManyToOne(targetEntity=ScheduleRecurrent::class, inversedBy="scheduleRecurrentObs")
     * @ORM\JoinColumn(nullable=false)
     */
    private $entity;

    public function getEntity(): ?ScheduleRecurrent
    {
        return $this->entity;
    }

    public function setEntity(?ScheduleRecurrent $entity): self
    {
        $this->entity = $entity;

        return $this;
    }
}
