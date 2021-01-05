<?php

namespace Antxony;

use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Security\Core\Security;

class Observation {

    private EntityManagerInterface $em;

    protected Security $security;

    private Util $util;

    public function __construct(EntityManagerInterface $em, Security $security, Util $util)
    {
        $this->em = $em;
        $this->security = $security;
        $this->util = $util;
    }

    public function add(int $id, string $entity, string $description)
    {
        $entityF = $this->em->getRepository("App\\Entity\\$entity")->find($id);
            if ($entityF == null) {
                throw new \Exception("No se pudo encontrar la entidad");
            }
            $obsClassName = "App\\Entity\\" . $entity . "Obs";
            $obs = new $obsClassName;
            $obs
                ->setEntity($entityF)
                ->setDescription($description)
                ->created($this->security->getUser());
            $this->em->persist($obs);
            $name = $this->util->getObservationEntityName($entity);
            $message = "Se ha agregado una observación a <em>{$name}</em> <b>{$entityF->getId()}</b>.";
            $this->util->info($message);
    }
}