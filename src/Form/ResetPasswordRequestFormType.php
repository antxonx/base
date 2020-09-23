<?php
/**
 * ResetPasswordRequestFormType
 */

namespace App\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\EmailType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Validator\Constraints\NotBlank;

/**
 * ResetPasswordRequestFormType class
 */
class ResetPasswordRequestFormType extends AbstractType
{
    /**
     * Undocumented function
     *
     * @param FormBuilderInterface $builder
     * @param array $options
     * @return void
     */
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('mail', EmailType::class, [
                'constraints' => [
                    new NotBlank([
                        'message' => 'Ingresa tu correo',
                    ]),
                ],
                'attr' => [
                    'class' => "form-control"
                ]
            ])
        ;
    }

    /**
     * Undocumented function
     *
     * @param OptionsResolver $resolver
     * @return void
     */
    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([]);
    }
}
