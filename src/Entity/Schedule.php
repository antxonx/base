<?php

namespace App\Entity;

use App\Repository\ScheduleRepository;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass=ScheduleRepository::class)
 */
class Schedule
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $title;

    /**
     * @ORM\Column(type="datetime")
     */
    private $date;

    /**
     * @ORM\Column(type="datetime")
     */
    private $createdAt;

    /**
     * @ORM\ManyToOne(targetEntity=User::class, inversedBy="schedules")
     * @ORM\JoinColumn(nullable=false)
     */
    private $createdBy;

    /**
     * @ORM\ManyToOne(targetEntity=ScheduleCategory::class, inversedBy="schedules")
     */
    private $category;

    /**
     * @ORM\Column(type="boolean")
     */
    private $done;

    /**
     * @ORM\ManyToOne(targetEntity=User::class, inversedBy="assignedSchedules")
     */
    private $assigned;

    /**
     * @ORM\ManyToOne(targetEntity=SchedulePriority::class, inversedBy="schedules")
     */
    private $priority;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTitle(): ?string
    {
        return $this->title;
    }

    public function setTitle(string $title): self
    {
        $this->title = $title;

        return $this;
    }

    public function getDate(): ?\DateTimeInterface
    {
        return $this->date;
    }

    public function setDate(\DateTimeInterface $date): self
    {
        $this->date = $date;

        return $this;
    }

    public function getCreatedAt(): ?\DateTimeInterface
    {
        return $this->createdAt;
    }

    public function setCreatedAt(\DateTimeInterface $createdAt): self
    {
        $this->createdAt = $createdAt;

        return $this;
    }

    public function getCreatedBy(): ?User
    {
        return $this->createdBy;
    }

    public function setCreatedBy(?User $createdBy): self
    {
        $this->createdBy = $createdBy;

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

    public function getCategory(): ?ScheduleCategory
    {
        return $this->category;
    }

    public function setCategory(?ScheduleCategory $category): self
    {
        $this->category = $category;

        return $this;
    }

    public function getDone(): ?bool
    {
        return $this->done;
    }

    public function setDone(bool $done): self
    {
        $this->done = $done;

        return $this;
    }

    public function getAssigned(): ?User
    {
        return $this->assigned;
    }

    public function setAssigned(?User $assigned): self
    {
        $this->assigned = $assigned;

        return $this;
    }

    public function getPriority(): ?SchedulePriority
    {
        return $this->priority;
    }

    public function setPriority(?SchedulePriority $priority): self
    {
        $this->priority = $priority;

        return $this;
    }
}
