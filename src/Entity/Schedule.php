<?php

namespace App\Entity;

use App\Repository\ScheduleRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use DateTime;
use DateTimeZone;

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
     * @ORM\Column(type="datetime")
     */
    private $updatedAt;

    /**
     * @ORM\ManyToOne(targetEntity=User::class)
     * @ORM\JoinColumn(nullable=false)
     */
    private $updatedBy;

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

    /**
     * @ORM\Column(type="text")
     */
    private $detail;

    /**
     * @ORM\ManyToOne(targetEntity=Client::class)
     */
    private $client;

    /**
     * @ORM\OneToMany(targetEntity=ScheduleObs::class, mappedBy="entity", orphanRemoval=true)
     */
    private $scheduleObs;

    public function __construct()
    {
        $this->scheduleObs = new ArrayCollection();
    }

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

    public function getUpdatedAt(): ?\DateTimeInterface
    {
        return $this->updatedAt;
    }

    public function setUpdatedAt(\DateTimeInterface $updatedAt): self
    {
        $this->updatedAt = $updatedAt;

        return $this;
    }

    public function getUpdatedBy(): ?User
    {
        return $this->updatedBy;
    }

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

    public function getDetail(): ?string
    {
        return $this->detail;
    }

    public function setDetail(string $detail): self
    {
        $this->detail = $detail;

        return $this;
    }

    public function getClient(): ?Client
    {
        return $this->client;
    }

    public function setClient(?Client $client): self
    {
        $this->client = $client;

        return $this;
    }

    /**
     * @return Collection|ScheduleObs[]
     */
    public function getScheduleObs(): Collection
    {
        return $this->scheduleObs;
    }

    public function addScheduleOb(ScheduleObs $scheduleOb): self
    {
        if (!$this->scheduleObs->contains($scheduleOb)) {
            $this->scheduleObs[] = $scheduleOb;
            $scheduleOb->setEntity($this);
        }

        return $this;
    }

    public function removeScheduleOb(ScheduleObs $scheduleOb): self
    {
        if ($this->scheduleObs->removeElement($scheduleOb)) {
            // set the owning side to null (unless already changed)
            if ($scheduleOb->getEntity() === $this) {
                $scheduleOb->setEntity(null);
            }
        }

        return $this;
    }
}
