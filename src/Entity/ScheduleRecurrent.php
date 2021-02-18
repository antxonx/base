<?php

namespace App\Entity;

use App\Repository\ScheduleRecurrentRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use DateTime;
use DateTimeZone;

/**
 * @ORM\Entity(repositoryClass=ScheduleRecurrentRepository::class)
 */
class ScheduleRecurrent
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
    private $createdAt;

    /**
     * @ORM\ManyToOne(targetEntity=User::class, inversedBy="schedulesRecurrent")
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
     * @ORM\ManyToOne(targetEntity=ScheduleCategory::class, inversedBy="schedulesRecurrent")
     */
    private $category;

    /**
     * @ORM\ManyToOne(targetEntity=User::class, inversedBy="assignedSchedulesRecurrent")
     */
    private $assigned;

    /**
     * @ORM\ManyToOne(targetEntity=SchedulePriority::class, inversedBy="schedulesRecurrent")
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
     * @ORM\OneToMany(targetEntity=ScheduleRecurrentObs::class, mappedBy="entity", orphanRemoval=true)
     */
    private $scheduleRecurrentObs;

    /**
     * @ORM\Column(type="integer")
     */
    private $type;

    /**
     * @ORM\Column(type="array")
     */
    private $days = [];

    public function __construct()
    {
        $this->scheduleRecurrentObs = new ArrayCollection();
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
     * @return Collection|ScheduleRecurrentObs[]
     */
    public function getScheduleRecurrentObs(): Collection
    {
        return $this->scheduleRecurrentObs;
    }

    public function addScheduleRecurrentOb(ScheduleRecurrentObs $scheduleRecurrentOb): self
    {
        if (!$this->scheduleRecurrentObs->contains($scheduleRecurrentOb)) {
            $this->scheduleRecurrentObs[] = $scheduleRecurrentOb;
            $scheduleRecurrentOb->setEntity($this);
        }

        return $this;
    }

    public function removeScheduleRecurrentOb(ScheduleRecurrentObs $scheduleRecurrentOb): self
    {
        if ($this->scheduleRecurrentObs->removeElement($scheduleRecurrentOb)) {
            // set the owning side to null (unless already changed)
            if ($scheduleRecurrentOb->getEntity() === $this) {
                $scheduleRecurrentOb->setEntity(null);
            }
        }

        return $this;
    }

    public function getType(): ?int
    {
        return $this->type;
    }

    public function setType(int $type): self
    {
        $this->type = $type;

        return $this;
    }

    public function getDays(): ?array
    {
        return $this->days;
    }

    public function setDays(array $days): self
    {
        $this->days = $days;

        return $this;
    }
}
