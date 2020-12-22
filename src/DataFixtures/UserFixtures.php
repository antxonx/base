<?php
/**
 * Registros precargados para la base de datos
 */

namespace App\DataFixtures;

use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;
use App\Entity\User;

/**
 * UserFixtures class
 */
class UserFixtures extends Fixture
{
    /**
     * password encoder
     *
     * @var UserPasswordEncoderInterface
     */
    private $passwordEncoder;

    /**
     * Constructor
     *
     * @param UserPasswordEncoderInterface $passwordEncoder
     */
    public function __construct(UserPasswordEncoderInterface $passwordEncoder)
    {
        $this->passwordEncoder = $passwordEncoder;
    }

    /**
     * cargar registros a la base de adtos
     *
     * @param ObjectManager $manager
     * @return void
     */
    public function load(ObjectManager $manager)
    {
        $user = (new User)
            ->setUsername("develop")
            ->setName("Developer")
            ->setRoles([
                "ROLE_ADMIN",
                "ROLE_GOD",
                "ROLE_ALLOWED_TO_SWITCH",
                "ROLE_COMMON",
                "ROLE_SUPERVISOR"
            ])
            ->setSuspended(false)
            ->setMail("dev@dev.dev");
            $user->setPassword($this->passwordEncoder->encodePassword(
                        $user,
                        'password'
                    ));
            $manager->persist($user);

        $manager->flush();
    }
}
