<?php

namespace Antxony;

use Doctrine\ORM\EntityManagerInterface;
use App\Entity\Configuration as ConfigEntity;

/**
 * Configuration
 * @package Antxony
 * @author Antxony <dantonyofcarim@gmail.com>
 */
class Configuration {

    private EntityManagerInterface $em;

    public function __construct(EntityManagerInterface $em)
    {
        $this->em = $em;
    }

    public function getConfig(): array
    {
        $res = [];
        $rep = $this->em->getRepository(ConfigEntity::class);
        foreach($rep->findAll() as $con) {
            $res += [
                $con->getName() => [
                    'config' => $con->getConfig(),
                    'default' => $con->getDefaultConfig()
                ]
            ];
        }
        return $res;
    }
}