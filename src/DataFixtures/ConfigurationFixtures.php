<?php

namespace App\DataFixtures;

use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use App\Entity\Configuration;

/**
 * ConfigurationFixtures class
 */
class ConfigurationFixtures extends Fixture
{

    /**
     * cargar registros a la base de adtos
     *
     * @param ObjectManager $manager
     * @return void
     */
    public function load(ObjectManager $manager)
    {
        $config = (new Configuration)
            ->setName("TaskCommentedBorder")
            ->setConfig([
                "style" => "border: 2px dotted yellow"
            ])
            ->setDefaultConfig([
                "style" => "border: 2px dotted yellow"
            ]);
        $manager->persist($config);
        $config = (new Configuration)
            ->setName("TaskDoneColors")
            ->setConfig([
                "background-color" => "#e8e8e8",
                "color" => "#525252"
            ])
            ->setDefaultConfig([
                "background-color" => "#e8e8e8",
                "color" => "#525252"
            ]);
        $manager->persist($config);

        $manager->flush();
    }
}
