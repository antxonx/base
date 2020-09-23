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
            ->setUsername("admin")
            ->setName("Administrador")
            ->setRoles([
                "ROLE_ADMIN",
                "ROLE_GOD",
                "ROLE_ALLOWED_TO_SWITCH",
                "ROLE_TEST"
            ])
            ->setSuspended(false)
            ->setMail("admin@admin.com");
            $user->setPassword($this->passwordEncoder->encodePassword(
                        $user,
                        'password'
                    ));
            $manager->persist($user);

        $manager->flush();
    }
}
